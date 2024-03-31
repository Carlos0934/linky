import { Link } from "@/lib/domain/links";
import getSearchParams from "@/lib/utils/get-search-params";
import classNames from "classnames";
import { StatsDownSquare } from "iconoir-react";
import NextLink from "next/link";

type LinkListProps = {
  data: Link[];
};

export default function LinkList({ data }: LinkListProps) {
  const searchParams = getSearchParams();

  const linkId = searchParams.get("linkId");

  return (
    <aside className="text-gray-100 w-full max-w-md bg-gray-900 rounded ">
      <header className="flex items-center bg-gray-800 p-4">
        <h2 className="text-xl font-semibold">Links</h2>
        <form className="ml-auto  hidden">
          <input
            type="search"
            placeholder="Search links"
            className="outline-none bg-transparent px-4 py-2.5 text-md bg-gray-700 rounded-lg "
          />

          <button className="ml-4 font-semibold bg-blue-600 px-4 py-2.5 rounded-lg">
            Search
          </button>
        </form>
      </header>

      <ul className="space-y-4 p-4">
        {data.map((link) => (
          <li
            key={link.id}
            className={classNames(
              "p-4 cursor-pointer bg-gray-800 rounded-lg  hover:bg-gray-700 transition duration-300",
              {
                "bg-gray-700 border-l-8 border-blue-600": link.id === linkId,
              }
            )}
          >
            <NextLink href={`/dashboard/statistics?linkId=${link.id}`}>
              <header className="flex items-center">
                {new Date(link.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}

                <h3 className="text-sm font-semibold ml-auto">{link.clicks}</h3>
                <StatsDownSquare className="w-5 ml-2 h-5 inline-block" />
              </header>
              <h3 className="text-md text-gray-300 font-semibold ml-auto">
                {link.shortUrl}
              </h3>
            </NextLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
