import getSearchParams from "@/lib/utils/get-search-params";
import { Xmark } from "iconoir-react";
import Link from "next/link";
import { getLinkById } from "../queries";
import { deleteLink } from "../actions";

export default async function ConfirmDeleteLinkModal() {
  const params = getSearchParams();

  const linkId = params.get("deleteLink");

  if (!linkId) return null;
  const data = await getLinkById(linkId);

  if (!data) return null;

  const handleDelete = async () => {
    "use server";
    try {
      await deleteLink(data.id);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-100 w-full max-w-lg p-6 rounded-lg">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Delete Link</h2>
          <Link
            href="/dashboard"
            role="button"
            className="text-red-500"
            aria-label="Close Modal"
          >
            <Xmark className="w-6 h-6" />
          </Link>
        </header>
        <h3>{data.shortUrl}</h3>
        <p className="mt-2">Are you sure you want to delete this link?</p>

        <hr className="my-4" />

        <form action={handleDelete} className="flex justify-end mt-6">
          <button className="px-4 w-full py-2 bg-red-700 rounded-lg">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
