type Props = {
  onClickHandler: () => void;
  theme: 'light' | 'dark';
  compact?: boolean;
};

export default function ThemeToggle({ onClickHandler, theme, compact = false }: Props) {
  const dark = theme === 'dark'

  if (compact) {
    return (
      <button
        onClick={onClickHandler}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="relative z-40 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer z-40 transition-all duration-200 hover:bg-[var(--bg-hover)] group"
        style={{ color: 'var(--text-secondary)' }}
      >
        {dark ? (
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="group-hover:rotate-15 transition-transform duration-200"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
               className="group-hover:rotate-15 transition-transform duration-200"
          >
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClickHandler}
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
    >
      {dark ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}