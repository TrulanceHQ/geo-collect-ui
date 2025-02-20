// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
// import { fetchTotalStates } from "@/services/apiService";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const [states, setStates] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // // Fetch states when component mounts
//   // useEffect(() => {
//   //   const loadStates = async () => {
//   //     const { states } = await fetchTotalStates();
//   //     setStates(states);
//   //     // setTotalStates(total);
//   //   };

//   //   loadStates();
//   // }, []);

//   // Fetch states when the component mounts
//   // useEffect(() => {
//   //   const loadStates = async () => {
//   //     try {
//   //       const response = await fetchTotalStates();
//   //       console.log("Fetched States:", response);

//   //       if (response && Array.isArray(response.states)) {
//   //         setStates(response.states); // ✅ Extract `ngstates`
//   //       } else {
//   //         throw new Error("Invalid states format from API");
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching states:", err);
//   //       setError("Failed to load states");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   loadStates();
//   // }, []);
//   // useEffect(() => {
//   //   const loadStates = async () => {
//   //     try {
//   //       const response = await fetchTotalStates();
//   //       console.log("Sidebar Fetched States:", response);

//   //       if (response && Array.isArray(response.states)) {
//   //         // ✅ Ensure all states are strings
//   //         const validStates = response.states.filter(
//   //           (state) => typeof state === "string"
//   //         );
//   //         setStates(validStates);
//   //       } else {
//   //         throw new Error("Invalid states format from API");
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching states:", err);
//   //       setError("Failed to load states");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   loadStates();
//   // }, []);

//   // useEffect(() => {
//   //   const loadStates = async () => {
//   //     try {
//   //       const response = await fetchTotalStates();
//   //       console.log("Fetched States Response:", response);

//   //       // Extract the correct array from the nested structure
//   //       const extractedStates = response.states?.[0]?.ngstates || [];
//   //       console.log("Extracted States:", extractedStates);

//   //       if (Array.isArray(extractedStates)) {
//   //         setStates(extractedStates);
//   //       } else {
//   //         console.error("States data is not an array:", extractedStates);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching states:", err);
//   //     }
//   //   };

//   //   loadStates();
//   // }, []);

//   // Fetch states when component mounts
//   useEffect(() => {
//     const loadStates = async () => {
//       try {
//         const response = await fetchTotalStates();
//         console.log("Fetched States Response:", response);

//         // Extract ngstates from the response
//         if (Array.isArray(response.states) && response.states.length > 0) {
//           const extractedStates = response.states[0]?.ngstates || [];

//           // Verify if extractedStates is an array of strings
//           if (Array.isArray(extractedStates)) {
//             console.log("Extracted States:", extractedStates);
//             setStates(extractedStates);
//           } else {
//             console.error("Extracted states is not an array:", extractedStates);
//           }
//         } else {
//           console.error("Invalid response format for states:", response.states);
//         }
//       } catch (err) {
//         console.error("Error fetching states:", err);
//       }
//     };

//     loadStates();
//   }, []);

//   return (
//     <>
//       {/* Toggle Button for Small Screens */}
//       <button
//         className="md:hidden p-4 text-white bg-gray-800 fixed top-0 left-0 z-50"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen bg-gray-800 text-white w-64 transform ${
//           isOpen ? "translate-x-0" : "-translate-x-64"
//         } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
//       >
//         <div className="p-5 text-lg font-bold">Admin Dashboard</div>
//         <nav>
//           <Link href="/admin" className="block p-3 hover:bg-gray-700">
//             Dashboard
//           </Link>

