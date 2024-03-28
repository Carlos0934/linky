import Link from "next/link";
import UserDropdown from "./user-dropdown";
import SignInButton from "./sign-in-button";
import { getUser } from "@/lib/utils/get-user";

export default async function TopBar() {
  const user = await getUser();

  return (
    <header className="px-2 py-4 bg flex max-w-screen-xl mx-auto bg-foreground ">
      <Link href="/" className=" text-4xl font-sans   font-bold text-gradient">
        Linky
      </Link>

      <nav className="ml-auto gap-4 flex items-center">
        {user ? <UserDropdown user={user} /> : <SignInButton />}
      </nav>
    </header>
  );
}
