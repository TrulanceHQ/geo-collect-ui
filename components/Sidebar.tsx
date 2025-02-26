"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { fetchTotalStates } from "@/services/apiService";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [states, setStates] = useState<string[]>([]);

  const router = useRouter(); // Move router hook here

  const logout = () => {
    // Remove stored data from localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedState");

    // Optionally, navigate the user to the login page or home page
    router.push("/");
  };

  // Fetch states when component mounts
  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await fetchTotalStates();
        console.log("Fetched States Response:", response);

        // Extract ngstates from the response
        if (Array.isArray(response.states) && response.states.length > 0) {
          const extractedStates = response.states[0]?.ngstates || [];

          // Verify if extractedStates is an array of strings
          if (Array.isArray(extractedStates)) {
            console.log("Extracted States:", extractedStates);
            setStates(extractedStates);
          } else {
            console.error("Extracted states is not an array:", extractedStates);
          }
        } else {
          console.error("Invalid response format for states:", response.states);
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    loadStates();
  }, []);

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
          <Link
            href="/admin"
            className="block p-3 hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
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
                {states.length === 0 ? (
                  <p className="text-gray-400 p-2">Loading...</p>
                ) : (
                  states.map((state, index) => (
                    <Link
                      key={index}
                      href={`/states/${encodeURIComponent(
                        state.toLowerCase()
                      )}`}
                      className="block p-2 hover:bg-gray-600"
                      onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked
                    >
                      {state}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/list-of-fieldcoordinators"
            className="block p-3 hover:bg-gray-700"
            onClick={() => setIsOpen(false)} // Close sidebar when link is clicked
          >
            Field Coordinators
          </Link>
          <Link
            href="/questions"
            className="block p-3 hover:bg-gray-700"
            onClick={() => setIsOpen(false)} // Close sidebar when link is clicked
          >
            Survey Questions
          </Link>
          <Link
            href="/all-responses"
            className="block p-3 hover:bg-gray-700"
            onClick={() => setIsOpen(false)} // Close sidebar when link is clicked
          >
            All Responses
          </Link>

          <button
            className="bg-red-500 text-white px-4 py-1 rounded "
            onClick={logout}
          >
            Log Out
          </button>
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
