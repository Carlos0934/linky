import { Xmark } from "iconoir-react";
import { getLinkById } from "../queries";
import Switch from "./switch";
import getSearchParams from "@/lib/utils/get-search-params";
import Link from "next/link";
import { updateLink } from "../actions";

export async function EditLinkModal() {
  const params = getSearchParams();
  const linkId = params.get("editLink");
  if (!linkId) return null;
  const data = await getLinkById(linkId);

  if (!data) return null;
  const handleEdit = async (formData: FormData) => {
    "use server";
    await updateLink(linkId, formData);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-gray-100 w-full max-w-lg p-6 rounded-lg">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Link </h2>

          <Link
            href={"/dashboard"}
            className="text-red-500"
            aria-label="Delete Link"
          >
            <Xmark className="w-6 h-6" />
          </Link>
        </header>
        <h3>{data.shortUrl}</h3>
        <hr className="my-4" />

        <form className="mt-6" action={handleEdit}>
          <div className="flex flex-col gap-4">
            <label htmlFor="originalUrl">Original URL</label>
            <input
              type="text"
              name="originalUrl"
              defaultValue={data.originalUrl}
              className="w-full px-4 py-2 rounded-lg bg-gray-800"
            />
          </div>

          <Switch
            className="mt-4"
            defaultChecked={data.status === "active"}
            name="isActive"
            label="Active"
          />

          <div className="flex justify-end mt-6">
            <button className="px-4 w-full py-2 bg-blue-700  rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
