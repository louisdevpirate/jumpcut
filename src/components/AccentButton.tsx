interface AccentButtonProps {
  label: string;
  onClick?: () => void;
}

export default function AccentButton({ label, onClick }: AccentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="btn-primary px-4 py-2 rounded-lg text-white font-medium transition shadow-sm"
    >
      {label}
    </button>
  );
}
