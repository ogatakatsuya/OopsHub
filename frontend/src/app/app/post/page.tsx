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
import ApiButton from "@/app/components/ApiButton";
import React from "react";
import { useAuthContext } from "@/app/auth_provider/AuthProvider";
import BackButton from "@/app/components/BackButton";

type Inputs = {
  text: string;
};

export default function Home() {
  const [solution, setSolution] = useState("");
  const [text, setText] = useState("");
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const api: SubmitHandler<Inputs> = async (value) => {
    setText(value.text);
    try {
      const res = await fetch("http://localhost:8000/api/", {
        // ポート番号を修正
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
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
            <ApiButton text={text} solution={solution}/>
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
      <BackButton />
    </>
  );
}
