"use client";

import Logout from "../components/Logout";
import { useAuthContext } from "@/auth_provider/AuthProvider";

import { useRouter } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
    const {user} = useAuthContext();
    const router = useRouter();
    // if(!user){
    //     router.push("/auth/login");
    // }
    return (
    <>
        {children}
        { user && <Logout/>}
    </>
    );
}