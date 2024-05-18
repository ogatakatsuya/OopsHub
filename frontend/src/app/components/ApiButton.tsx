import { Button, Flex } from "@chakra-ui/react";
import { auth } from "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ApiButton = ({ text, solution, setText, setSolution, onClose }) => {
  const [submitError, setSubmitError] = useState();
  const router = useRouter();
  const Submit = async () => {
    const user_id = auth.currentUser?.uid; // ユーザーIDを正しく取得
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const created_at = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    try {
      const res = await fetch("http://localhost:8000/post/", {
        // ポート番号を修正
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          user_id: user_id,
          date: created_at,
          solution: solution,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setSubmitError(errorData.message || "何か問題が発生しました");
      } else {
        const data = await res.json();
        console.log(data);
        setText("");
        setSolution("");
        onClose();
      }
    } catch (err) {
      console.error("ネットワークエラー:", err);
    }
  };
  return (
    <>
        <Flex justify="flex-end" mt={4}>
        <Button
            size="lg"
            colorScheme="blue"
            type="submit"
            onClick={Submit}
        >
          共有する
        </Button>
        </Flex>
    </>
  );
};

export default ApiButton;
