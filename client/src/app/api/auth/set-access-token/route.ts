import { CookieKeys, HttpStatusCode } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "accessToken is required" },
        { status: 400 }
      );
    }

    // set le cookie
    const cookieStore = await cookies();
    cookieStore.set(CookieKeys.ACCESSTOKEN, accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return NextResponse.json({ ok: true }, { status: HttpStatusCode.OK });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
