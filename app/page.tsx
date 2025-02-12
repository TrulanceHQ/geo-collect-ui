// "use client";
// import { FaEdit } from "react-icons/fa"; // Import edit icon
// import Image from "next/image";

// export default function DashboardPage() {
//   return (
//     <div className="p-6">
//       {/* Profile Section */}
//       <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
//         {/* Profile Image */}
//         <Image
//           src="/profile.jpg" // Replace with actual image URL
//           alt="Profile Picture"
//           width={80}
//           height={80}
//           className="rounded-full border"
//         />

//         {/* Profile Info */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold">John Doe</h2>
//           <p className="text-gray-600">johndoe@example.com</p>
//           <p className="text-gray-600">+123 456 7890</p>
//         </div>

//         {/* Edit Icon */}
//         <button className="text-blue-500 hover:text-blue-700">
//           <FaEdit size={20} />
//         </button>
//       </div>

//       {/* Metrics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         {/* Total Sales Card */}
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h3 className="text-lg font-semibold">Total Sales</h3>
//           <p className="text-2xl font-bold">₦1,150,000</p>
//         </div>

//         {/* Total Commission Card */}
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h3 className="text-lg font-semibold">Total Commission</h3>
//           <p className="text-2xl font-bold">₦500,000</p>
//         </div>

//         {/* Total Enumerators Card */}
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <h3 className="text-lg font-semibold">Total Enumerators</h3>
//           <p className="text-2xl font-bold">24</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { FaEdit } from "react-icons/fa"; // Import edit icon
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
        {/* Profile Image */}
        <Image
          src="/profile.jpg" // Replace with actual image URL
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full border"
        />

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-600">johndoe@example.com</p>
          <p className="text-gray-600">+123 456 7890</p>
        </div>

        {/* Edit Icon */}
        <button className="text-blue-500 hover:text-blue-700">
          <FaEdit size={20} />
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Total Sales Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Data</h3>
          <p className="text-2xl font-bold">₦1,150,000</p>
        </div>

        {/* Total Commission Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total States</h3>
          <p className="text-2xl font-bold">₦500,000</p>
        </div>

        {/* Total Enumerators Card */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Enumerators</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>
    </div>
  );
}
