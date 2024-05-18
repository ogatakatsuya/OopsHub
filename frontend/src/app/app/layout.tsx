"use client";

import React from "react";
import {  Box } from "@chakra-ui/react";
import BottomBar from "./components/BottomBar";
import UpBar from "./components/UpBar";
import { useAuthContext } from "../auth_provider/AuthProvider";
import Spininng from "../components/Spininng";

export default function MypageLayout({ children }) {
  const { user } = useAuthContext();

  // useEffect(() => {
  //     if (!user) {
  //     redirect("/");
  //     }
  // }, []);

  return (
    <Box>
      {user ? (
        <>
          <UpBar />
          {children}
          <BottomBar />
        </>
      ) : (
        <Spininng />
      )}
    </Box>
  );
}
