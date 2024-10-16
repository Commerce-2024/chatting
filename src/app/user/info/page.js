"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const UserInfoPage = () => {
  const { data: session } = useSession();
  return <h1>session.user.</h1>;
};
export default UserInfoPage;
