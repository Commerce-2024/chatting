"use client";
import Link from "next/link";
import "../../../../public/css/login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //----------------------유효성 검사 및 로그인
  const validate = async () => {
    //폼 검증
    if (loginId === "") {
      setErrorMessage("아이디를 입력하세요");
      return;
    }
    if (loginPassword === "") {
      setErrorMessage("비밀번호를 입력하세요");
      return;
    }
    //로딩 상태 활성화
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false, // 서버 리디렉션 대신 클라이언트에서 처리
      loginId,
      loginPassword,
    });

    // 로그인 결과 처리
    if (result.error) {
      setErrorMessage(result.error);
      setLoading(false);
    } else {
      setErrorMessage("");
      setLoading(false);
      router.push("/"); //로그인 성공시 홈으로 이동
    }
  };
  // 로그인 성공 시 토큰을 받아옵니다

  return (
    <section className="login-form">
      <h1>Login</h1>
      <input
        id="login_id"
        name="login_id"
        placeholder="아이디를 입력하세요"
        value={loginId}
        onChange={(e) => {
          setLoginId(e.target.value);
          setErrorMessage(""); // 입력 중일 때 에러 메시지 초기화
        }}
      />
      <input
        id="login_password"
        name="login_password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={loginPassword}
        onChange={(e) => {
          setLoginPassword(e.target.value);
          setErrorMessage(""); // 입력 중일 때 에러 메시지 초기화
        }}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button
        id="login_button"
        type="button"
        onClick={validate}
        disabled={loading} // 로딩 중일 때 버튼 비활성화
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      <Link href="/user/join">Register</Link>
    </section>
  );
};
export default LoginPage;
