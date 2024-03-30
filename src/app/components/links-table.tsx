import { getLatestLinks, getLinksByUserId } from "../queries";

import { getUser } from "@/lib/utils/get-user";
import LinkClipboard from "./link-clipboard";
import {
  EditPencil,
  Link as LinkIcon,
  LinkSlash as LinkSlashIcon,
  Trash,
} from "iconoir-react";
import Link from "next/link";

type LinksTableProps = {
  showActions?: boolean;
  latest?: boolean;
};

export default async function LinksTable({
  showActions,
  latest,
}: LinksTableProps) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const data = latest
    ? await getLatestLinks(user.id)
    : await getLinksByUserId(user.id);

  return (
    <div className=" mt-10">
      <table className=" bg-gray-900 table-auto  w-full overflow-x-scroll ">
        <thead className="bg-gray-800  text-gray-200">
          <tr className="   text-left  ">
            <th className="px-6 py-4  rounded-tl-lg">Shortened Link</th>
            <th className="">Original Link</th>
            <th className="px-4">Clicks</th>
            <th className="px-8">Status</th>
            <th className="rounded-tr-lg px-5 text-center">Date</th>
            {showActions && <th className="px-5 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="mt-5 text-gray-300  text-left">
          {data.length === 0 && (
            <tr className="">
              <td colSpan={5} className="text-center py-4 text-gray-400">
                No links available
              </td>
            </tr>
          )}
          {data.map((item) => (
            <tr key={item.id} className="tr">
              <td className="td">
                {item.shortUrl}

                <LinkClipboard url={item.shortUrl} />
              </td>
              <td className="max-w-xs text-ellipsis  overflow-hidden td">
                {item.originalUrl}
              </td>
              <td className=" td text-center">{item.clicks}</td>
              <td className="td md:text-center">
                <span
                  className={`rounded-full flex items-center justify-center  font-medium  capitalize px-2 py-1 ${
                    item.status === "active"
                      ? `text-green-500`
                      : `text-orange-500`
                  }`}
                >
                  {item.status}
                  <span className="transform -rotate-45 inline-block ml-2">
                    {item.status === "active" ? (
                      <LinkIcon className="h-5 w-5" />
                    ) : (
                      <LinkSlashIcon className="h-5 w-5" />
                    )}
                  </span>
                </span>
              </td>
              <td className="px-5 td text-nowrap">
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>

              {showActions && (
                <td className=" td  text-center space-x-5">
                  <Link
                    href={`/dashboard/?editLink=${item.id}`}
                    title="Edit"
                    className="text-blue-500 inline-block hover:text-blue-600"
                  >
                    <EditPencil className="h-6 w-6" />
                  </Link>
                  <Link
                    href={`/dashboard/?deleteLink=${item.id}`}
                    title="Delete"
                    className="text-red-500 inline-block hover:text-red-600"
                  >
                    <Trash className="h-6 w-6" />
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
