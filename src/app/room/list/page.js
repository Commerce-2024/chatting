"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter;
  //방목록을 가져오기 아직 자기아이디에 해당하는 방목록을 가져오는건 안됨
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
  const handleRoomClick = async (room_no) => {
    try {
      const response = await fetch(`/api/room/join/${room_no}`, {
        method: "POST", // POST 요청으로 변경
      });
      console.log(response);

      if (response.ok) {
        // 방 참가 성공 시 페이지 이동
        router.push(`/room/${room_no}`);
      } else {
        // 에러 처리
        const data = await response.json();
        setErrorMessage(data.message || "실패");
      }
    } catch (error) {
      setErrorMessage("방 참가에 실패했습니다.");
    }
  };
  return (
    <div>
      <h1>Room List Page</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.room_no} onClick={() => handleRoomClick(room.room_no)}>
            {room.room_name} ({room.room_status})
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RoomListPage;
