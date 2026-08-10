"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/app/contextFiles/ThemeContext";

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
        className={`fixed z-10 top-[65px] bottom-0 right-0 w-3/4 sm:w-[70%] flex flex-col items-center gap-2 pt-8 px-8 transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: 'var(--bg-surface)' }}
      >
        <li className="w-full rounded-md">
          <Link
            href="/map"
            onClick={closeMenu}
            className={`group flex justify-between items-center w-full px-4 py-2 rounded-md text-xl font-medium transition-all duration-200 ${
              pathname === '/map'
                ? 'bg-[var(--jade-800)] text-[var(--jade-100)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Map
            <span
              className={`transition-all duration-200 ${
                pathname === '/map'
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
              }`}
            >
              &gt;
            </span>
          </Link>
        </li>

        <hr className='w-full my-2 border-[var(--text-muted)] opacity-25'></hr>

        {isLoggedIn ? (
          <div className='w-full flex gap-4'>
            <li className="w-full border rounded-md" style={{ borderColor: 'var(--bg-border)' }}>
              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-base text-[var(--text-secondary)] font-medium transition-all duration-200 hover:bg-[var(--bg-hover)] hover:text-white"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: 'var(--jade-800)', color: 'var(--jade-100)' }}
                >
                  {session.user?.name?.[0].toUpperCase() ?? 'U'}
                </div>
                {session.user?.name 
                  ? 
                  session.user.name[0].toUpperCase() + session.user.name.slice(1)
                  :
                  'Account'}
              </Link>
            </li>
            <li className="w-full border rounded-md" style={{ borderColor: 'var(--bg-border)' }}>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full h-full px-4 py-2 bg-[var(--jade-600)] rounded-md text-base text-[var(--jade-100)] font-medium hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Sign out
              </button>
            </li>
          </div>
        ) : (
          <div className='w-full flex gap-2'>
            <li className="w-full border rounded-md" style={{ borderColor: 'var(--bg-border)' }}>
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 rounded-md text-base text-[var(--text-secondary)] font-medium transition-all duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                Log in
              </Link>
            </li>
            <li className="w-full">
              <Link
                href="/register"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-[var(--jade-100)] hover:scale-105 hover:text-white transition-all duration-200"
                style={{ background: 'var(--jade-600)'}}
              >
                Sign up
              </Link>
            </li>
          </div>
        )}
      </ul>
    </>
  );
}