import { Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

const BackButton = () => {
    const router = useRouter();
    const clickHandler = () => {
        router.push("/app/home");
    }
    return(
        <Button onClick={clickHandler} my={4}>
            戻る
        </Button>
    )
}

export default BackButton;