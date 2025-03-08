

function App() {

  return (
    <div className="font-mono bg-black min-h-screen">
      <nav className="w-full h-14 flex items-center p-4">
        <div className="w-full h-full flex justify-start items-center">
          <img className="w-24 h-auto pr-6" src="./public/vercel-logo.svg" alt="Website logo" />
          <ul className="flex flex-row justify-center items-center text-sm text-white gap-4">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
        <div className="w-full h-full flex justify-end items-center">
          <button className="bg-black text-white px-4 py-1.5 rounded-sm text-sm cursor-pointer">Log in</button>
        </div>
      </nav>
        <div className="w-full mt-20 min-h-screen justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-white mb-6 tracking-tighter">Store your files (if you dare).</h1>
            <div className="w-150">
              <h3 className="text-md text-gray-200 text-center tracking-tighter mb-1">Store your files safely (I believe) & support a young pal.</h3>
              <h3 className="text-md text-gray-200 text-center tracking-tighter">Google is spying you.</h3>
            </div>
        </div>
      </div>
    </div>
  )
};

export default App
