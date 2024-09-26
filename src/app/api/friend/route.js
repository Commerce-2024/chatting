import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const { friendName } = await request.json();

  try {
    //존재 하는 회원 확인
    const existingUser = await prisma.tbl_user.findUnique({
      where: { user_id: friendName },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "존재 하지 않은 유저입니다." },
        { status: 409 }
      );
    }
    //친구추가
    const friend = await prisma.tbl_friend.create({
      data: {
        friend_id: friendName,
      },
    });
    return NextResponse.json({
      message: "친구추가가 성공적으로 완료되었습니다.",
      friend,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "친구추가중 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
