"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link"; // 방으로 이동할 수 있는 링크 생성에 사용

const UserInfoPage = () => {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const id = session.user.id;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/user?user_id=${id}`, {
          method: "POST",
        });
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        setErrorMessage("방 목록을 가져오는 중 오류 발생");
      }
    };
    fetchRooms();
  }, [id]);

  return (
    <>
      <h1>{session.user.name}님의 정보</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.room_id}>
              {/* 조인된 tbl_room 필드에서 방 제목을 표시 */}
              <Link href={`/chat/chatRoom/${room.tbl_room.room_no}`}>
                {room.tbl_room.room_name} {/* 방 제목 표시 */}
              </Link>
            </li>
          ))
        ) : (
          <p>참여한 방이 없습니다.</p>
        )}
      </ul>
    </>
  );
};

export default UserInfoPage;
