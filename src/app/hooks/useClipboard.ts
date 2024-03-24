export default function useClipboard() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showCopiedToClipboard();
  };

  const showCopiedToClipboard = () => {
    const el = document.createElement("div");
    el.textContent = "Copied to clipboard";
    el.className =
      "fixed bottom-4 opacity-0  transition duration-400 ease-in-out  right-1/2 translate-x-1/2  bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md text-sm font-semibold  z-50";

    document.body.appendChild(el);
    el.classList.toggle("opacity-0");
    setTimeout(() => {
      el.classList.toggle("opacity-0");
      setTimeout(() => {
        document.body.removeChild(el);
      }, 1000);
    }, 2000);
  };

  return copyToClipboard;
}
