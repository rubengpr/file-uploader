import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

export default function ButtonTable() {
    return(
        <div className="px-4 py-1 rounded-3xl hover:bg-neutral-800 justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out">
            <FontAwesomeIcon icon={faFilter} style={{color: "#ffffff"}} />
            <button className="pl-2 text-sm text-white cursor-pointer">Filters</button>
        </div>
    )
}