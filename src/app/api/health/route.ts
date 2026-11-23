import { connection } from "next/server";

export async function GET() {
  // With cacheComponents a handler without request data is prerendered;
  // a liveness probe must answer every request.
  await connection();
  return Response.json({ status: "ok" });
}
