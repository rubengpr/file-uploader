import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { MouseEvent } from 'react'

interface MenuOption {
  label: string
  icon: IconDefinition
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

interface DropdownMenuProps {
  options: MenuOption[]
}

export default function DropdownMenu({ options }: DropdownMenuProps) {
    return (
        <div className="absolute z-10 min-w-26 top-8 right-10 rounded-xs text-[10px] flex flex-col items-center justify-center bg-neutral-50">
          {options.map(({ label, icon, onClick }) => (
            <div
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(e);
            }}
            className="w-full flex flex-row justify-start items-center py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2 cursor-pointer"
          >
            {icon && <FontAwesomeIcon icon={icon} />}
            <p>{label}</p>
          </div>
          ))}
        </div>
      );
    };