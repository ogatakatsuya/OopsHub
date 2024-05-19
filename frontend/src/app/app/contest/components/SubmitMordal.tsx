"use client";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Button,
    Textarea
} from '@chakra-ui/react'

import { useState } from 'react';
import { auth } from '@/app/firebase';
import { create } from 'domain';
import { useRouter } from 'next/navigation';

const SubmitMordal = ({ isOpen, onClose, onOpen, contest_id }) => {
    
    const router = useRouter();
    const [ text, setText ] = useState("");
    const [ submitError, setSubmitError ] = useState("");
    const handleSubmit = async () => {
        const user_id = auth.currentUser?.uid; // ユーザーIDを正しく取得
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const created_at = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        try {
            const res = await fetch(`http://localhost:8000/contest/${contest_id}/post`, { // ポート番号を修正
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: user_id, text: text, created_at: created_at }),
            });

            if (!res.ok) {
            const errorData = await res.json();
            setSubmitError(errorData.message || "何か問題が発生しました");
            } else {
            const data = await res.json();
            console.log(data);
            onClose()
            router.refresh()
            }
        } catch (err) {
            setSubmitError("ネットワークエラーです。後で再試行してください。");
            console.error("ネットワークエラー:", err);
        }
        };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>コンテストに投稿！</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Textarea
                size="lg"
                p={3}
                bgColor="white"
                variant="flushed"
                value={text}
                onChange={(e) => {setText(e.target.value)}}
                />
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button
                colorScheme="blue"
                size="md"
                bgColor="white"
                variant="outline"
                px={7}
                type="submit"
                onClick={handleSubmit}
                >
                投稿
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SubmitMordal;