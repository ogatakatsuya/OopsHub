"use client";

import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

import { auth } from "../firebase";

interface LikeButtonProps {
    post_id: number;
    learneds: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ post_id, learneds }) => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [learnedNum, setLearnedNum] = useState(learneds);
    const [liked, setLiked] = useState(false); // いいねの状態を管理するステート
    const user_id = auth.currentUser?.uid;

    const toggleLike = async () => {
        const method = liked ? "DELETE" : "POST"; // 現在の状態に応じてアクションを切り替える
        try {
            const res = await fetch(`http://localhost:8000/learned/${post_id}/`, {
                method: method,
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
                setLearnedNum(data.learneds);
                setLiked(!liked); // いいねの状態を反転
                setSubmitError(null); // 成功時に以前のエラーをクリア
            }
        } catch (err) {
            setSubmitError("ネットワークエラーです。後で再試行してください。");
            console.error("ネットワークエラー:", err);
        }
    }

    return (
        <>
            <span>{learnedNum}</span>
            <Button mr={3} size='xs' onClick={toggleLike}>
                ためになる
            </Button>
        </>
    )
}

export default LikeButton;
