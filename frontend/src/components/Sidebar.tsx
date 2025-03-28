import SidebarOption from './SidebarOption'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'

export default function Sidebar2() {
    return(
        <div className='sidebar flex flex-col w-50 bg-black px-2 py-4 border-r border-gray-700 gap-1'>
            <SidebarOption icon={faFile} text="New file" />
            <SidebarOption icon={faFolder} text="New folder" />
        </div>
    )
}