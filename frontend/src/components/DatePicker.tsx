interface DateRangePickerProps {
    date: string;
    handleDateChange: (newDate: string) => void;
  }
  
  export default function DateRangePicker({ date, handleDateChange }: DateRangePickerProps) {
    return (
      <div className="flex flex-col gap-1">
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-1 py-1 text-white text-xs border border-gray-400 rounded-sm bg-transparent caret-white focus:outline-none focus:ring focus:ring-white hover:border-white"
          />
      </div>
    );
  }
  