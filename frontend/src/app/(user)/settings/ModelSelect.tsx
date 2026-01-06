interface ModelSelectProps {
  value: string;
  onChange: (model: string) => void;
  className?: string;
}

const MODEL_OPTIONS = [
  { value: "openai/gpt-4o-mini", label: "GPT-4O Mini" },
  { value: "xiaomi/mimo-v2-flash:free", label: "Xiaomi Mimo V2 Flash(free)" },
];

export default function ModelSelect({
  value,
  onChange,
  className = "",
}: ModelSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full cursor-pointer touch-manipulation rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-gray-100 transition-all duration-100 hover:bg-white/10 focus:ring-2 focus:ring-[#FF7518]/20 focus:outline-none sm:py-2 sm:text-sm ${className} `}
    >
      {MODEL_OPTIONS.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-[#1A1A1A] text-gray-100"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
