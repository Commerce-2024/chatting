import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const friendSelectByUserId = async (id) => {
  try {
    const friends = await db.tbl_friend.findMany({
      where: { user_id: id },
    });
    return friends; // 결과 반환
  } catch (error) {
    console.error(error);
    throw error; // 에러 전파
  } finally {
    db.$disconnect(); // 데이터베이스 연결 해제
  }
};
