// "use client"; // ✅ Forces client-side rendering

// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function SignInPage() {
//   const [showLogo, setShowLogo] = useState(false);
//   // const [timestamp, setTimestamp] = useState("");

//   useEffect(() => {
//     setShowLogo(true); // ✅ Ensures the logo appears AFTER hydration
//     // setTimestamp(new Date().toLocaleString()); // ✅ Fix dynamic value
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       {showLogo && (
//         <div className="mb-6">
//           <Image src="/digiplus.png" alt="Company Logo" width={150} height={150} priority />
//         </div>
//       )}

//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

//         {/* Email */}
//         <label className="block mb-2 font-medium">Email:</label>
//         <input type="email" className="w-full p-2 border rounded-md mb-4" placeholder="Enter your email" />

//         {/* Password */}
//         <label className="block mb-2 font-medium">Password:</label>
//         <input type="password" className="w-full p-2 border rounded-md mb-4" placeholder="Enter your password" />

//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//           Sign In
//         </button>
//       </div>
//     </div>
//   );
// }

"use client"; // ✅ Forces client-side rendering

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [isClient, setIsClient] = useState(false); // Track hydration

  useEffect(() => {
    setIsClient(true); // ✅ Ensures consistency between SSR and client
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Logo - Rendered consistently on both SSR and client */}
      <div className="mb-6">
        {isClient ? (
          <Image
            src="/digiplus.png"
            alt="Company Logo"
            width={150}
            height={150}
            priority
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-gray-300 animate-pulse rounded-md"></div> // Placeholder to prevent layout shift
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        {/* Email */}
        <label className="block mb-2 font-medium">Email:</label>
        <input
          type="email"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Enter your email"
        />

        {/* Password */}
        <label className="block mb-2 font-medium">Password:</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Enter your password"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Sign In
        </button>
      </div>
    </div>
  );
}
