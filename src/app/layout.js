import "./globals.css";
import "../../public/css/home.css";
import Nav from "@/comps/Nav";
import Link from "next/link";
import AuthProvider from "@/provider/AuthProvider";
const RootLayout = ({ children }) => {
  return (
    <html lang="ko">
      <AuthProvider>
        <body>
          <header className="title">
            <Link href="/">
              <h1>Chatting</h1>
            </Link>
            <p>채팅프로젝트</p>
          </header>
          <Nav className="nav" />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
};
export default RootLayout;
