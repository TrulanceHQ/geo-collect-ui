// "use client";
// import { useState } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SurveyForm from "@/components/Survey";
// // import Image from "next/image";

// export default function EnumeratorDashboard() {
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
//           <p className="text-2xl font-bold">15</p>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Pending Surveys</h3>
//           <p className="text-2xl font-bold">3</p>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Total Responses</h3>
//           <p className="text-2xl font-bold">540</p>
//         </div>
//       </div>

//       {/* Start Survey Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//         <h2 className="text-xl font-semibold">Start a New Survey</h2>
//         <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
//           onClick={() => setIsSurveyOpen(true)}
//         >
//           <FaPlayCircle />
//           <span>Start Survey</span>
//         </button>
//       </div>

//       {/* View Data Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold">View Collected Data</h2>
//         <p className="text-gray-600">See all the data you&apos;ve gathered from your surveys.</p>
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

// import { useState } from "react";
// import { FaPlayCircle } from "react-icons/fa";
// import SurveyForm from "@/components/Survey";
// import Image from "next/image";

// export default function EnumeratorDashboard() {
//   const [isSurveyOpen, setIsSurveyOpen] = useState(false);

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
//           <p className="text-2xl font-bold">15</p>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Pending Surveys</h3>
//           <p className="text-2xl font-bold">3</p>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-4 text-center">
//           <h3 className="text-lg font-semibold">Total Responses</h3>
//           <p className="text-2xl font-bold">540</p>
//         </div>
//       </div>

//       {/* Start Survey Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//         <h2 className="text-xl font-semibold">Start a New Survey</h2>
//         <button
//           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
//           onClick={() => setIsSurveyOpen(true)}
//         >
//           <FaPlayCircle />
//           <span>Start Survey</span>
//         </button>
//       </div>

//       {/* View Data Section */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold">View Collected Data</h2>
//         <p className="text-gray-600">
//           See all the data you&apos;ve gathered from your surveys.
//         </p>
//         <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
//           View Data
//         </button>
//       </div>

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
import { FaPlayCircle } from "react-icons/fa";
import SurveyForm from "@/components/Survey";
import Image from "next/image";

export default function EnumeratorDashboard() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures it only renders on the client
  }, []);

  if (!isClient) {
    return null; // Prevents server-side mismatch
  }

  return (
    <div className="relative p-6">
      <h1 style={{ fontSize: "1.4rem" }}>
        <b>Enumerator</b>
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
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Pending Surveys</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Responses</h3>
          <p className="text-2xl font-bold">540</p>
        </div>
      </div>

      {/* Start Survey Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-semibold">Start a New Survey</h2>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
          onClick={() => setIsSurveyOpen(true)}
        >
          <FaPlayCircle />
          <span>Start Survey</span>
        </button>
      </div>

      {/* View Data Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold">View Collected Data</h2>
        <p className="text-gray-600">
          See all the data you&apos;ve gathered from your surveys.
        </p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          View Data
        </button>
      </div>

      {/* Survey Modal */}
      {isSurveyOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] relative">
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-5xl"
              onClick={() => setIsSurveyOpen(false)} // Close modal properly
            >
              &times;
            </button>
            <SurveyForm isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
          </div>
        </div>
      )}

    </div>
  );
}
