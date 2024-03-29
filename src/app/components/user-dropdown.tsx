"use client";
import { Menu, Transition } from "@headlessui/react";
import { NavArrowDown } from "iconoir-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

type UserDropdownProps = {
  user?: User;
};
const options = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];
export default function UserDropdown({ user }: UserDropdownProps) {
  return (
    <>
      <Menu className="relative" as="div">
        <Menu.Button className="inline-flex  w-full justify-center items-center  rounded-md   text-sm font-medium text-white ">
          <NavArrowDown
            className="mr-2 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
          <span className="text-gray-200 mr-3 text-nowrap  items-center font-semibold">
            {user?.name}
          </span>
          {user?.image && (
            <img
              src={user.image}
              alt={"profile picture"}
              className="w-10 h-10 rounded-full"
            />
          )}
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-1/2 mt-2 w-56 origin-top-right  rounded-md bg-gray-900 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className=" ">
              {options.map((option) => (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <Link
                      href={option.href}
                      key={option.name}
                      className={`${
                        active ? "bg-blue-500 " : "text-gray-200"
                      } group hover:text-white flex w-full transition items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {option.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={`${
                      active ? "bg-blue-500 " : "text-gray-200"
                    } group hover:text-white flex w-full transition items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
