import { Button } from "@chakra-ui/react";

const api = () => {

}

const ApiButton = () => {
    return (
        <>
        <Button
        size='lg'
        colorScheme='green'
        my='24px'
        type="submit"
        onClick={api}
        >
        失敗談を共有する
        </Button>
        </>
    )
}

export default ApiButton;