import { Button } from "@chakra-ui/react";
import Logout from "../../components/Logout";
import Navi from "../../components/Navi"
import ContestButton from "@/app/components/ContestButton";

const Home = () => {
    return(
        <>
        <Button
            size="lg"
            colorScheme="green"
            my="24px"
            as="a"
            href="/app/post"
        >
            失敗談を投稿する
        </Button>
        <ContestButton />
        <Navi />
        </>
    )
}

export default Home;