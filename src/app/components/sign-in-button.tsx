"use client";
import classNames from "classnames";
import { signIn } from "next-auth/react";

interface SignInButtonProps {
  className?: string;
}
export default function SignInButton({ className }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className={classNames(
        className,
        "px-6 py-2.5  bg-blue-700 shadow-blue-800 shadow-md  rounded-full font-semibold text-gray-200 hover:bg-blue-600 transition-colors duration-300 ease-in-out"
      )}
    >
      Sign in with GitHub
    </button>
  );
}
