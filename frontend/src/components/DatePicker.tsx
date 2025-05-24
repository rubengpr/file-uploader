interface DatePickerProps {
  date: string;
  min?: string;
  max?: string;
  onChange: (newDate: string) => void;
}
  
export default function DatePicker({ date, onChange, min, max }: DatePickerProps) {
  return (
    <input
      type="date"
      value={date}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-2 text-white text-xs border border-gray-400 rounded-sm bg-transparent caret-white focus:outline-none focus:ring focus:ring-white hover:border-white"
    />
  )
}