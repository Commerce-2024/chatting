"use client";
import "../../../../../public/css/roomChat.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation"; // useParams 사용
import { TextField } from "@material-ui/core";
import { useSession } from "next-auth/react";

const ChatRoomPage = () => {
  const { room_no } = useParams(); // useParams로 room_no 가져옴
  const [errorMessage, setErrorMessage] = useState(""); //에러메세지
  const [roomData, setRoomData] = useState(null); //방정보
  const [state, setState] = useState({ name: "", message_body: "" }); //message정보저장
  const [chat, setChat] = useState([]); // chat 상태를 저장
  const { data: session } = useSession(); //로그인세션
  const socketRef = useRef(); //ref
  //---------작동----
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000"); //서버연결
    socketRef.current.on("message", ({ name, message_body }) => {
      //user_id,room_id,message_body,message_type
      setChat([...chat, { name, message_body }]); //name과 message를 받아와 chat 상태에 추가하여 채팅 로그를 업데이트
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
  }, [chat]); //연결종료
  console.log("roomData", roomData);

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
    const { name, message_body } = state;
    socketRef.current.emit("message", { name, message_body });
    e.preventDefault(); //폼의 기본 제출 동작을 막아 페이지 새로고침 방지
    setState({ message_body: "", name }); //메시지 입력 필드와 이름 필드 초기화
    console.log("메세지", state);
  };
  //-------------채팅 로그 렌더링---------------
  const renderChat = () => {
    return chat.map(({ name, message_body }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message_body}</span>
        </h3>
      </div>
    ));
  };
  return (
    <div className="room-container">
      <p className="participant-count">참가 인원: {roomData.user_id}</p>
      <form onSubmit={onMessageSubmit} className="message-form">
        <div>
          <TextField
            name="name"
            className="text-field"
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
            className="text-field"
          />
        </div>
        <button className="send-button">Send Message</button>
      </form>
      <div>
        <h1 className="chat-log-title">Chat Log</h1>
        <ul>
          {roomData.map((message) => (
            <li key={message.message_no} className="message-log">
              {message.user_id},{message.message_body}
            </li>
          ))}
        </ul>
        {renderChat()}
      </div>
      <button className="back-button" onClick={() => router.push("/chat")}>
        뒤로가기
      </button>
    </div>
  );
};

export default ChatRoomPage;
