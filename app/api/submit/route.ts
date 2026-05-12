import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;

  if (!gasUrl) {
    return NextResponse.json(
      { error: "Submission endpoint is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const gasResponse = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await gasResponse.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // GAS sometimes returns non-JSON on redirect; treat 200 as success
      data = { status: "ok" };
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not reach the data server." },
      { status: 502 }
    );
  }
}
