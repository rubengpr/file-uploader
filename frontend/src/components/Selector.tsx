interface SelectorProps {
    label?: string;
    options: { value: string; name: string }[];
    value: string;
    onChange: (value: string) => void;
}

export default function Selector({ label, options, value, onChange }: SelectorProps) {
  const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col justify-center w-full">
      {label && <label className="text-white text-xs w-full mb-1 pl-0.5">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 h-9 text-white text-xs border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white">
        <option value="" hidden>
          Select a {label?.toLowerCase()}
        </option>
        {sortedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
