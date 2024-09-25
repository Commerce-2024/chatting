## socket.io 로 채팅 만들기

socket.io란 websocket기반으로 클라이언트와 서버간의 양방향 통신을 가능하게 해주는 모듈이다.
기본적인 socket의 연결, 해제기능들을 자바스크립트로 가능하게 만든 모듈이라고 생각하자.

# socket 핵심 function

- emit : 데이터 전송(서버->클라이언트/클라이언트 -> 서버)
- on :데이터를 받는다 (서버->클라이언트/클라이언트 ->서버)

# Server 설정 및 소스

- 환경설정 (server폴더를 만들고 아래의 명령어 실행)

```bash
 npm install express
 npm install cors
 npm install nodemon
 npm install socket.io
```

# Client 설정 및 소스

```bash
-환견설정(CHATTING 폴더에서 아래의 명령어 실행)
npx create-react-app@latest chatting
npm install socket.io-client //socket client 모듈
npm install @material-ui/core //react UI이다.
```

서버를 4000번대로 실행해서 3000 localhost랑 통신하는거임 즉 2개의 터미널이 필요

```bash
node src/server/index.js
```

비밀번호 해쉬화 메서드 다운로드

```bash
npm i bcryptjs
```
