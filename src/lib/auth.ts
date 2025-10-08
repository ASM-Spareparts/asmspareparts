import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Adapter } from "next-auth/adapters";

// Resolve Supabase envs; don't throw at import-time to avoid module evaluation errors.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;

let adapter: Adapter | undefined = undefined;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    adapter = SupabaseAdapter({
        url: SUPABASE_URL,
        secret: SUPABASE_SERVICE_ROLE_KEY,
    }) as Adapter;
} else {
    if (process.env.NODE_ENV !== "production") {
        console.warn(
            "Supabase Adapter not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local to enable persistence. Falling back to JWT-only sessions."
        );
    }
}

export const authOptions: NextAuthOptions = {
    ...(adapter ? { adapter } : {}),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    session: {
        strategy: "jwt",
    },
    events: {
        async createUser({ user }) {
            // Eagerly create a matching profile row for new users.
            const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
            const SERVICE_ROLE =
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET;
            if (!SUPABASE_URL || !SERVICE_ROLE) return;

            // Your current API/routes use profiles keyed by `id` referencing next_auth.users(id).
            // If you switch to `user_id`, change on_conflict and body accordingly.
            try {
                await fetch(`${SUPABASE_URL}/rest/v1/profiles?on_conflict=id`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: SERVICE_ROLE,
                        Authorization: `Bearer ${SERVICE_ROLE}`,
                        Prefer: "return=minimal",
                    },
                    body: JSON.stringify({
                        id: user.id,
                        full_name: (user?.name as string | null) ?? null,
                        address: null,
                        phone_number: null,
                    }),
                });
            } catch {
                // Swallow errors to avoid blocking sign-in; your PATCH endpoint remains a fallback
            }
        },
    },
    callbacks: {
        async session({ session, token }) {
            // Expose NextAuth user id (token.sub) to session.user.id
            if (session.user && token?.sub) {
                // @ts-expect-error augment at runtime
                session.user.id = token.sub;
            }
            return session;
        },
    },
};