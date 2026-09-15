import { NavLink } from "react-router-dom";
import { Download, Home, Share2, Target } from "lucide-react";

// Home / Scan / Tree / Exports appears on 3 of the 4 source screens (Search,
// Tree, Scan); the Home screen alone showed Home/History/Exports/More.
// That's a real inconsistency in the mockups — this follows the majority
// pattern so navigation is actually usable and consistent across the app.
const TABS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/scan", label: "Scan", Icon: Target },
  { to: "/tree", label: "Tree", Icon: Share2 },
  { to: "/exports", label: "Exports", Icon: Download },
];

export function BottomNav() {
  return (
    <nav className="grid grid-cols-4 border-t border-gray-100 bg-white px-2 py-2">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1.5 rounded-xl text-[11px] font-medium ${
              isActive ? "text-brand bg-brand-light" : "text-ink-soft"
            }`
          }
        >
          <Icon size={20} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
