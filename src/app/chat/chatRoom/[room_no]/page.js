"use client";
import "../../../../../public/css/roomChat.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { TextField } from "@material-ui/core";
import { useSession } from "next-auth/react";

const ChatRoomPage = () => {
  const { room_no } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [state, setState] = useState({ name: "", message: "" }); // message_body -> message
  const [chat, setChat] = useState([]);
  const { data: session } = useSession();
  const socketRef = useRef();
  const router = useRouter();

  const user = session?.user || {};

  useEffect(() => {
    if (session?.user?.name) {
      setState((prev) => ({ ...prev, name: session.user.name }));
    }
  }, [session]);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      console.log("받은 메시지:", { name, message });
      setChat((prevChat) => [...prevChat, { name, message }]);
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
  }, [room_no]);

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
    const { name, message } = state;
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    setState({ message: "", name });
  };

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
      <p className="participant-count">참가 인원: {roomData.user_id}</p>
      <form onSubmit={onMessageSubmit} className="message-form">
        <div>
          <TextField
            name="name"
            className="text-field"
            value={user.name}
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
          {roomData?.chat_log?.map((message) => (
            <li key={message.message_no} className="message-log">
              {message.user_id},{message.message_body}
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
