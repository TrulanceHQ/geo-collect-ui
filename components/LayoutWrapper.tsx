// "use client";

// import { usePathname } from "next/navigation";
// import Sidebar from "@/components/Sidebar";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname(); // Get current route
//   const isAuthPage = pathname === "/signin"; // Hide sidebar on sign-in page

//   return (
//     <div className="flex flex-col md:flex-row">
//       {!isAuthPage && <Sidebar />}
//       <main className={`flex-1 p-5 ${!isAuthPage ? "md:ml-64" : "flex items-center justify-center min-h-screen bg-gray-100"}`}>
//         {children}
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Sidebar from "@/components/Sidebar";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname(); // Get current route
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true); // Prevents hydration error
//   }, []);

//   // Hide sidebar only on /signin AFTER client-side check
//   const isAuthPage = isClient && pathname === "/signin";

//   return (
//     <div className="flex flex-col md:flex-row">
//       {!isAuthPage && <Sidebar />}
//       <main className={`flex-1 p-5 ${!isAuthPage ? "md:ml-64" : "flex items-center justify-center min-h-screen bg-gray-100"}`}>
//         {children}
//       </main>
//     </div>
//   );
// }

// "use client";

// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import Sidebar from "@/components/Sidebar";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true); // Ensure we only render client-side
//   }, []);

//   if (!isMounted) return <div />; // Prevents hydration mismatch

//   const isAuthPage = pathname === "/signin"; // Hide sidebar on signin page

//   return (
//     <div className="flex flex-col md:flex-row">
//       {!isAuthPage && <Sidebar />}
//       <main className={`flex-1 p-5 ${!isAuthPage ? "md:ml-64" : "flex items-center justify-center min-h-screen bg-gray-100"}`}>
//         {children}
//       </main>
//     </div>
//   );
// }
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Prevents hydration errors
  }, []);

  if (!isMounted) return <div />; // Ensures hydration consistency

  // Define pages where the sidebar should be hidden
  const hideSidebarOn = ["/", "/enumerators-flow"]; // Add enumerator page

  const isAuthOrEnumeratorPage = hideSidebarOn.includes(pathname);

  return (
    <div className="flex flex-col md:flex-row">
      {!isAuthOrEnumeratorPage && <Sidebar />}
      <main className={`flex-1 p-5 ${!isAuthOrEnumeratorPage ? "md:ml-64" : "flex items-center justify-center min-h-screen bg-gray-100"}`}>
        {children}
      </main>
    </div>
  );
}
