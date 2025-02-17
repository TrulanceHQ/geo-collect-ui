// "use client";
// import { useState } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SurveyForm from "@/components/Survey";
// // import Image from "next/image";

// export default function FieldCoordinatorsDashboard() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("enumerator");
//   const [isSurveyOpen, setIsSurveyOpen] = useState(false);

//   return (
//     <div className="p-6">
//       {/* Profile Section */}
//       <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
//         {/* Profile Info */}
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-xl font-semibold">Jane Doe</h2>
//           <p className="text-gray-600">janedoe@example.com</p>
//           <p className="text-gray-600">+234 123 4567</p>
//         </div>
//       </div>

//       {/* Metrics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Surveys Completed</h3>
//           <p className="text-2xl font-bold">3</p>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Total Enumerators</h3>
//           <p className="text-2xl font-bold">5</p>
//         </div>
//       </div>

//       {/* Start Survey Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//         {/* <h2 className="text-xl font-semibold">Add Enumerator</h2> */}
//         {/* <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
//           onClick={() => setIsSurveyOpen(true)}
//         >
//           <FaPlayCircle />
//           <span>Add Enumerator</span>
//         </button> */}
//          <button
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
//           onClick={() => setIsFormOpen(true)}
//         >
//           + Add Enumerator
//         </button>
//       </div>

//   {/* Sign-up Form (Modal) */}
//   {isFormOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Add Enumerator</h2>

//             {/* Email Input */}
//             <label className="block mb-2 font-medium">Email:</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-md mb-4"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {/* Role Selection */}
//             <label className="block mb-2 font-medium">Role:</label>
//             <select
//               className="w-full p-2 border rounded-md mb-4"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="enumerator">Enumerator</option>
//             </select>

//             {/* Buttons */}
//             <div className="flex justify-between">
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setIsFormOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* View Data Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold">View Collected Data</h2>
//         <p className="text-gray-600">See all the data your enumerators have gathered from surveys.</p>
//         <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">View Data</button>
//       </div>

//             {/* Survey Modal */}
//       {isSurveyOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 ">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh]  relative ">
//             <button
//               className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-5xl"
//               onClick={() => setIsSurveyOpen(false)}
//             >
//               &times;
//             </button>
//             <SurveyForm />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SurveyForm from "@/components/Survey";

// export default function FieldCoordinatorsDashboard() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("enumerator");
//   const [isSurveyOpen, setIsSurveyOpen] = useState(false);
//   const [isDataVisible, setIsDataVisible] = useState(false);
//   const [isClient, setIsClient] = useState(false); // Track hydration

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Sample survey data
//   const surveyData = [
//     { id: 1, enumerator: "John Doe", date: "2024-02-10", location: "Lagos", responses: 15 },
//     { id: 2, enumerator: "Jane Doe", date: "2024-02-11", location: "Abuja", responses: 10 },
//     { id: 3, enumerator: "Mark Smith", date: "2024-02-12", location: "Kano", responses: 20 },
//   ];

//   // Ensure the component only renders on the client
//   if (!isClient) return null;

//   return (
//     <div className="p-6">
//       {/* Profile Section */}
//       <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-xl font-semibold">Jane Doe</h2>
//           <p className="text-gray-600">janedoe@example.com</p>
//           <p className="text-gray-600">+234 123 4567</p>
//         </div>
//       </div>

//       {/* Metrics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Surveys Completed</h3>
//           <p className="text-2xl font-bold">3</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Total Enumerators</h3>
//           <p className="text-2xl font-bold">5</p>
//         </div>
//       </div>

//       {/* Add Enumerator Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto" onClick={() => setIsFormOpen(true)}>
//           + Add Enumerator
//         </button>
//       </div>

//       {/* Sign-up Form (Modal) */}
//       {isFormOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Add Enumerator</h2>
//             <label className="block mb-2 font-medium">Email:</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-md mb-4"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label className="block mb-2 font-medium">Role:</label>
//             <select className="w-full p-2 border rounded-md mb-4" value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="enumerator">Enumerator</option>
//             </select>
//             <div className="flex justify-between">
//               <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsFormOpen(false)}>
//                 Cancel
//               </button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Data Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold">View Collected Data</h2>
//         <p className="text-gray-600">See all the data your enumerators have gathered from surveys.</p>
//         <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={() => setIsDataVisible(!isDataVisible)}>
//           {isDataVisible ? "Hide Data" : "View Data"}
//         </button>
//       </div>

