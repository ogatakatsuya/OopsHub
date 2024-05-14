import { Heading } from "@chakra-ui/react";
import LogoutButton from "./LogoutButton";

import { getAuth } from "firebase/auth";

import { auth } from "../firebase";

export default function Logout() {

    return (
        <>
            <Heading>
                {auth ? (
                    <LogoutButton />
                ) : (
                    'ログアウト中'
                )}
            </Heading>
        </>
    );
}