"use client";
import { Copy } from "iconoir-react";
import useClipboard from "../hooks/useClipboard";

type LinkClipboardProps = {
  url: string;
};

export default function LinkClipboard({ url }: LinkClipboardProps) {
  const copyToClipboard = useClipboard();
  return (
    <button
      title="Copy to clipboard"
      className="px-4 py-1 text-sm  text-white rounded-lg"
      onClick={() => copyToClipboard(url)}
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}
