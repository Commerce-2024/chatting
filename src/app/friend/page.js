"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const FriendPage = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    friendName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    const { friendName } = formData;
    //------------에러 메시지-------------
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
      <p>{session.user.name}님의 친구목록</p>
      <section>
        <input
          id="friend_id"
          name="friendName" // <-- name 속성 추가
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
