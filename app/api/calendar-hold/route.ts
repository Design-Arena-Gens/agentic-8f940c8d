import { NextResponse } from "next/server";

type CalendarRequest = {
  prospectId: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CalendarRequest;
  if (!body?.prospectId) {
    return NextResponse.json({ error: "Missing prospectId" }, { status: 400 });
  }

  console.log(
    "[Calendar Hold]",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        prospectId: body.prospectId
      },
      null,
      2
    )
  );

  return NextResponse.json({ ok: true });
}
