"use client";
import "../../../../public/css/roomChat.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();
  const router = useRouter(); // useRouter를 함수로 호출

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/room/list");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        setErrorMessage("방 목록을 가져오는 중 오류 발생");
      }
    };
    fetchRooms();
  }, []);

  const handleRoomClick = async (room_no, user_id) => {
    try {
      const response = await fetch(
        `/api/room/join?room_no=${room_no}&user_id=${user_id}`,
        {
          method: "POST", // POST 요청으로 변경
        }
      );
      console.log(response);

      if (response.ok) {
        // 방 참가 성공 시 페이지 이동
        router.push(`/chat/chatRoom/${room_no}`);
        // router.push(`/chatRoom/${room_no}`);
      } else {
        // 에러 처리
        const data = await response.json();
        setErrorMessage(data.message || "실패.");
      }
    } catch (error) {
      setErrorMessage("방 참가에 실패했습니다.");
    }
  };

  return (
    <div className="room-list-container">
      <h1 className="room-list-title">Room List Page</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.room_no} className="room-item">
            <button
              className="join-button"
              onClick={() => handleRoomClick(room.room_no, session.user.id)}
            >
              참가
            </button>
            {room.room_name} ({room.room_status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomListPage;
