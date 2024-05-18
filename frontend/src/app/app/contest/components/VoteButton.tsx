"use client";

import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";

import { auth } from "@/app/firebase";

interface LikeButtonProps {
    post_id: number;
    votes: number;
}

const VoteButton: React.FC<LikeButtonProps> = ({ votes, post_id }) => {
    const [ submitError, setSubmitError ] = useState<string | null>(null);
    const [ voteNum, setVoteNum ] = useState(votes);

    const user_id = auth.currentUser?.uid;
    const vote = async () => {
        try {
            const res = await fetch(`http://localhost:8000/contest/${post_id}/vote`, { // ポート番号を修正
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
            setVoteNum(data.votes);
            setSubmitError(null); // 成功時に以前のエラーをクリア
            }
        } catch (err) {
            setSubmitError("ネットワークエラーです。後で再試行してください。");
            console.error("ネットワークエラー:", err);
        }
    }
    return (
        <>
        <span>{voteNum}</span>
        <Button 
        mr={3} 
        size='xs'
        onClick={vote}
        >
        投票
        </Button>
        {submitError && (
        <Text color="red.500" mt={2}>
            {submitError}
        </Text>
        )}
        </>
    )
}

export default VoteButton;