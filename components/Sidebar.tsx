
"use client"; // Ensure it's a client component

import { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-5 text-lg font-bold">Admin Dashboard</div>
      <nav>
        <Link href="/admin" className="block p-3 hover:bg-gray-700">
          Dashboard
        </Link>

        {/* STATES DROPDOWN */}
        <div>
          <button className="w-full text-left p-3 hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
            States {isOpen ? "▲" : "▼"}
          </button>
          {isOpen && (
            <div className="pl-5">
              {["Lagos", "Kano", "Rivers", "Ogun", "Kaduna"].map((state) => (
                <Link key={state} href={`/states/${state.toLowerCase()}`} className="block p-2 hover:bg-gray-600">
                  {state}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/list-of-enumerators" className="block p-3 hover:bg-gray-700">
          Enumerators
        </Link>
        <Link href="/questions" className="block p-3 hover:bg-gray-700">
          Questions
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
