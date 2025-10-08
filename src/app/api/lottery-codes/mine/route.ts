import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getEnv() {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
    return { SUPABASE_URL, SERVICE_ROLE };
}

type SessionWithId = {
    user?: {
        id?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
    } | null;
};

export async function GET() {
    const session = (await getServerSession(authOptions)) as SessionWithId | null;
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id as string;

    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) {
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const baseHeaders: Record<string, string> = {
        apikey: SERVICE_ROLE as string,
        Authorization: `Bearer ${SERVICE_ROLE}`,
    };

    // Fetch user's claimed codes
    const listUrl = `${SUPABASE_URL}/rest/v1/lottery_codes?select=id,created_at,code,campaign_id,prize_id&user_id=eq.${encodeURIComponent(
        userId
    )}&order=created_at.desc`;
    const r1 = await fetch(listUrl, { headers: baseHeaders });
    if (!r1.ok) {
        const text = await r1.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const rows = (await r1.json()) as Array<{
        id: number;
        created_at: string;
        code: string;
        campaign_id: number;
        prize_id: number;
    }>;

    // Enrich with prize and campaign details
    const campaignIds = Array.from(new Set(rows.map((c) => c.campaign_id))).filter(Boolean);
    const prizeIds = Array.from(new Set(rows.map((c) => c.prize_id))).filter(Boolean);

    async function fetchJSON(url: string) {
        const r = await fetch(url, { headers: baseHeaders });
        if (!r.ok) return null;
        return r.json();
    }

    const campaignsMap = new Map<number, { id: number; name: string }>();
    const prizesMap = new Map<number, { id: number; description: string; rank: number }>();

    if (campaignIds.length) {
        const c = (await fetchJSON(
            `${SUPABASE_URL}/rest/v1/campaigns?select=id,name&id=in.(${campaignIds.join(",")})`
        )) as Array<{ id: number; name: string }> | null;
        if (Array.isArray(c))
            c.forEach((x) => campaignsMap.set(Number(x.id), { id: Number(x.id), name: x.name }));
    }
    if (prizeIds.length) {
        const p = (await fetchJSON(
            `${SUPABASE_URL}/rest/v1/prizes?select=id,description,rank&id=in.(${prizeIds.join(",")})`
        )) as Array<{ id: number; description: string; rank: number }> | null;
        if (Array.isArray(p))
            p.forEach((x) =>
                prizesMap.set(Number(x.id), {
                    id: Number(x.id),
                    description: x.description,
                    rank: Number(x.rank),
                })
            );
    }

    const enriched = rows.map((c) => ({
        ...c,
        campaign: campaignsMap.get(c.campaign_id) || null,
        prize: prizesMap.get(c.prize_id) || null,
    }));

    return NextResponse.json({ codes: enriched });
}
