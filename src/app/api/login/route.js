import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { id, password } = await request.json();

  try {
    const existingUser = await prisma.tbl_user.findUnique({
      where: { user_id: id },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "존재하지않은 아이디입니다." },
        { status: 409 }
      );
    }
  } catch (error) {}
}
