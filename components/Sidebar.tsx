// "use client";
// import { useState } from "react";
// import Link from "next/link";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <aside className="w-64 h-screen bg-gray-800 text-white fixed">
//       <div className="p-5 text-lg font-bold">Admin Dashboard</div>
//       <nav>
//         <Link href="/" className="block p-3 hover:bg-gray-700">Dashboard</Link>
        
//         {/* STATES DROPDOWN */}
//         <div>
//           <button className="w-full text-left p-3 hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
//             States {isOpen ? "▲" : "▼"}
//           </button>
//           {isOpen && (
//             <div className="pl-5">
//               {["Lagos", "Kano", "Rivers", "Ogun", "Kaduna"].map((state) => (
//                 <Link key={state} href={`/states/${state.toLowerCase()}`} className="block p-2 hover:bg-gray-600">{state}</Link>
//               ))}
//             </div>
//           )}
//         </div>

//         <Link href="/enumerators" className="block p-3 hover:bg-gray-700">Enumerators</Link>
//         <Link href="/questions" className="block p-3 hover:bg-gray-700">Questions</Link>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden p-4 text-white bg-gray-800 fixed top-0 left-0 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-5 text-lg font-bold">Admin Dashboard</div>
        <nav>
          <Link href="/" className="block p-3 hover:bg-gray-700">
            Dashboard
          </Link>

          {/* STATES DROPDOWN */}
          <div>
            <button
              className="w-full text-left p-3 hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              States {isDropdownOpen ? "▲" : "▼"}
            </button>
            {isDropdownOpen && (
              <div className="pl-5">
                {["Lagos", "Kano", "Rivers", "Ogun", "Kaduna"].map((state) => (
                  <Link
                    key={state}
                    href={`/states/${state.toLowerCase()}`}
                    className="block p-2 hover:bg-gray-600"
                  >
                    {state}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/enumerators" className="block p-3 hover:bg-gray-700">
            Enumerators
          </Link>
          <Link href="/questions" className="block p-3 hover:bg-gray-700">
            Survey Questions
          </Link>
        </nav>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
