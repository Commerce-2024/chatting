"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useParams 사용
import { useSession } from "next-auth/react";

const ChatRoomPage = () => {
  const { room_no } = useParams(); // useParams로 room_no 가져옴
  const router = useRouter();
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (room_no) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`/api/room/${room_no}`);
          if (!response.ok) {
            throw new Error("방 정보를 불러오는 중 오류 발생");
          }
          const data = await response.json();
          setRoomData(data);
        } catch (error) {
          setErrorMessage(error.message);
        }
      };
      fetchRoomData();
    }
  }, [room_no]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat Room: {roomData.room_name}</h1>
      <p>Status: {roomData.room_status}</p>
      <button onClick={() => router.push("/chat")}>뒤로가기</button>
    </div>
  );
};

export default ChatRoomPage;
