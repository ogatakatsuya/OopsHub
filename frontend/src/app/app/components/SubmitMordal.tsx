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
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import ApiButton from "@/app/components/ApiButton";
import React from "react";
import { useAuthContext } from "@/app/auth_provider/AuthProvider";
import { AiOutlineAliwangwang } from "react-icons/ai";

type Inputs = {
text: string;
};

export default function SubmitMordal({isOpen, onOpen, onClose}) {
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
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
    <ModalHeader>失敗談を投稿する</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
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
            <Flex my={4} alignItems="start">
            <Box>
                <Text>{solution}</Text>
            </Box>
            <AiOutlineAliwangwang />
            </Flex>
            <ApiButton text={text} solution={solution} setText={setText} setSolution={setSolution} onClose={onClose}/>
        </>
        ) : (
        <>
        <Flex justify="flex-end" mt={4}>
        <Button
            size="lg"
            colorScheme="green"
            type="submit"
            isLoading={isSubmitting}
        >
            AIに相談する
        </Button>
        </Flex>
        </>
        )}
    </form>
    </ModalBody>
    <ModalFooter>
    </ModalFooter>
    </ModalContent>
    </Modal>
    </>
);
}