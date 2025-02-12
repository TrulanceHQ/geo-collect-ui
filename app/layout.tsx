// import Sidebar from "@/components/Sidebar";
// import "../styles/globals.css";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="flex">
//         <Sidebar />
//         <main className="ml-64 p-5 w-full">{children}</main>
//       </body>
//     </html>
//   );
// }

import Sidebar from "@/components/Sidebar";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-5 md:ml-64">{children}</main>
      </body>
    </html>
  );
}
