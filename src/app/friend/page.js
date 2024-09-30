"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

const FriendPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    friendName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // 세션 상태가 변경될 때마다 확인
    if (status === "unauthenticated") {
      signIn();
    } else if (status === "authenticated" && session?.user?.id) {
      // 로그인된 경우 사용자 ID 업데이트
      setFormData((prevData) => ({
        ...prevData,
        id: session.user.id,
      }));
      // 친구 목록 불러오기
      fetchFriends();
    }
  }, [session, status]);

  // 친구목록 불러오기
  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friend?id=" + session.user.id, {
        //파라미터활용
        headers: {
          "Content-Type": "application/json",
        },
      });
      const friendsData = await response.json();
      setFriends(friendsData);
    } catch (error) {
      setErrorMessage("친구 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage(""); // 성공 메시지도 초기화
  };

  const validate = async () => {
    const { id, friendName } = formData;

    if (!id) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    if (!friendName) {
      setErrorMessage("친구 아이디를 입력하세요.");
      return;
    }
    //친구추가하기
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
      if (response.ok) {
        setSuccessMessage("친구 추가가 완료되었습니다.");
        setFormData({ ...formData, friendName: "" }); // 입력 필드 초기화
        fetchFriends(); // 친구 목록 새로고침
      } else {
        setErrorMessage(data.message || "존재하지 않는 친구 아이디입니다.");
      }
    } catch (error) {
      setErrorMessage("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <h1>FriendPage</h1>
      {session && <p>{session.user.name}님의 친구목록</p>}
      <ul>
        {friends.map((f) => (
          <li key={f.user_id}>
            <span>{f.friend_id}</span>
          </li>
        ))}
      </ul>

      <section>
        <input
          id="friend_id"
          name="friendName"
          placeholder="친구 추가할 아이디를 입력하세요"
          value={formData.friendName}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="button" onClick={validate}>
          친구 추가
        </button>
      </section>
    </>
  );
};

export default FriendPage;
