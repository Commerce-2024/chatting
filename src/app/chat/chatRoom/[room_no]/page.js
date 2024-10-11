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
  const [state, setState] = useState({
    user_id: "",
    room_id: "",
    message_body: "",
    message_type: "",
  }); //message
  const [chat, setChat] = useState([]); // chat 상태를 저장
  const { data: session } = useSession();
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on(
      "message",
      ({ user_id, room_id, message_body, message_type }) => {
        setChat([...chat, { user_id, room_id, message_body, message_type }]);
      }
    );
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
  }, [room_no, chat]); //연결종료

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }
  //텍스트 입력처리
  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  //메시지 전송 처리
  const onMessageSubmit = (e) => {
    const { user_id, room_id, message_body, messgae_type } = state;
    socketRef.current.emit("message", {
      user_id,
      room_id,
      message_body,
      messgae_type,
    });
    e.preventDefault(); //폼의 기본 제출 동작을 막아 페이지 새로고침 방지
    setState({
      user_id: session.user.id,
      room_id: room_no,
      message_body: "",
      messgae_type: "",
    }); //메시지 입력 필드와 이름 필드 초기화
  };
  //-------------채팅 로그 렌더링---------------
  const renderChat = () => {
    return chat.map(
      (
        { user_id, message_body },
        index //chat 상태 배열을 순회하며 각 메시지를 렌더링 key={index}:React에서 리스트를 렌더링할 때 각 항목에 고유한 key 를 제공
      ) => (
        <div key={index}>
          <h3>
            {user_id}: <span>{message_body}</span>
          </h3>
        </div>
      )
    );
  };
  return (
    <div>
      <h1>room_id: {roomData.room_id}</h1>
      <p>참가인원: {roomData.user_id}</p>
      <form onSubmit={onMessageSubmit}>
        <div>
          <TextField
            name="user_id"
            value={(state.name = session.user.name)}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message_body"
            onChange={(e) => onTextChange(e)}
            value={state.message_body}
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