//       {/* Data Table (Appears when "View Data" is clicked) */}
//       {isDataVisible && (
//         <div className="mt-6 bg-white shadow-md rounded-lg p-6 overflow-x-auto">
//           <h2 className="text-lg font-semibold mb-4">Collected Survey Data</h2>
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="p-3 text-left border">ID</th>
//                 <th className="p-3 text-left border">Enumerator</th>
//                 <th className="p-3 text-left border">Date</th>
//                 <th className="p-3 text-left border">Location</th>
//                 <th className="p-3 text-left border">Responses</th>
//               </tr>
//             </thead>
//             <tbody>
//               {surveyData.map((data) => (
//                 <tr key={data.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 border">{data.id}</td>
//                   <td className="p-3 border">{data.enumerator}</td>
//                   <td className="p-3 border">{data.date}</td>
//                   <td className="p-3 border">{data.location}</td>
//                   <td className="p-3 border">{data.responses}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Survey Modal */}
//       {isSurveyOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] relative">
//             <button className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-5xl" onClick={() => setIsSurveyOpen(false)}>
//               &times;
//             </button>
//             <SurveyForm />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SurveyForm from "@/components/Survey";
// import Image from "next/image";

// export default function FieldCoordinatorsDashboard() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("enumerator");
//   const [isSurveyOpen, setIsSurveyOpen] = useState(false);
//   const [isDataVisible, setIsDataVisible] = useState(false);
//   const [isClient, setIsClient] = useState(false); // Track hydration

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const surveyData = [
//     {
//       id: 1,
//       enumerator: "John Doe",
//       date: "2024-02-10",
//       location: "Lagos",
//       responses: 15,
//     },
//     {
//       id: 2,
//       enumerator: "Jane Doe",
//       date: "2024-02-11",
//       location: "Abuja",
//       responses: 10,
//     },
//     {
//       id: 3,
//       enumerator: "Mark Smith",
//       date: "2024-02-12",
//       location: "Kano",
//       responses: 20,
//     },
//   ];

//   if (!isClient) return null;

//   return (
//     <div className="relative p-6">
//       {/* Logo at the top right */}
//       <div className="absolute top-4 right-6">
//         <Image
//           src="/digiplus.png"
//           alt="Company Logo"
//           width={120}
//           height={50}
//           priority
//         />
//       </div>

//       {/* Profile Section */}
//       <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
//         <div className="flex-1 text-center md:text-left">
//           <h2 className="text-xl font-semibold">Jane Doe</h2>
//           <p className="text-gray-600">janedoe@example.com</p>
//           <p className="text-gray-600">+234 123 4567</p>
//         </div>
//       </div>

//       {/* Metrics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Surveys Completed</h3>
//           <p className="text-2xl font-bold">3</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Total Enumerators</h3>
//           <p className="text-2xl font-bold">5</p>
//         </div>
//       </div>

//       {/* Add Enumerator Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
//           onClick={() => setIsFormOpen(true)}
//         >
//           + Add Enumerator
//         </button>
//       </div>

//       {/* Sign-up Form (Modal) */}
//       {isFormOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Add Enumerator</h2>
//             <label className="block mb-2 font-medium">Email:</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-md mb-4"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label className="block mb-2 font-medium">Role:</label>
//             <select
//               className="w-full p-2 border rounded-md mb-4"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="enumerator">Enumerator</option>
//             </select>
//             <div className="flex justify-between">
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={() => setIsFormOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded">
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Data Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold">View Collected Data</h2>
//         <p className="text-gray-600">
//           See all the data your enumerators have gathered from surveys.
//         </p>
//         <button
//           className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
//           onClick={() => setIsDataVisible(!isDataVisible)}
//         >
//           {isDataVisible ? "Hide Data" : "View Data"}
//         </button>
//       </div>

//       {/* Data Table */}
//       {isDataVisible && (
//         <div className="mt-6 bg-white shadow-md rounded-lg p-6 overflow-x-auto">
//           <h2 className="text-lg font-semibold mb-4">Collected Survey Data</h2>
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="p-3 text-left border">ID</th>
//                 <th className="p-3 text-left border">Enumerator</th>
//                 <th className="p-3 text-left border">Date</th>
//                 <th className="p-3 text-left border">Location</th>
//                 <th className="p-3 text-left border">Responses</th>
//               </tr>
//             </thead>
//             <tbody>
//               {surveyData.map((data) => (
//                 <tr key={data.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 border">{data.id}</td>
//                   <td className="p-3 border">{data.enumerator}</td>
//                   <td className="p-3 border">{data.date}</td>
//                   <td className="p-3 border">{data.location}</td>
//                   <td className="p-3 border">{data.responses}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Survey Modal */}
//       {isSurveyOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] relative">
//             <button
//               className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-5xl"
//               onClick={() => setIsSurveyOpen(false)}
//             >
//               &times;
//             </button>
//             <SurveyForm />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ProtectedPage from "@/components/ProtectedPage";

// Dynamically import SurveyForm to avoid hydration errors
const SurveyForm = dynamic(() => import("@/components/Survey"), {
  ssr: false, // Prevents SSR, ensuring it only loads on the client
});

export default function FieldCoordinatorsDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("enumerator");
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const surveyData = [
    {
      id: 1,
      enumerator: "John Doe",
      date: "2024-02-10",
      location: "Lagos",
      responses: 15,
    },
    {
      id: 2,
      enumerator: "Jane Doe",
      date: "2024-02-11",
      location: "Abuja",
      responses: 10,
    },
    {
      id: 3,
      enumerator: "Mark Smith",
      date: "2024-02-12",
      location: "Kano",
      responses: 20,
    },
  ];

  return (
    <ProtectedPage allowedRoles={["fieldCoordinator"]} redirectPath="/">
      <div className="relative p-6">
        <h1 style={{ fontSize: "1.4rem" }}>
          <b>Field Coordinator</b>
        </h1>
        {/* Logo at the top right */}
        <div className="absolute top-4 right-6">
          <Image
            src="/digiplus.png"
            alt="Company Logo"
            width={120}
            height={50}
            priority
          />
        </div>

        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold">Jane Doe</h2>
            <p className="text-gray-600">janedoe@example.com</p>
            <p className="text-gray-600">+234 123 4567</p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Surveys Completed</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Enumerators</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>

        {/* Add Enumerator Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={() => setIsFormOpen(true)}
          >
            + Add Enumerator
          </button>
        </div>

        {/* Sign-up Form (Modal) */}
        {isClient && isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add Enumerator</h2>
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="block mb-2 font-medium">Role:</label>
              <select
                className="w-full p-2 border rounded-md mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="enumerator">Enumerator</option>
              </select>
              <div className="flex justify-between">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Data Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">View Collected Data</h2>
          <p className="text-gray-600">
            See all the data your enumerators have gathered from surveys.
          </p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsDataVisible(!isDataVisible)}
          >
            {isDataVisible ? "Hide Data" : "View Data"}
          </button>
        </div>

        {/* Data Table */}
        {isDataVisible && isClient && (
          <div className="mt-6 bg-white shadow-md rounded-lg p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">
              Collected Survey Data
            </h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left border">ID</th>
                  <th className="p-3 text-left border">Enumerator</th>
                  <th className="p-3 text-left border">Date</th>
                  <th className="p-3 text-left border">Location</th>
                  <th className="p-3 text-left border">Responses</th>
                </tr>
              </thead>
              <tbody>
                {surveyData.map((data) => (
                  <tr key={data.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">{data.id}</td>
                    <td className="p-3 border">{data.enumerator}</td>
                    <td className="p-3 border">{data.date}</td>
                    <td className="p-3 border">{data.location}</td>
                    <td className="p-3 border">{data.responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Survey Modal */}
        {isSurveyOpen && isClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] relative">
              <button
                className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-5xl"
                onClick={() => setIsSurveyOpen(false)}
              >
                &times;
              </button>
              <SurveyForm />
            </div>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
