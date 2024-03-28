import LinksTable from "./components/links-table";

import LinkForm from "./components/link-form";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-gray-200 mt-24 pb-10">
      <h1 className="text-center text-balance font-bold mx-auto inline-block leading-relaxed text-6xl text-gradient">
        Shorten Your Loooong Links
      </h1>
      <p className="text-center   text-pretty  max-w-xl text-xl mt-4">
        Linkly is an efficient and easy-to-use URL shortening service that
        streamlines your online experience.
      </p>

      <LinkForm />

      <p className="mt-8 text-gray-300">
        You can create up to{" "}
        <span className="font-semibold text-blue-500">5</span> links. To create
        more, please register.{" "}
      </p>

      <LinksTable latest />
    </main>
  );
}
