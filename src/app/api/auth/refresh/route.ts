import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {setRefreshToken, setToken} from "@/actions/cookies";
import {AUTH_API_URL} from "@/utils/urls";
import {User} from "@/lib/responses";

export async function POST() {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refreshToken")?.value;
    if (!refresh) {
        return NextResponse.json({result: false, message: "No refresh token"}, {status: 401});
    }

    const res = await fetch(`${AUTH_API_URL}/api/v2/auth/refresh-token`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({refreshToken: refresh}),
    });
    if (!res.ok) return NextResponse.json({result: false, message: "No refresh token"}, {status: 401});
    const data: User = await res.json();
    await setToken(data.token);
    await setRefreshToken(data.refreshToken);
    return NextResponse.json({result: true});
}
