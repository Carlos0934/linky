"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className="px-6 py-2.5  bg-blue-700 shadow-blue-800 shadow-md  rounded-full font-semibold text-gray-200 hover:bg-blue-600 transition-colors duration-300 ease-in-out"
    >
      Sign in with GitHub
    </button>
  );
}
