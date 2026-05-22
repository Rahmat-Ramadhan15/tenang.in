"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultRedirectPage() {

  const router =
    useRouter();

  useEffect(() => {

    const latestId =
      localStorage.getItem(
        "latestPredictionId"
      );

    if (latestId) {

      router.replace(
        `/result/${latestId}`
      );

    } else {

      router.replace(
        "/dashboard"
      );

    }

  }, [router]);

  return (

    <div className="min-h-screen flex items-center justify-center text-white">

      Loading...

    </div>
  );
}