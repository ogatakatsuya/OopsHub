"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Heading,
  FormControl,
  Text,
  Textarea,
  Box,
  Flex,
} from "@chakra-ui/react";
import { auth } from "../firebase";
import ApiButton from "../components/ApiButton";
import React from "react";

type Inputs = {
  text: string;
};

export default function Home() {
  const [solution, setSolution] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const api: SubmitHandler<Inputs> = async (value) => {
    try {
      const res = await fetch("http://localhost:8000/api/", {
        // ポート番号を修正
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value.text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setSubmitError(errorData.message || "何か問題が発生しました");
      } else {
        const data = await res.json();
        setSolution(data.solution);
        setSubmitError(null); // 成功時に以前のエラーをクリア
      }
    } catch (err) {
      setSubmitError("ネットワークエラーです。後で再試行してください。");
      console.error("ネットワークエラー:", err);
    }
  };

  // const onSubmit: SubmitHandler<Inputs> = async (value) => {
  //   const user_id = auth.currentUser?.uid; // ユーザーIDを正しく取得
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0');
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const hours = String(now.getHours()).padStart(2, '0');
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const seconds = String(now.getSeconds()).padStart(2, '0');
  //   const created_at = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  //   try {
  //     const res = await fetch("http://localhost:8000/post/", { // ポート番号を修正
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ text: value.text, user_id: user_id, date: created_at }),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       setSubmitError(errorData.message || "何か問題が発生しました");
  //     } else {
  //       const data = await res.json();
  //       console.log(data);
  //       setSubmitError(null); // 成功時に以前のエラーをクリア
  //     }
  //   } catch (err) {
  //     setSubmitError("ネットワークエラーです。後で再試行してください。");
  //     console.error("ネットワークエラー:", err);
  //   }
  // };

  return (
    <>
      <Heading mb={4}>失敗談共有アプリ</Heading>
      <Text fontSize="xl">失敗談を共有する事ができるアプリです😃</Text>
      <form onSubmit={handleSubmit(api)}>
        <FormControl isInvalid={!!errors.text}>
          <FormLabel>失敗談：</FormLabel>
          <Textarea
            {...register("text", {
              required: "失敗談を入力してください．",
            })}
          />
          <FormErrorMessage>
            {errors.text && errors.text.message}
          </FormErrorMessage>
        </FormControl>
        {submitError && (
          <Text color="red.500" mt={2}>
            {submitError}
          </Text>
        )}
        {solution ? (
          <>
            <Flex my={4}>
              <Box>
                <Text>{solution}</Text>
              </Box>
            </Flex>
            <ApiButton />
          </>
        ) : (
          <>
            <Button
              size="lg"
              colorScheme="green"
              my="24px"
              type="submit"
              isLoading={isSubmitting}
            >
              AIに相談する
            </Button>
          </>
        )}
      </form>
    </>
  );
}
