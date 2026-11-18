import { Link, useRouterState } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

interface SiteNavProps {
  onHowItWorksClick?: (e: React.MouseEvent) => void;
  compact?: boolean;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function SiteNav({ onHowItWorksClick, compact, centerSlot, rightSlot }: SiteNavProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className={`site-nav ${compact ? "site-nav-compact" : ""}`} aria-label="Main navigation">
      <div className="flex items-center gap-6">
        <Link to="/" className="wordmark wordmark-light" aria-label="BriefLock Studio Home">
          <span className="brand-mark">
            <LockKeyhole size={15} />
          </span>
          <span>
            BriefLock <b>Studio</b>
          </span>
        </Link>

        <div className="nav-links">
          <a
            href="/#how-it-works"
            onClick={onHowItWorksClick}
            className="transition-colors hover:text-burnt-orange"
          >
            How it works
          </a>

          <Link
            to="/contract"
            className={`transition-colors hover:text-burnt-orange ${
              currentPath === "/contract"
                ? "font-semibold text-burnt-orange underline underline-offset-4 decoration-burnt-orange"
                : ""
            }`}
          >
            Design Contract
          </Link>

          <Link
            to="/editor"
            className={`transition-colors hover:text-burnt-orange ${
              currentPath === "/editor"
                ? "font-semibold text-burnt-orange underline underline-offset-4 decoration-burnt-orange"
                : ""
            }`}
          >
            Studio Editor
          </Link>
        </div>
      </div>

      {centerSlot && <div className="hidden lg:flex items-center">{centerSlot}</div>}

      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </nav>
  );
}
