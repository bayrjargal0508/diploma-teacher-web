import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {TEACHER_API_URL} from "@/utils/urls";
import {jwtDecode} from "jwt-decode";
import {User} from "@/lib/responses";

type JwtPayload = {
    exp: number;
    [key: string]: unknown;
};

const setToken = (response: NextResponse, token: string) => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);
        const maxAge = decoded.exp ? decoded.exp - now : 0;

        if (!decoded.exp || maxAge <= 0) {
            console.error("Cannot set cookie: token is expired or invalid");
            return response;
        }

        response.cookies.set("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge, // token expiration
        });
    } catch (err) {
        console.error("Failed to decode token:", err);
    }
}
const setRefreshToken = (response: NextResponse, token: string, exp: string) => {
    try {
        const expiresAt = new Date(exp).getTime() / 1000;
        const now = Math.floor(Date.now() / 1000);
        const maxAge = Math.max(expiresAt - now, 0);
        response.cookies.set("refreshToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge,
        });
    } catch (err) {
        console.error("Failed to decode token:", err);
    }
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value
    const response = NextResponse.next()
    const currentPathname = request.nextUrl.pathname
    if (["/login", "/register", "/forgot-password"].includes(currentPathname)) {
        return response
    }
    if (!accessToken) {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (refreshToken) {
            const res = await fetch(`${TEACHER_API_URL}/api/v2/auth/refresh-token`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    refreshToken: refreshToken
                }),
            });
            if (!res.ok) return NextResponse.redirect(new URL('/login', request.url))
            try {
                const data: User = await res.json();
                setToken(response, data.token)
                setRefreshToken(response, data.refreshToken.token, data.refreshToken.expiresAt)
                return response
            } catch (err) {
                console.error(err);
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ]
}