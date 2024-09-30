import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 친구목록불러오기
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "사용자 ID가 필요합니다." },
        { status: 400 } // Bad Request
      );
    }

    const friendsData = await prisma.tbl_friend.findMany({
      where: { user_id: id },
    });
    return NextResponse.json(friendsData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "친구 목록을 불러오는 중 오류가 발생했습니다.", error },
      { status: 500 } // Internal Server Error
    );
  }
}

export async function POST(request) {
  try {
    const { id, friendName } = await request.json();

    if (!id || !friendName) {
      return NextResponse.json(
        { message: "사용자 ID와 친구 ID가 모두 필요합니다." },
        { status: 400 } // Bad Request
      );
    }

    // 존재하는 회원 확인
    const existingUser = await prisma.tbl_user.findUnique({
      where: { user_id: friendName },
    });
    if (!existingUser) {
      return NextResponse.json(
        { message: "존재하지 않는 유저입니다." },
        { status: 404 } // Not Found
      );
    }

    // 친구추가
    const friend = await prisma.tbl_friend.create({
      data: {
        user_id: id,
        friend_id: friendName,
      },
    });

    return NextResponse.json(
      { message: "친구 추가가 완료되었습니다.", friend },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      // Prisma 에러 처리
      if (error.code === "P2002") {
        // Unique constraint violation
        return NextResponse.json(
          { message: "이미 친구 관계입니다." },
          { status: 409 }
        ); // Conflict
      }
      return NextResponse.json({ message: error.message }, { status: 400 }); // Bad Request
    } else {
      // 기타 에러 처리
      return NextResponse.json(
        { message: "친구 추가 중 오류가 발생했습니다." },
        { status: 500 }
      ); // Internal Server Error
    }
  }
}
