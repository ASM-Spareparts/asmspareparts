import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

function getEnv() {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
    return { SUPABASE_URL, SERVICE_ROLE };
}

async function requireAdminOr401() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
        return null;
    }
    return session;
}

function randomCode(len = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

export async function POST(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { campaign_id, prize_id, count } = body as { campaign_id?: number; prize_id?: number; count?: number };
    if (!campaign_id || !prize_id || !count || count <= 0) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Insert in batches, ensuring we stop exactly at requested count.
    const url = `${SUPABASE_URL}/rest/v1/lottery_codes?on_conflict=code`;
    const batchSize = Math.min(500, count);
    let total = 0;
    let safety = 0;
    const newCodes: string[] = [];
    const PREFIX = "ASM-";
    while (total < count && safety < 20) {
        safety++;
        const need = count - total;
        const toMake = Math.min(batchSize, need * 2); // create a little extra to avoid duplicates
        const payload = Array.from({ length: toMake }, () => ({ code: `${PREFIX}${randomCode(12)}`, campaign_id, prize_id }));
        const r = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: SERVICE_ROLE,
                Authorization: `Bearer ${SERVICE_ROLE}`,
                Prefer: "return=representation,resolution=ignore-duplicates",
            },
            body: JSON.stringify(payload),
        });
        if (!r.ok) {
            const text = await r.text();
            return NextResponse.json({ error: text }, { status: 500 });
        }
        const d = await r.json();
        const ins = Array.isArray(d) ? d.length : 0;
        if (Array.isArray(d)) {
            for (const row of d) {
                if (row && typeof row.code === "string") newCodes.push(row.code);
            }
        }
        total += ins;
        if (ins === 0) break; // avoid infinite loop if we somehow cannot insert more
    }

    // Cap at requested count for the response to avoid perceived off-by-one
    return NextResponse.json({ inserted: Math.min(total, count), codes: newCodes.slice(0, count) });
}

export async function GET(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 500);
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
    const order = searchParams.get("order") || "created_at.desc";

    // 1) Fetch codes page
    const codesUrl = `${SUPABASE_URL}/rest/v1/lottery_codes?select=id,created_at,code,campaign_id,prize_id,user_id&order=${encodeURIComponent(
        order
    )}&limit=${limit}&offset=${offset}`;
    const baseHeaders: Record<string, string> = {
        apikey: SERVICE_ROLE as string,
        Authorization: `Bearer ${SERVICE_ROLE}`,
    };
    const codesRes = await fetch(codesUrl, { headers: baseHeaders });
    if (!codesRes.ok) {
        const text = await codesRes.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const codes = (await codesRes.json()) as Array<{
        id: number;
        created_at: string;
        code: string;
        campaign_id: number;
        prize_id: number;
        user_id: string | null;
    }>;

    // 2) Build lookup sets
    const campaignIds = Array.from(new Set(codes.map((c) => c.campaign_id))).filter(Boolean);
    const prizeIds = Array.from(new Set(codes.map((c) => c.prize_id))).filter(Boolean);
    const userIds = Array.from(new Set(codes.map((c) => c.user_id).filter(Boolean))) as string[];

    async function fetchJSON(url: string) {
        const r = await fetch(url, { headers: baseHeaders });
        if (!r.ok) return null;
        return r.json();
    }

    // 3) Enrich from campaigns and prizes
    const campaignsMap = new Map<number, { id: number; name: string }>();
    const prizesMap = new Map<number, { id: number; description: string; rank: number }>();
    const usersMap = new Map<string, { id: string; email: string | null; name: string | null }>();

    if (campaignIds.length) {
        const c = (await fetchJSON(
            `${SUPABASE_URL}/rest/v1/campaigns?select=id,name&id=in.(${campaignIds.join(",")})`
        )) as Array<{ id: number; name: string }> | null;
        if (Array.isArray(c)) c.forEach((x) => campaignsMap.set(Number(x.id), { id: Number(x.id), name: x.name }));
    }
    if (prizeIds.length) {
        const p = (await fetchJSON(
            `${SUPABASE_URL}/rest/v1/prizes?select=id,description,rank&id=in.(${prizeIds.join(",")})`
        )) as Array<{ id: number; description: string; rank: number }> | null;
        if (Array.isArray(p))
            p.forEach((x) => prizesMap.set(Number(x.id), { id: Number(x.id), description: x.description, rank: Number(x.rank) }));
    }
    // next_auth users may not be exposed; try and ignore failure gracefully
    if (userIds.length) {
        const u = (await fetchJSON(
            `${SUPABASE_URL}/rest/v1/next_auth_users?select=id,email,name&id=in.(${userIds
                .map((id) => `"${id}"`)
                .join(",")})`
        )) as Array<{ id: string; email: string | null; name: string | null }> | null;
        if (Array.isArray(u)) u.forEach((x) => usersMap.set(String(x.id), { id: String(x.id), email: x.email ?? null, name: x.name ?? null }));
    }

    const enriched = codes.map((c) => ({
        ...c,
        campaign: campaignsMap.get(c.campaign_id) || null,
        prize: prizesMap.get(c.prize_id) || null,
        user: c.user_id ? usersMap.get(c.user_id) || { id: c.user_id, email: null, name: null } : null,
    }));

    return NextResponse.json({ codes: enriched, limit, offset });
}

export async function DELETE(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const id = idParam ? Number(idParam) : NaN;
    if (!id || Number.isNaN(id)) {
        return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
    }

    const url = `${SUPABASE_URL}/rest/v1/lottery_codes?id=eq.${id}`;
    const r = await fetch(url, {
        method: "DELETE",
        headers: {
            apikey: SERVICE_ROLE as string,
            Authorization: `Bearer ${SERVICE_ROLE}`,
            Prefer: "return=representation",
        },
    });
    if (!r.ok) {
        const text = await r.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await r.json().catch(() => null);
    return NextResponse.json({ deleted: Array.isArray(data) ? data.length : 0 });
}
