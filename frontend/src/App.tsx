import { Link } from "react-router-dom"

function App() {

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
      <div className="hero-page w-full mt-30 h-60 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-white mb-6 tracking-tighter">Store your files (if you dare).</h1>
            <div className="w-150">
              <h3 className="text-md text-gray-200 text-center tracking-tighter mb-1">Store your files safely (I believe) & support a young pal.</h3>
              <h3 className="text-md text-gray-200 text-center tracking-tighter">Google is spying you.</h3>
            </div>
          </div>
      </div>
      <div className="footer w-full h-14 flex flex-row justify-center items-center p-4">
      <a href="https://github.com/rubengpr"><div className="container flex flex-row justify-center items-center gap-2">
          <img className="w-8" src="/github-logo.png" alt="Github logo" />
          <p className="text-md text-white">Made by rubengpr</p>
        </div></a>
      </div>
    </div>
  )
};

export default App
