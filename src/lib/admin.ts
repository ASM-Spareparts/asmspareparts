import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSessionOrThrow() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");
    return session;
}

export function isAdminEmail(email: string | null | undefined) {
    const allow = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (allow.length === 0) return false;
    return !!email && allow.includes(email.toLowerCase());
}

export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
        throw new Error("Forbidden");
    }
    return session;
}
