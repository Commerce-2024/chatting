"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation"; // useParams 사용
import { TextField } from "@material-ui/core";
import { useSession } from "next-auth/react";

const ChatRoomPage = () => {
  const { room_no } = useParams(); // useParams로 room_no 가져옴
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [state, setState] = useState({ message: "", name: "", type: "" });
  const { data: session } = useSession();
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    if (room_no) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(
            `/api/room/chatRoom?room_no=${room_no}`,
            {
              method: "POST",
            }
          );
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
    return () => socketRef.current.disconnect();
  }, [room_no, chat]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }
  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const onMessageSubmit = (e) => {
    const { name, message, type } = state;
    socketRef.current.emit("message", { name, message, type });
    e.preventDefault();
    setState({ message: "", name: "" }); //메시지 입력 필드와 이름 필드 초기화
  };
  //-------------채팅 로그 렌더링---------------
  const renderChat = () => {
    return chat.map(
      (
        { name, message },
        index //chat 상태 배열을 순회하며 각 메시지를 렌더링 key={index}:React에서 리스트를 렌더링할 때 각 항목에 고유한 key 를 제공
      ) => (
        <div key={index}>
          <h3>
            {name}: <span>{message}</span>
          </h3>
        </div>
      )
    );
  };
  return (
    <div>
      <h1>room_id: {roomData.room_id}</h1>
      <p>user_id: {roomData.user_id}</p>
      <form onSubmit={onMessageSubmit}>
        <div>
          <TextField
            name="name"
            value={(state.name = session.user.name)}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div>
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
      <button onClick={() => router.push("/chat")}>뒤로가기</button>
    </div>
  );
};

export default ChatRoomPage;
