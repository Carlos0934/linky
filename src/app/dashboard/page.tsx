import { Filter } from "iconoir-react";
import LinkForm from "../components/link-form";
import LinksTable from "../components/links-table";

import { EditLinkModal } from "../components/edit-link-modal-client";
import ConfirmDeleteLinkModal from "../components/confirm-delete-link-modal";

export default function HistoryPage() {
  return (
    <main className="mx-auto w-full max-w-screen-lg">
      <section className="flex flex-col items-center">
        <LinkForm />
      </section>

      <header className="text-gray-300 flex justify-between mt-8">
        <h2 className="text-md font-semibold">History</h2>
      </header>

      <EditLinkModal />
      <ConfirmDeleteLinkModal />
      <LinksTable showActions />
    </main>
  );
}
