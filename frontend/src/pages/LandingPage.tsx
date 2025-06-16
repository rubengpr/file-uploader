import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen">
      <nav className="navbar w-full h-14 flex items-center p-4">
        <div className="w-full h-full flex justify-start items-center">
          <img className="w-24 h-auto pr-6" src="/folded-logo.svg" alt="Website logo" />
        </div>
        <div className="w-full h-full flex justify-end items-center">
          <button className="cursor-pointer hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white"><Link to="login">Log in</Link></button>
        </div>
      </nav>
      <div className="hero-page w-full mt-10 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tighter">Safe file storage for everyone.</h1>
            <div className="w-150">
              <h3 className="text-md text-gray-200 text-center tracking-tighter mb-1">Store your files safely (I believe) & support a young pal.</h3>
              <h3 className="text-md text-gray-200 text-center tracking-tighter mb-6">Google is spying you.</h3>
            </div>
            <div className="relative flex flex-row justify-center items-center w-full mb-6">
              <img className="z-1 w-150" src="/folder.svg" alt="A folder's illustration" />
              <div className="absolute bg-purple-700 w-150 h-90 animate-[pulse_3s_ease-in-out_infinite] rounded-lg opacity-0 blur-lg"></div>
            </div>
          </div>
      </div>
      <div className="footer w-full h-14 flex flex-row justify-center items-center p-4">
      <a href="https://github.com/rubengpr" target="_blank" rel="noopener noreferrer"><div className="container flex flex-row justify-center items-center gap-2">
          <img className="w-6" src="/github-gradient.svg" alt="Github logo" />
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700">Made by rubengpr</p>
        </div></a>
      </div>
    </div>
  )
};