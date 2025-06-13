import { useState } from "react";
import { Copy } from "lucide-react";

export default function CopyPinButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 bg-black text-white rounded-md text-sm flex gap-2 items-center"
    >
      <Copy className="w-4 h-4" />
      {copied ? "Copied!" : "Quick Copy"}
    </button>
  );
}
