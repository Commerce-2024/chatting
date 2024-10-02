import { createRoom } from "../roomModule";

export async function POST(request) {
  return createRoom(request);
}
