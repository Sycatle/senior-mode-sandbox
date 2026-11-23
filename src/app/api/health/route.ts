import { io } from "next/cache";

export async function GET() {
  await io();
  return Response.json({ status: "ok" });
}
