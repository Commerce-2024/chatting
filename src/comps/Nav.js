"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
const Nav = () => {
  const { data: session } = useSession();
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/chat">message</Link>
      </li>
      <li>
        {session?.user ? (
          <Link href="#" onClick={() => signOut()}>
            로그아웃({session?.user.name})
          </Link>
        ) : (
          <Link href="/api/auth/signin">로그인</Link>
        )}
      </li>
      <li>
        <Link href="/friend">friends</Link>
      </li>
    </ul>
  );
};
export default Nav;
