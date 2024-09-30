import Nav from "@/comps/Nav";
import Link from "next/link";
import AuthProvider from "@/provider/AuthProvider";
const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <AuthProvider>
        <body>
          <header>
            <Link href="/">
              <h1>Chatting</h1>
            </Link>
            <p>채팅프로젝트</p>
          </header>
          <Nav />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
};
export default RootLayout;
