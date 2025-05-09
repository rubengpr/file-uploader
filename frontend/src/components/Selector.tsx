interface SelectorProps {
    label?: string;
    options: { value: string; name: string }[];
    value: string;
    onChange: (value: string) => void;
}

export default function Selector({ label, options, value, onChange }: SelectorProps) {
  const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-1 py-1 text-white text-xs border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white">
        {sortedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
