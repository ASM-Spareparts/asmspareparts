import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
type SessionWithId = {
    user?: {
        id?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
    } | null;
};

function getEnv() {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
    return { SUPABASE_URL, SERVICE_ROLE };
}

// Simple in-memory sliding-window rate limiter (best-effort)
const windowHits = new Map<string, number[]>();
function rateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const arr = windowHits.get(key) || [];
    const kept = arr.filter((t) => now - t < windowMs);
    if (kept.length >= limit) return false;
    kept.push(now);
    windowHits.set(key, kept);
    return true;
}

function getClientKey(req: Request, userId?: string | null) {
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
    return userId ? `u:${userId}` : `ip:${ip}`;
}

function normalizeCode(input: string) {
    return input.trim().toUpperCase();
}

function validFormat(code: string) {
    // Must be 6-64 chars, uppercase alnum and dashes, and start with ASM-
    if (!code.startsWith("ASM-")) return false;
    return /^[A-Z0-9-]{6,64}$/.test(code);
}

export async function POST(req: Request) {
    const session = (await getServerSession(authOptions)) as SessionWithId | null;
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) {
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const rawCode = typeof body?.code === "string" ? body.code : "";
    const code = normalizeCode(rawCode);
    if (!code || !validFormat(code)) {
        return NextResponse.json({ error: "Kode tidak valid" }, { status: 400 });
    }

    // Rate limit (both per-IP and per-user) to reduce brute force
    const ipKey = getClientKey(req, null);
    const userKey = getClientKey(req, session.user.id as string);
    if (!rateLimit(ipKey, 10, 60_000) || !rateLimit(userKey, 10, 60_000)) {
        return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
    }

    const baseHeaders: Record<string, string> = {
        apikey: SERVICE_ROLE as string,
        Authorization: `Bearer ${SERVICE_ROLE}`,
    };

    // 1) Find code
    const getUrl = `${SUPABASE_URL}/rest/v1/lottery_codes?select=id,code,campaign_id,prize_id,user_id&code=eq.${encodeURIComponent(
        code
    )}`;
    const r1 = await fetch(getUrl, { headers: baseHeaders });
    if (!r1.ok) {
        const text = await r1.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const rows = (await r1.json()) as Array<{
        id: number;
        code: string;
        campaign_id: number;
        prize_id: number;
        user_id: string | null;
    }>;
    if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "Kode tidak ditemukan" }, { status: 404 });
    }
    const row = rows[0];

    // 2) If already claimed
    if (row.user_id) {
        const mine = row.user_id === session.user.id;
        return NextResponse.json(
            { error: mine ? "Kode ini sudah Anda klaim" : "Kode sudah digunakan" },
            { status: 409 }
        );
    }

    // 3) Claim atomically: only when user_id is null
    const patchUrl = `${SUPABASE_URL}/rest/v1/lottery_codes?code=eq.${encodeURIComponent(
        code
    )}&user_id=is.null`;
    const r2 = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
            ...baseHeaders,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify({ user_id: session.user.id }),
    });
    if (!r2.ok) {
        const text = await r2.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const updated = (await r2.json()) as Array<any>;
    if (!Array.isArray(updated) || updated.length === 0) {
        // Someone else claimed it first
        return NextResponse.json({ error: "Kode sudah digunakan" }, { status: 409 });
    }
    const claimed = updated[0] as {
        id: number;
        code: string;
        campaign_id: number;
        prize_id: number;
    };

    // 4) Enrich prize and campaign for nicer UX
    let prize: { id: number; description: string; rank: number } | null = null;
    let campaign: { id: number; name: string } | null = null;
    const pRes = await fetch(
        `${SUPABASE_URL}/rest/v1/prizes?select=id,description,rank&id=eq.${claimed.prize_id}`,
        { headers: baseHeaders }
    );
    if (pRes.ok) {
        const pr = await pRes.json();
        if (Array.isArray(pr) && pr[0]) prize = { id: pr[0].id, description: pr[0].description, rank: pr[0].rank };
    }
    const cRes = await fetch(
        `${SUPABASE_URL}/rest/v1/campaigns?select=id,name&id=eq.${claimed.campaign_id}`,
        { headers: baseHeaders }
    );
    if (cRes.ok) {
        const cr = await cRes.json();
        if (Array.isArray(cr) && cr[0]) campaign = { id: cr[0].id, name: cr[0].name };
    }

    return NextResponse.json({
        success: true,
        code: claimed.code,
        prize,
        campaign,
    });
}
