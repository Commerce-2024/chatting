import { joinRoom } from "../roomModule";

export async function POST(request, { params }) {
  return joinRoom(request, { params });
}
