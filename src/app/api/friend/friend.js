import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const friendSelectAll = async () => {
  try {
    const friends = await db.tbl_friend.findMany();
    await db.$disconnect();
    return friends;
  } catch (error) {
    await db.$disconnect();
    process.exit(1);
  }
};

// export const friendSelectByUserId = async (id) => {
//   try {
//     const friends = await db.tbl_friend.findMany({
//       where: { user_id: id }, // 여기 id가 변수로 전달됨
//     });
//     return friends;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   } finally {
//     try {
//       await db.$disconnect();
//     } catch (err) {
//       console.error("DB disconnect error:", err);
//     }
//   }
// };
