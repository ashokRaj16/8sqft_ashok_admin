'use client';
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SuccessCardComponent(): JSX.Element {
    const router = useRouter();
useEffect(() => {
  setTimeout(() => {
    router.push("/");
  }, 5000);
}, [router]);
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-green-100 rounded-lg shadow-md">
      <div className="text-green-600 text-6xl mb-4">✔️</div>
      <h2 className="text-xl font-semibold text-green-800">Success!</h2>
      <p className="text-center text-gray-700 mt-2">
        Your property details have been successfully submitted. Thank you for completing the process.
      </p>
    </div>
  );
}
