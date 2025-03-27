import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareFromSquare, faCircleDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function OptionsMenu() {
    return(
        <div className='absolute min-w-26 top-8 right-12 rounded-xs text-[10px] flex flex-col items-center justify-center bg-neutral-50'>
            <div className='w-full flex flex-row justify-start py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
            <FontAwesomeIcon icon={faShareFromSquare} />
            <p>Share</p>
            </div>
            <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
            <FontAwesomeIcon icon={faCircleDown} />
            <p>Download</p>
            </div>
            <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
            <FontAwesomeIcon icon={faPenToSquare} />
            <p>Rename</p>
            </div>
            <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
            <FontAwesomeIcon icon={faTrash} />
            <p>Delete</p>
            </div>
        </div>
    )
}