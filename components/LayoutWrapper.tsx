"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Prevents hydration errors
  }, []);

  if (!isMounted) return <div />; // Ensures hydration consistency

  // Define pages where the sidebar should be hidden
  const hideSidebarOn = ["/", "/enumerators-flow", "/field-coordinators-flow"]; // Add enumerator page

  const isAuthOrEnumeratororFieldCoord = hideSidebarOn.includes(pathname);

  return (
    <div className="flex flex-col md:flex-row">
      {!isAuthOrEnumeratororFieldCoord && <Sidebar />}
      <main
        className={`flex-1 p-5 ${
          !isAuthOrEnumeratororFieldCoord
            ? "md:ml-64"
            : "flex items-center justify-center min-h-screen bg-gray-100"
        }`}
      >
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}
