import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(request) {
  try {
    const { title, status } = await request.json();
    //채팅방생성
    const room = await prisma.tbl_room.create({
      data: {
        room_name: title,
        room_status: status,
      },
    });
    return NextResponse.json(
      { message: "채팅방이 생성되었습니다.", room },
      { status: 201 } //Created
    );
  } catch (error) {
    return NextResponse.json(
      { message: "채팅방생성중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
