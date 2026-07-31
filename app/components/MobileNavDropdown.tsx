"use client";

type Props = {
  open: boolean;
  onClick: () => void;
};

export default function MobileNavToggle({ open, onClick }: Props) {
  return (
    <>
      <button
        onClick={onClick}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="relative h-6 w-6 flex flex-col justify-center items-center z-20 cursor-pointer md:hidden"
      >
        <span
          className={`absolute h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${
            open ? "rotate-45" : "-translate-y-2"
          }`}
        />
        <span
          className={`absolute h-0.5 w-6 rounded-full bg-current transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute h-0.5 w-6 rounded-full bg-current transition-transform duration-200 ${
            open ? "-rotate-45" : "translate-y-2"
          }`}
        />
      </button>
      <ul className={`absolute z-10 top-0 left-0 h-screen w-screen bg-white dark:bg-black transition-transform duration-300
                     ${open ? "translate-x-0" : "translate-x-full"}
      `}>
          
      </ul>
    </>
  );
}