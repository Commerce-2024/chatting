"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { TextField } from "@material-ui/core";

const socket = io.connect("http://localhost:4000"); //서버 연결
const ChatPage = () => {
  const [state, setState] = useState({ message: "", name: "" }); //useState 훅을 사용하여 message와 name 상태를 관리한다.
  const [chat, setChat] = useState([]); //chat 상태를 사용하여 채팅 로그를 저장하고, 새로운 메시지가 도착할 때마다 setChat을 통해 로그를 업데이트

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

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
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
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
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
    </div>
  );
};
export default ChatPage;
