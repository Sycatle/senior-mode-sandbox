export function hasApiKey(headers: Headers): boolean {
  return (headers.get("x-api-key") ?? "").trim() !== "";
}
