"use client";

import { useRouter } from "next/router";

const ContestField = () => {
    const router = useRouter();
    const pid = router.query.id;
    return(
        <>
        {pid}
        </>
    )
}

export default ContestField;