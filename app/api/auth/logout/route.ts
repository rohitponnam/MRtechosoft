import { deleteSession } from "@/lib/auth";

export async function POST(request: Request) {
  await deleteSession();
  return Response.redirect(new URL("/", request.url), 303);
}
