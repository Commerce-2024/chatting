"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const JoinPage = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    rePassword: "",
    name: "",
    birth: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  //-------------------------------입력 상태
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
  };
  //------------------------------유효성 검사
  const validate = async () => {
    const { id, password, rePassword, name, birth } = formData;
    //--------------------------------정규식
    const idRegex = /^[a-zA-Z0-9_]{4,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    //-----------------------------------에러 메시지
    if (!idRegex.test(id)) {
      setErrorMessage(
        "아이디는 영문 대소문자, 숫자, _만 사용할 수 있으며, 4~15자리여야 합니다."
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 하며 8~20자리이어야 합니다."
      );
      return;
    }

    if (password !== rePassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!name) {
      setErrorMessage("이름을 입력하세요.");
      return;
    }
    if (!birth) {
      setErrorMessage("생년월일을 입력하세요.");
      return;
    }

    setErrorMessage("");

    //────────────────────────────────────────────회원가입 요청
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          password,
          name,
          birth,
        }),
      });

      const data = await response.json();
      //────────────────────────────────────────────상태 반환 후 적절한 처리// 아직처리안함
      if (response.ok) {
        setSuccessMessage("회원가입이 성공적으로 완료되었습니다.");
        setTimeout(() => {
          router.push("/user/login");
        }, 2000);
      } else {
        setErrorMessage(data.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버와의 통신 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <section>
        <input
          id="user_id"
          name="id"
          placeholder="아이디를 입력하세요"
          value={formData.id}
          onChange={handleChange}
        />
        <input
          id="user_password"
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          id="user_re_password"
          name="rePassword"
          type="password"
          placeholder="비밀번호를 확인하세요"
          value={formData.rePassword}
          onChange={handleChange}
        />
        <input
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          id="birth"
          name="birth"
          type="date"
          placeholder="생년월일을 입력하세요"
          value={formData.birth}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button id="join_button" type="button" onClick={validate}>
          회원가입
        </button>
      </section>
    </>
  );
};
export default JoinPage;
