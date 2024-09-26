"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { friendSelectByUserId } from "../api/friend/friend";

const FriendPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    friendName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession(); //status로 로그인 상태지정
  const [friends, setFriends] = useState([]); // 친구 목록 상태 추가

  useEffect(() => {
    // 세션 상태가 변경될 때마다 확인
    if (status === "unauthenticated") {
      signIn(); // unauthenticated 일시 로그인으로 보냄
    } else if (status === "authenticated" && session?.user?.id) {
      // 로그인된 경우 사용자 ID 업데이트
      setFormData((prevData) => ({
        ...prevData,
        id: session.user.id,
      }));

      // 친구 목록 가져오기
      const fetchFriends = async () => {
        try {
          const friendsData = await friendSelectByUserId(session.user.id); // 사용자 ID를 함수에 전달
          console.log("프렌드데이터 넘어왔나?", friendsData);
          setFriends(friendsData);
        } catch (error) {
          setErrorMessage("친구 목록을 불러오는 중 오류");
        }
      };

      fetchFriends();
    }
  }, [session, status]);

  const friendList = friends.map((friend) => (
    <li key={friend.id}>{friend.id}</li> // key prop 추가
  ));

  //------------------입력상태------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
  };

  //-----------------유효성검사---------
  const validate = async () => {
    const { id, friendName } = formData;

    //------------에러 메시지-------------
    if (!id) {
      setErrorMessage("로그인이 필요");
      return;
    }

    if (!friendName) {
      setErrorMessage("아이디를 입력하세요.");
      return;
    }

    //-----------친구추가-----------
    try {
      const response = await fetch("/api/friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          friendName,
        }),
      });
      const data = await response.json();

      //------상태 반환 후 적절한 처리
      if (response.ok) {
        setSuccessMessage("친구추가가 완료 되었습니다.");
      } else {
        setErrorMessage(data.message || "존재하지않은 친구 아이디");
      }
    } catch (error) {
      setErrorMessage("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <h1>FriendPage</h1>
      {session && <p>{session.user.name}님의 친구목록</p>}
      <ul>{friendList}</ul>
      <section>
        <input
          id="friend_id"
          name="friendName"
          placeholder="친구추가할 아이디를 입력하세요"
          value={formData.friendName}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="button" onClick={validate}>
          친구추가
        </button>
      </section>
    </>
  );
};

export default FriendPage;
