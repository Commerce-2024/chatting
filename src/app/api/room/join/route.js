import { joinRoom } from "../roomModule";

export async function POST(request) {
  return joinRoom(request);
}
