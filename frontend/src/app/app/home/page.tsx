import { Button } from "@chakra-ui/react";
import Navi from "../../components/"
import ContestButton from "@/app/components/ContestButton";

const Home = () => {
    return(
        <>
        <ContestButton />
        <Navi />
        <Button
            size="lg"
            colorScheme="green"
            my="24px"
            as="a"
            href="/app/post"
        >
            失敗談を投稿する
        </Button>
        </>
    )
}

export default Home
