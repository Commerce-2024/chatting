"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link"; // 방으로 이동할 수 있는 링크 생성에 사용
import { useRouter } from "next/router";

const UserInfoPage = () => {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const id = session?.user?.id;
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
  }, [status, id]);

  return (
    <>
      {status === "loading" ? (
        <div>로딩중</div>
      ) : session && session.user ? (
        <>
          <h3>{session.user.name}의 채팅방</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
          <ul>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <li key={room.room_id}>
                  <Link href={`/chat/chatRoom/${room.tbl_room.room_no}`}>
                    {room.tbl_room.room_name}
                  </Link>
                </li>
              ))
            ) : (
              <p>참여한 방이 없습니다.</p>
            )}
          </ul>
        </>
      ) : (
        <>
          <p>로그인이 필요합니다</p>
          <Link href="/user/login">로그인페이지로 이동</Link>
        </>
      )}
    </>
  );
};

export default UserInfoPage;
