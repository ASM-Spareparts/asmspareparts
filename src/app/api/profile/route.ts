import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = userId as string;

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
        return NextResponse.json(
            { error: "Server not configured for persistence. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
            { status: 500 }
        );
    }

    const body = await req.json().catch(() => ({}));
    const { full_name, address, phone_number } = body as {
        full_name?: string;
        address?: string;
        phone_number?: string;
    };

    if (
        typeof full_name !== "string" ||
        typeof address !== "string" ||
        typeof phone_number !== "string"
    ) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const headers = {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        Prefer: "return=representation",
    } as const;

    async function patchByColumn(column: "id") {
        const url = `${SUPABASE_URL}/rest/v1/profiles?${column}=eq.${encodeURIComponent(uid)}`;
        const res = await fetch(url, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ full_name, address, phone_number }),
        });
        return res;
    }

    // Try update by user_id first (common schema), then fallback to id
    let res = await patchByColumn("id");
    let data: unknown = null;
    if (res.ok) {
        data = await res.json().catch(() => []);
    } else {
        const text = await res.text();
        // If table/column mismatch, try fallback
        res = await patchByColumn("id");
        if (res.ok) {
            data = await res.json().catch(() => []);
        } else {
            const text2 = await res.text();
            return NextResponse.json({ error: text || text2 || "Update failed" }, { status: 500 });
        }
    }

    const rows = Array.isArray(data) ? data : [];
    if (rows.length > 0) {
        return NextResponse.json({ profile: rows[0] });
    }

    // If no row updated, perform an upsert via POST with on_conflict for either user_id or id
    async function upsertWith(column: "id") {
        const url = `${SUPABASE_URL}/rest/v1/profiles?on_conflict=${column}`;
        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ [column]: uid, full_name, address, phone_number }),
        });
        return res;
    }

    let insertRes = await upsertWith("id");
    if (!insertRes.ok) {
        // fallback to id if user_id fails
        insertRes = await upsertWith("id");
        if (!insertRes.ok) {
            const text = await insertRes.text();
            return NextResponse.json({ error: text || "Upsert failed" }, { status: 500 });
        }
    }

    const inserted = await insertRes.json().catch(() => []);
    return NextResponse.json({ profile: Array.isArray(inserted) ? inserted[0] : inserted });
}

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const uid = userId as string;

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
        return NextResponse.json(
            { error: "Server not configured for persistence. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
            { status: 500 }
        );
    }

    const headers = {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
    } as const;

    async function fetchBy(column: "id") {
        const url = `${SUPABASE_URL}/rest/v1/profiles?select=*&${column}=eq.${encodeURIComponent(uid)}`;
        const res = await fetch(url, { headers });
        return res.ok ? res.json() : [];
    }

    const byUserId = await fetchBy("id");
    const rows = Array.isArray(byUserId) && byUserId.length > 0 ? byUserId : await fetchBy("id");
    const profile = Array.isArray(rows) ? rows[0] : null;
    return NextResponse.json({ profile });
}
