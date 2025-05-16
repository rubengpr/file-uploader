interface TopbarProps {
    avatar: string;
    handleAvatarClick: () => void;
}

export default function Topbar({ avatar, handleAvatarClick }: TopbarProps) {
    return(
        <div className='top-bar h-12 flex flex-row justify-between items-center px-5 border-b border-gray-700'>
            <img className='logo w-20' src="/folded-logo.svg" alt="Folded logo" />
            <img onClick={handleAvatarClick} className='w-7 h-7 rounded-full scale-100 cursor-pointer' src={avatar} alt="User avatar" />
        </div>
    )
}