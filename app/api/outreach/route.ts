import { NextResponse } from "next/server";
import { OutreachChannel, Prospect } from "../../../lib/types";

type RequestBody = {
  prospect: Prospect;
  channel: OutreachChannel;
  message: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;

  if (!body?.prospect?.id || !body?.message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  console.log(
    "[Outreach Log]",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        prospectId: body.prospect.id,
        channel: body.channel,
        messageSize: body.message.length
      },
      null,
      2
    )
  );

  return NextResponse.json({ ok: true });
}
