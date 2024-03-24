import { LogIn } from "iconoir-react";

export default function TopBar() {
  return (
    <header className="px-2 py-4 bg flex max-w-screen-xl mx-auto bg-foreground ">
      <h2 className=" text-4xl font-sans   font-bold text-gradient">Linky</h2>

      <nav className="ml-auto gap-4 flex">
        <button className="px-6 py-2.5 flex border-gray-700 bg-slate-800 border-2 rounded-full font-semibold text-gray-200 hover:bg-gray-700 hover:border-gray-600 transition-colors duration-300 ease-in-out">
          Login <LogIn className="ml-2" />
        </button>
        <button className="px-6 py-2.5  bg-blue-700 shadow-blue-800 shadow-md  rounded-full font-semibold text-gray-200 hover:bg-blue-600 transition-colors duration-300 ease-in-out">
          Register Now
        </button>
      </nav>
    </header>
  );
}
