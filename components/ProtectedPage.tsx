import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedPageProps {
  allowedRoles: string[]; // Array of roles that are allowed to access the page
  redirectPath: string; // Path to redirect if the user doesn't have the proper role
  children: React.ReactNode; // Content to display if the user has the right role
}

const ProtectedPage = ({
  allowedRoles,
  redirectPath,
  children,
}: ProtectedPageProps) => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); // Get the user role from localStorage

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.push(redirectPath); // Redirect to login or appropriate path if not authorized
    } else {
      setIsLoading(false); // Set loading to false when user role is valid
    }
  }, [allowedRoles, redirectPath, router]);

  // Prevent rendering anything until the role check is done
  if (isLoading) {
    return null; // Return nothing to avoid showing content briefly
  }

  return <div>{children}</div>; 
  // Render the protected content once role check passes
};

export default ProtectedPage;
