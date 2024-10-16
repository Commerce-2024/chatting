import { getRoomById } from "../room/roomModule";
export async function POST(request) {
  return getRoomById(request);
}
