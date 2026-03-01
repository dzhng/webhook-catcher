import { NextResponse } from "next/server";
import { jsonError } from "@/lib/http";
import { generateEndpointId } from "@/lib/ids";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const endpointId = generateEndpointId();

    const ingestPath = `/api/ingest/${endpointId}`;
    const eventsPath = `/api/v1/endpoints/${endpointId}/events`;
    const ingestUrl = new URL(ingestPath, request.url).toString();
    const eventsUrl = new URL(eventsPath, request.url).toString();

    return NextResponse.json(
      {
        ingestUrl,
        eventsUrl,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to create endpoint", error);
    return jsonError(500, "Could not create endpoint");
  }
}
