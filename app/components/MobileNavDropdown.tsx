"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/app/contextFiles/ThemeContext";
import ThemeToggle from "@/app/components/ThemeToggle";

type Props = {
  open: boolean;
  onClick: () => void;
};

export default function MobileNavDropdown({ open, onClick }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const { theme, toggleTheme } = useTheme();

  function closeMenu() {
    if (open) onClick();
  }

  return (
    <>
      <button
        onClick={onClick}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative h-6 w-6 flex flex-col justify-center items-center z-20 cursor-pointer md:hidden"
      >
        <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${open ? "rotate-45" : "-translate-y-2"}`} />
        <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
        <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${open ? "-rotate-45" : "translate-y-2"}`} />
      </button>

      <ul
        className={`fixed z-10 inset-0 flex flex-col items-center gap-2 pt-24 px-8 transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: 'var(--bg-surface)' }}
      >
        <li className="w-full">
          <Link
            href="/map"
            onClick={closeMenu}
            className={`block w-full text-center px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              pathname === '/map'
                ? 'bg-[var(--jade-800)] text-[var(--jade-100)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            Map
          </Link>
        </li>

        <li className="w-full flex justify-center py-2">
          <ThemeToggle onClickHandler={toggleTheme} theme={theme} />
        </li>

        {isLoggedIn ? (
          <>
            <li className="w-full">
              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-base font-medium transition-all duration-200 hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: 'var(--jade-800)', color: 'var(--jade-100)' }}
                >
                  {session.user?.name?.[0].toUpperCase() ?? 'U'}
                </div>
                {session.user?.name ?? 'Account'}
              </Link>
            </li>
            <li className="w-full">
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full px-4 py-3 rounded-md text-base font-medium transition-all duration-200 hover:bg-[var(--bg-hover)] cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                Sign out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="w-full">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium transition-all duration-200 hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Log in
              </Link>
            </li>
            <li className="w-full">
              <Link
                href="/register"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium transition-all duration-200"
                style={{ background: 'var(--jade-600)', color: 'var(--jade-100)' }}
              >
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
}