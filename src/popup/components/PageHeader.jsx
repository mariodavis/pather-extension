import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** The "← Back / Title / actions" row used on every screen except Home. */
export function PageHeader({ title, actions }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 relative">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-ink text-[15px]"
      >
        <ArrowLeft size={18} strokeWidth={2} />
        Back
      </button>
      <p className="font-bold text-[17px] absolute left-1/2 -translate-x-1/2">{title}</p>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
