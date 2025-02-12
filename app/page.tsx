// // "use client";

// // import { useState } from "react";

// // export default function SignInPage() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("enumerator");
// //   const [rememberMe, setRememberMe] = useState(false);

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
// //         <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

// //         {/* Email Input */}
// //         <label className="block mb-2 font-medium">Email:</label>
// //         <input
// //           type="email"
// //           className="w-full p-2 border rounded-md mb-4"
// //           placeholder="Enter your email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         {/* Password Input */}
// //         <label className="block mb-2 font-medium">Password:</label>
// //         <input
// //           type="password"
// //           className="w-full p-2 border rounded-md mb-4"
// //           placeholder="Enter your password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         {/* Role Selection */}
// //         <label className="block mb-2 font-medium">Sign in as:</label>
// //         <select
// //           className="w-full p-2 border rounded-md mb-4"
// //           value={role}
// //           onChange={(e) => setRole(e.target.value)}
// //         >
// //           <option value="admin">Admin</option>
// //           <option value="enumerator">Enumerator</option>
// //         </select>

// //         {/* Remember Me Checkbox */}
// //         <div className="flex items-center mb-4">
// //           <input
// //             type="checkbox"
// //             className="mr-2"
// //             checked={rememberMe}
// //             onChange={() => setRememberMe(!rememberMe)}
// //           />
// //           <label className="text-sm">Remember Me</label>
// //         </div>

// //         {/* Sign In Button */}
// //         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
// //           Sign In
// //         </button>

// //         {/* Forgot Password */}
// //         <p className="text-center text-sm text-gray-600 mt-4">
// //           Forgot password? <a href="#" className="text-blue-500">Reset here</a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";

// export default function SignInPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("enumerator");
//   const [rememberMe, setRememberMe] = useState(false);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

//         {/* Email Input */}
//         <label className="block mb-2 font-medium">Email:</label>
//         <input
//           type="email"
//           className="w-full p-2 border rounded-md mb-4"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* Password Input */}
//         <label className="block mb-2 font-medium">Password:</label>
//         <input
//           type="password"
//           className="w-full p-2 border rounded-md mb-4"
//           placeholder="Enter your password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* Role Selection */}
//         <label className="block mb-2 font-medium">Sign in as:</label>
//         <select
//           className="w-full p-2 border rounded-md mb-4"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="admin">Admin</option>
//           <option value="enumerator">Enumerator</option>
//         </select>

//         {/* Remember Me Checkbox */}
//         <div className="flex items-center mb-4">
//           <input
//             type="checkbox"
//             className="mr-2"
//             checked={rememberMe}
//             onChange={() => setRememberMe(!rememberMe)}
//           />
//           <label className="text-sm">Remember Me</label>
//         </div>

//         {/* Sign In Button */}
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//           Sign In
//         </button>

//         {/* Forgot Password */}
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Forgot password? <a href="#" className="text-blue-500">Reset here</a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("enumerator");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

      {/* Email */}
      <label className="block mb-2 font-medium">Email:</label>
      <input
        type="email"
        className="w-full p-2 border rounded-md mb-4"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <label className="block mb-2 font-medium">Password:</label>
      <input
        type="password"
        className="w-full p-2 border rounded-md mb-4"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Role Selection */}
      <label className="block mb-2 font-medium">Sign in as:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="enumerator">Enumerator</option>
      </select>

      {/* Remember Me */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <label className="text-sm">Remember Me</label>
      </div>

      {/* Sign In Button */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Sign In
      </button>

      {/* Forgot Password */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Forgot password? <a href="#" className="text-blue-500">Reset here</a>
      </p>
    </div>
  );
}
