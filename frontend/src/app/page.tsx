'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  useEffect(()=>{
      fetch("http://localhost:8000/", {method: "GET"})
      .then(res=>res.json())
      .then(data => {setMessage(data.message)});
  }, [])
  return (
    <div>
      {message}
    </div>
  );
}
