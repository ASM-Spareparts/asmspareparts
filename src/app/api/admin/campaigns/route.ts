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

export async function GET() {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?select=*&order=id.desc`, {
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
        // cache: 'no-store'
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ campaigns: data });
}

type CampaignPayload = {
    name: string;
    start_date?: string | null;
    end_date?: string | null;
    raffle_date?: string | null;
    is_active?: boolean;
};

export async function POST(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const body = (await req.json().catch(() => ({}))) as Partial<CampaignPayload>;
    const { name, start_date, end_date, raffle_date, is_active } = body;
    if (!name || typeof name !== "string") return NextResponse.json({ error: "Invalid name" }, { status: 400 });

    const payload = [{ name, start_date, end_date, raffle_date, is_active: !!is_active }];
    const res = await fetch(`${SUPABASE_URL}/rest/v1/campaigns`, {
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
    return NextResponse.json({ campaign: Array.isArray(data) ? data[0] : data });
}

export async function PATCH(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const body = (await req.json().catch(() => ({}))) as Partial<CampaignPayload> & { id?: number };
    const { id, name, start_date, end_date, raffle_date, is_active } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (typeof name !== "undefined") update.name = name;
    if (typeof start_date !== "undefined") update.start_date = start_date;
    if (typeof end_date !== "undefined") update.end_date = end_date;
    if (typeof raffle_date !== "undefined") update.raffle_date = raffle_date;
    if (typeof is_active !== "undefined") update.is_active = !!is_active;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?id=eq.${encodeURIComponent(id)}`, {
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
    return NextResponse.json({ campaign: Array.isArray(data) ? data[0] : data });
}

export async function DELETE(req: Request) {
    const session = await requireAdminOr401();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { SUPABASE_URL, SERVICE_ROLE } = getEnv();
    if (!SUPABASE_URL || !SERVICE_ROLE) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
    });
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}
