import type { CursorTokenPayload } from "@/lib/types";

function encodeCursor(payload: CursorTokenPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeCursor(token: string): CursorTokenPayload | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as CursorTokenPayload;
    if (
      typeof payload?.endpointId !== "string" ||
      typeof payload?.consumerGroup !== "string"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function createCursorToken(endpointId: string, consumerGroup: string): string {
  return encodeCursor({
    endpointId,
    consumerGroup,
  });
}

export function verifyCursorToken(
  token: string,
  endpointId: string,
): CursorTokenPayload | null {
  const payload = decodeCursor(token);
  if (!payload || payload.endpointId !== endpointId) {
    return null;
  }

  return payload;
}
