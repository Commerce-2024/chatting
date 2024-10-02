import { getRooms } from "../roomModule";
export async function GET(request) {
  // request 추가
  return getRooms(request);
}
