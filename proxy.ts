import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const isUserAdmin = user?.id === "e8ef9238-db78-4fb5-b07a-70a2aef445c1";

  const nextUrl = request.nextUrl;

  // Kick non-admins out of the Dashboard
  if (nextUrl.pathname.startsWith("/Dashboard") && !isUserAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise, let them through and pass the admin state to context via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-is-admin", String(isUserAdmin));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Matches all routes except static files/API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};