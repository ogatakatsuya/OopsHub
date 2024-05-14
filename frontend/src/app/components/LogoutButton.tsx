"use client"; // This directive ensures the component is treated as a client component

import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    async function handleLogout() {
        try {
            await signOut(auth);
            // Sign-out successful.
            router.push("/auth/login");
            console.log("sign out success!");

        } catch (error) {
            // An error happened.
            console.log(error);
        }
    }

    return (
        <Button colorScheme="teal" onClick={handleLogout}>
            サインアウト
        </Button>
    );
}