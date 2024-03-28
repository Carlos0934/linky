"use client";

import { useRef, useState } from "react";
import { createLink } from "../actions";
import { Link } from "iconoir-react";
import useClipboard from "../hooks/useClipboard";
import Switch from "./switch";

export default function LinkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const copyToClipboard = useClipboard();
  const [autoPaste, setAutoPaste] = useState(true);

  const handleSubmit = async (data: FormData) => {
    formRef.current?.reset();
    const { shortUrl } = await createLink(data);
    if (autoPaste) copyToClipboard(shortUrl);
  };

  return (
    <>
      <form
        action={handleSubmit}
        ref={formRef}
        className="flex items-center max-w-xl w-full  mt-10 focus-within:text-gray-100 transition-all ease-in-out focus-within:border-gray-500 text-gray-400 border-gray-600 border-4 rounded-full bg-[#181E29] py-1 pl-5 pr-1"
      >
        <Link className="text-lg  -rotate-45 transform" />
        <input
          type="text"
          required
          name="url"
          pattern="https?://.*"
          className=" bg-transparent    text-lg px-4 py-2.5 outline-none"
          placeholder="Paste your link here"
        />

        <button className="px-7 ml-auto text-nowrap py-4 self-stretch bg-blue-700  rounded-full font-semibold text-gray-100 hover:bg-blue-600 transition-colors duration-300 ease-in-out">
          Shorten Link
        </button>
      </form>

      <Switch
        checked={autoPaste}
        onChange={setAutoPaste}
        className="mt-8"
        label="Auto Paste from Clipboard "
      />
    </>
  );
}
