import { chat } from "../roomModule";

export async function POST(request) {
  return chat(request);
}
