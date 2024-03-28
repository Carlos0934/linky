"use client";
import classNames from "classnames";
import { ClockRotateRight, Settings, StatsDownSquare } from "iconoir-react";
import { headers } from "next/headers";
import Link from "next/link";
import { usePathname } from "next/navigation";

const options = [
  {
    title: "History",
    icon: ClockRotateRight,
    path: "/dashboard",
  },
  {
    title: "Statistics",
    icon: StatsDownSquare,
    path: "/dashboard/statistics",
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="w-full mx-auto max-w-screen-xl px-2 py-16 sm:px-0">
      <ul className="flex space-x-3 mx-auto w-full max-w-screen-md rounded-xl bg-blue-900/20 p-1">
        {options.map(({ title, path, icon: Icon }) => (
          <li className="w-full" key={title}>
            <Link
              href={path}
              className={` ${classNames(
                "w-full block cursor-pointer text-center transition capitalize rounded-lg py-2.5 text-sm font-semibold leading-5  text-gray-100 shadow",
                {
                  "bg-blue-700": path === pathname,
                  "hover:bg-blue-900/40": path !== pathname,
                }
              )}`}
            >
              {Icon && <Icon className="inline-block w-5 h-5 mr-2" />}
              {title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-2">{children}</div>
    </main>
  );
}
