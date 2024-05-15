"use client";

import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

import { auth } from "../firebase";

interface LikeButtonProps {
    post_id: number;
}

const DonmaiButton: React.FC<LikeButtonProps> = ({ post_id }) => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const user_id = auth.currentUser?.uid;
    const like = async () => {
        try {
            const res = await fetch(`http://localhost:8000/dontmind/${post_id}/`, { // ポート番号を修正
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: user_id }),
            });
    
            if (!res.ok) {
            const errorData = await res.json();
            setSubmitError(errorData.message || "何か問題が発生しました");
            } else {
            const data = await res.json();
            console.log(data);
            setSubmitError(null); // 成功時に以前のエラーをクリア
            }
        } catch (err) {
            setSubmitError("ネットワークエラーです。後で再試行してください。");
            console.error("ネットワークエラー:", err);
        }
    }
    return (
        <>
        <Button mr={3} size='xs' onClick={like}>どんまい</Button>
        {submitError && (
        <Text color="red.500" mt={2}>
            {submitError}
        </Text>
        )}
        </>
    )
}

export default DonmaiButton;