//           {/* STATES DROPDOWN */}
//           <div>
//             <button
//               className="w-full text-left p-3 hover:bg-gray-700"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               States {isDropdownOpen ? "▲" : "▼"}
//             </button>
//             {/* {isDropdownOpen && (
//               <div className="pl-5">
//                 {["Lagos", "Kano", "Rivers", "Ogun", "Kaduna"].map((state) => (
//                   <Link
//                     key={state}
//                     href={`/states/${state.toLowerCase()}`}
//                     className="block p-2 hover:bg-gray-600"
//                   >
//                     {state}
//                   </Link>
//                 ))}
//               </div>
//             )} */}
//             {isDropdownOpen && (
//               <div className="pl-5">
//                 {states.length === 0 ? (
//                   <p className="text-gray-400 p-2">Loading...</p>
//                 ) : (
//                   states.map((state, index) => (
//                     <Link
//                       key={index}
//                       href={`/states/${encodeURIComponent(
//                         state.toLowerCase()
//                       )}`}
//                       className="block p-2 hover:bg-gray-600"
//                     >
//                       {state}
//                     </Link>
//                   ))
//                 )}
//               </div>
//             )}
//             {/* {isDropdownOpen && (
//               <div className="pl-5">
//                 {loading ? (
//                   <p className="text-gray-400 p-2">Loading...</p>
//                 ) : error ? (
//                   <p className="text-red-400 p-2">{error}</p>
//                 ) : (
//                   // states.map((state) => (
//                   //   <Link
//                   //     key={state}
//                   //     href={`/states/${state.toLowerCase()}`}
//                   //     className="block p-2 hover:bg-gray-600"
//                   //   >
//                   //     {state}
//                   //   </Link>
//                   // ))
//                   // states
//                   //   .filter((state) => typeof state === "string") // ✅ Filter out non-strings
//                   //   .map((state) => (
//                   //     <Link
//                   //       key={state}
//                   //       href={`/states/${state.toLowerCase()}`}
//                   //       className="block p-2 hover:bg-gray-600"
//                   //     >
//                   //       {state}
//                   //     </Link>
//                   //   ))
//                   // states.map((state) => (
//                   //   <Link
//                   //     key={state}
//                   //     href={`/states/${state.toLowerCase()}`}
//                   //     className="block p-2 hover:bg-gray-600"
//                   //   >
//                   //     {state}
//                   //   </Link>
//                   // ))
//                   states.map((state, index) => (
//                     <Link
//                       key={index}
//                       href={`/states/${String(state).toLowerCase()}`}
//                       className="block p-2 hover:bg-gray-600"
//                     >
//                       {String(state)}
//                     </Link>
//                   ))
//                 )}
//               </div>
//             )} */}
//           </div>

//           <Link
//             href="/list-of-fieldcoordinators"
//             className="block p-3 hover:bg-gray-700"
//           >
//             Field Coordinators
//           </Link>
//           <Link href="/questions" className="block p-3 hover:bg-gray-700">
//             Survey Questions
//           </Link>
//         </nav>
//       </aside>

//       {/* Overlay to close sidebar on mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { fetchTotalStates } from "@/services/apiService";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [states, setStates] = useState<string[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

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
            {/* {isDropdownOpen && (
              <div className="pl-5">
                {["Lagos", "Kano", "Rivers", "Ogun", "Kaduna"].map((state) => (
                  <Link
                    key={state}
                    href={/states/${state.toLowerCase()}}
                    className="block p-2 hover:bg-gray-600"
                  >
                    {state}
                  </Link>
                ))}
              </div>
            )} */}
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

                {/* {states.length === 0 ? (
                  <p className="text-gray-400 p-2">Loading...</p>
                ) : (
                  states.map((state, index) => (
                    <Link
                      key={index}
                      href={`/states/${encodeURIComponent(
                        state.toLowerCase()
                      )}`}
                      className="block p-2 hover:bg-gray-600"
                    >
                      {state}
                    </Link>
                  ))
                )} */}
              </div>
            )}
          </div>

          {/* <Link
            href="/list-of-fieldcoordinators"
            className="block p-3 hover:bg-gray-700"
          >
            Field Coordinators
          </Link>
          <Link href="/questions" className="block p-3 hover:bg-gray-700">
            Survey Questions
          </Link> */}
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
