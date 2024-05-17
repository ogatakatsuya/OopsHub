"use client";

import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react"

const ContestButton = () => {
    const router = useRouter();
    const clickHandler = () => {
        router.push("/app/contest");
    }
    return (
        <Button 
        size="lg"
        colorScheme="green"
        my="24px"
        mx="24px"
        onClick={clickHandler}
        >
            コンテストに参加する
        </Button>
    )
}

export default ContestButton;