import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  const { id, password, name, birth } = await request.json();

  try {
    // 기존 사용자 확인
    const existingUser = await prisma.tbl_user.findUnique({
      where: { user_id: id },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 사용 중인 아이디입니다." },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const user = await prisma.tbl_user.create({
      data: {
        user_id: id,
        user_password: hashedPassword,
        user_name: name,
        user_birth: birth,
      },
    });

    return NextResponse.json({
      message: "회원가입이 성공적으로 완료되었습니다.",
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "회원가입 중 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
