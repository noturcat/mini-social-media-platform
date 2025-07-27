interface FloatingCreateButtonProps {
  onClick: () => void;
}

export default function FloatingCreateButton({ onClick }: FloatingCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-6 right-6 bg-wanderer-accent dark:bg-scara-accent text-white w-14 h-14 rounded-full shadow-lg text-3xl hover:bg-wanderer-hover dark:hover:bg-scara-primary transition"
      aria-label="Create"
    >
      +
    </button>
  );
}
