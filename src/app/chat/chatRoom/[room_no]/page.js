"use client";
import "../../../../../public/css/roomChat.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { TextField } from "@material-ui/core";
import { useSession } from "next-auth/react";
const socket = io.connect("http://localhost:4000");
const ChatRoomPage = () => {
  const { room_no } = useParams(); // 방 번호 파라미터로 가져옴
  const { data: session } = useSession(); //유저 세션
  const [errorMessage, setErrorMessage] = useState(""); //에러메세지
  const [roomData, setRoomData] = useState(null); //방데이터 챗로그,유저정보
  const [state, setState] = useState({ name: "", message: "" }); //메세지 스테이트
  const [chat, setChat] = useState([]); //챗 정보
  const socketRef = useRef(); // 소켓을 저장할 ref
  const router = useRouter(); //라우터

  const user = session?.user || {};

  // 세션 정보가 변경될 때 이름 상태 업데이트
  useEffect(() => {
    if (session?.user?.name) {
      setState((prev) => ({ ...prev, name: session.user.name }));
    }
  }, [session]);

  // 소켓 연결 및 방 참가
  useEffect(() => {
    // 소켓 서버에 연결
    socketRef.current = io.connect("http://localhost:4000");

    // 서버로 방 참가 이벤트 전송
    socketRef.current.emit("joinRoom", room_no);

    // 서버에서 받은 메시지를 chat 배열에 저장
    socketRef.current.on("receiveMessage", ({ name, message }) => {
      setChat((prevChat) => [...prevChat, { name, message }]);
    });

    // 방 정보를 API로 불러옴
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
    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socketRef.current.emit("leaveRoom", room_no); // 방 나가기 이벤트 전송
      socketRef.current.disconnect();
    };
  }, [room_no]);
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }
  //----------------텍스트 입력처리-----------------------
  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  //----------------메시지 전송처리--------------------------------------
  const onMessageSubmit = async (e) => {
    e.preventDefault();

    const { name, message } = state;
    const id = session.user.id;

    // **1. 메시지를 먼저 클라이언트에 반영 (내가 보낸 메시지 바로 보이게)**
    setChat((prevChat) => [...prevChat, { room_no, name, message }]);

    // 소켓으로 메시지 전송
    socketRef.current.emit("sendMessage", { room_no, name, message });

    try {
      // 서버에 메시지 저장 요청
      const response = await fetch(
        `/api/room/chat?id=${id}&message=${message}&room_id=${room_no}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, message, room_no }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "메세지 전송 실패");
      }
    } catch (error) {
      setErrorMessage("메세지 전송 실패");
    }

    setState({ message: "", name }); // 메시지 초기화
  };

  //--------- 채팅 로그 렌더링---------------------------
  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="room-container">
      <ul>
        {roomData.map((user) => (
          <li key={user.user_no}>{user.user_name}</li>
        ))}
      </ul>
      <form onSubmit={onMessageSubmit} className="message-form">
        <div>
          <TextField
            name="name"
            className="text-field"
            value={user.name || ""}
            label="Name"
            disabled
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={onTextChange}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
            className="text-field"
          />
        </div>
        <button className="send-button">Send Message</button>
      </form>
      <div className="chat-log-container">
        <h1 className="chat-log-title">Chat Log</h1>
        <ul>
          {roomData.map((message) => (
            <li key={message.message_no} className="message-log">
              {message.tbl_user.user_name}: {message.message_body}
            </li>
          ))}
        </ul>
        {renderChat()}
      </div>
      <button className="back-button" onClick={() => router.push("/home")}>
        뒤로가기
      </button>
    </div>
  );
};

export default ChatRoomPage;
