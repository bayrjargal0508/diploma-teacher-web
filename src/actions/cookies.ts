"use server";

import {cookies} from "next/headers";
import {jwtDecode} from "jwt-decode";
import {RefreshToken} from "@/lib/responses";

export async function setToken(token: string) {
    const cookie = await cookies();
    const decoded = jwtDecode<JwtPayload>(token);

    const now = Math.floor(Date.now() / 1000);
    const maxAge = decoded.exp - now;

    // Safety check — in case token already expired or exp missing
    if (!decoded.exp || maxAge <= 0) {
        throw new Error("Cannot set cookie: token is expired or invalid");
    }

    cookie.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge, // dynamically set from JWT exp
    });
}

export async function setRefreshToken(data: RefreshToken) {
    const cookie = await cookies();
    const expiresAt = new Date(data.expiresAt).getTime() / 1000;
    const now = Math.floor(Date.now() / 1000);
    const maxAge = Math.max(expiresAt - now, 0);
    cookie.set("refreshToken", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
    });
}

export async function clearToken() {
    const cookie = await cookies()
    cookie.delete("accessToken")
    cookie.delete("refreshToken")
}

export async function getToken() {
    const cookie = await cookies();
    return cookie.get("accessToken")?.value;
}

export async function getRefreshToken() {
    const cookie = await cookies();
    return cookie.get("refreshToken")?.value;
}

type JwtPayload = {
    exp: number;
    [key: string]: unknown;
};

export async function isTokenExpired() {
    const token = await getToken();
    if (!token) {
        return true
    }
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return true;
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
}

export async function isAuthenticated() {
    const cookie = await cookies();
    const token = cookie.get("accessToken")?.value;
    return !!token;
}

export async function setUserData(data: {
    fullName: string;
    email: string;
    username: string;
    avatar: string | null;
}) {
    const cookie = await cookies();
    cookie.set("userData", JSON.stringify(data), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function getUserData() {
    const cookie = await cookies();
    const userData = cookie.get("userData")?.value;
    
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    }
    return null;
}