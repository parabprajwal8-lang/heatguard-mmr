import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/admin", label: "Admin", icon: "admin_panel_settings" },
  { to: "/hospital", label: "Hospital", icon: "local_hospital" },
] as const;

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-lowest shadow-level-1 border-b border-surface-variant">
      <div className="flex items-center gap-lg">
        {/* App Name */}
        <NavLink
          to="/"
          className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-sm"
        >
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            thermostat
          </span>
          <span className="hidden sm:inline">HeatGuard MMR</span>
          <span className="sm:hidden">HG</span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-xs ml-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                [
                  "text-label-md font-label-md px-md py-sm rounded-md transition-all duration-200 flex items-center gap-xs",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-bright hover:text-primary",
                ].join(" ")
              }
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-sm">
        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                [
                  "text-label-sm font-label-sm px-sm py-xs rounded transition-colors flex items-center gap-xs",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : "text-on-surface-variant",
                ].join(" ")
              }
            >
              <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
              <span className="hidden xs:inline">{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Icons */}
        <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-bright">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-bright hidden sm:block">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </nav>
  );
}
