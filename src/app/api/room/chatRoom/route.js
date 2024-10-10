import { chatRog } from "../roomModule";

export async function POST(request) {
  return chatRog(request);
}
