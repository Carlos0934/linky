import { getUser } from "@/lib/utils/get-user";
import LinkForm from "./components/link-form";
import SignInButton from "./components/sign-in-button";
import LinksTable from "./components/links-table";

export default async function Home() {
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center text-gray-200 mt-24 pb-10 ">
      <h1 className="text-center text-balance font-bold mx-auto inline-block leading-relaxed text-6xl text-gradient">
        Shorten Your Loooong Links
      </h1>
      <p className="text-center   text-pretty  max-w-xl text-xl mt-4">
        Linkly is an efficient and easy-to-use URL shortening service that
        streamlines your online experience.
      </p>

      <LinkForm />
      {!user && (
        <>
          <p className="mt-8 text-gray-300 text-balance text-center max-w-screen-sm">
            You can also sign up for an account to keep track of your shortened
            links and view detailed analytics.
          </p>

          <SignInButton className="mt-6" />
        </>
      )}

      {user && <LinksTable latest />}
    </main>
  );
}
