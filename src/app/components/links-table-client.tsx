"use client";

import { Link } from "@/lib/domain/links";
import { Link as LinkIcon, LinkSlash as LinkSlashIcon } from "iconoir-react";

import LinkClipboard from "./link-clipboard";

type LinkTableProps = {
  data: Link[];
};
export default function LinksTableClient({ data }: LinkTableProps) {
  return (
    <div className="relative mt-10 bg-gray-900  ">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-800  text-gray-200">
          <tr className="   text-left  ">
            <th className="px-6 py-4  rounded-tl-lg">Shortened Link</th>
            <th className="">Original Link</th>
            <th className="px-4">Clicks</th>
            <th className="px-8">Status</th>
            <th className="rounded-tr-lg px-5 text-center">Date</th>
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
            <tr key={item.id}>
              <td className="p-4 px-6 ">
                {item.shortUrl}
                <LinkClipboard url={item.shortUrl} />
              </td>
              <td className="max-w-sm text-ellipsis overflow-hidden text-nowrap">
                {item.originalUrl}
              </td>
              <td className="text-center">{item.clicks}</td>
              <td className="text-center">
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
              <td className="px-5">
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
