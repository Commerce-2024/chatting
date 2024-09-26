"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { TextField } from "@material-ui/core";
import { useSession } from "next-auth/react";

const socket = io.connect("http://localhost:4000"); //서버 연결
const ChatPage = () => {
  const { data: session } = useSession();
  const [state, setState] = useState({ message: "", name: "" }); //useState 훅을 사용하여 message와 name 상태를 관리
  const [chat, setChat] = useState([]); //chat 상태를 사용하여 채팅 로그를 저장하고, 새로운 메시지가 도착할 때마다 setChat을 통해 로그를 업데이트

  const socketRef = useRef(); //이 Hook을 사용하여 Socket.IO 연결에 대한 참조를 저장 useEffect 내부에서 연결을 관리하고 메시지를 수신가능

  //컴포넌트가 마운트될 때 (chat 상태가 변경될 때마다) 실행된다.
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000"); //Socket.IO 서버에 연결하고, 연결 객체를 socketRef 에저장
    socketRef.current.on("message", ({ name, message }) => {
      //"message" 이벤트를 수신대기 서버에서 "message" 이벤트가 발생하면
      setChat([...chat, { name, message }]); //name과 message를 받아와 chat 상태에 추가하여 채팅 로그를 업데이트
    });
    return () => socketRef.current.disconnect();
  }, [chat]); //연결종료

  /**---------------------------텍스트 입력처리--------------------------
   * 텍스트 입력 필드(name,message)의 값이 변경될 때마다 호출
   * e.target.name을 사용하여 변경된 필드를 식별하고, e.target.value를 사용하여 해당필드의 상태를 업데이트 */

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  //--------------------------메시지 전송 처리--------------------------
  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit("message", { name, message }); //name, message를 담은 "message" 이벤트를 서버로 전송
    e.preventDefault(); //폼의 기본 제출 동작을 막아 페이지 새로고침을 방지
    setState({ message: "", name }); //메시지 입력 필드와 이름 필드를 초기화
  };
  //-------------------------채팅 로그 렌더링-----------------------------
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
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
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
    </div>
  );
};
export default ChatPage;
