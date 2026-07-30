type Props = {
  onClickHandler: () => void;
  theme: 'light' | 'dark';
};

export default function ThemeToggle({ onClickHandler, theme }: Props) {
  const dark = theme === 'dark'

  return (
    <button
      onClick={onClickHandler}
      className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
    >
      {dark ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}