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

export async function GET(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaign_id");
    const filter = campaignId ? `&campaign_id=eq.${encodeURIComponent(campaignId)}` : "";
    const res = await fetch(`${SUPABASE_URL}/rest/v1/prizes?select=*${filter}&order=rank.asc`, {
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ prizes: data });
}

type PrizePayload = {
    campaign_id: number;
    rank: number;
    description: string;
    quantity: number;
};

export async function POST(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const body = (await req.json().catch(() => ({}))) as Partial<PrizePayload>;
    const { campaign_id, rank, description, quantity } = body;
    if (!campaign_id || !rank || !description || !quantity) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const payload = [{ campaign_id, rank, description, quantity }];
    const res = await fetch(`${SUPABASE_URL}/rest/v1/prizes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_ROLE,
            Authorization: `Bearer ${SERVICE_ROLE}`,
            Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ prize: Array.isArray(data) ? data[0] : data });
}

export async function PATCH(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const body = (await req.json().catch(() => ({}))) as Partial<PrizePayload> & { id?: number };
    const { id, campaign_id, rank, description, quantity } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (typeof campaign_id !== "undefined") update.campaign_id = campaign_id;
    if (typeof rank !== "undefined") update.rank = rank;
    if (typeof description !== "undefined") update.description = description;
    if (typeof quantity !== "undefined") update.quantity = quantity;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/prizes?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_ROLE,
            Authorization: `Bearer ${SERVICE_ROLE}`,
            Prefer: "return=representation",
        },
        body: JSON.stringify(update),
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ prize: Array.isArray(data) ? data[0] : data });
}

export async function DELETE(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/prizes?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}
