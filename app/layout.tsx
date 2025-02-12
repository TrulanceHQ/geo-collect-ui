
// import Sidebar from "@/components/Sidebar";
// import "../styles/globals.css";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col md:flex-row">
//         <Sidebar />
//         <main className="flex-1 p-5 md:ml-64">{children}</main>
//       </body>
//     </html>
//   );
// }


// import "../styles/globals.css";
// import LayoutWrapper from "@/components/LayoutWrapper";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <LayoutWrapper>{children}</LayoutWrapper>
//       </body>
//     </html>
//   );
// }

// import "../styles/globals.css";
// import LayoutWrapper from "@/components/LayoutWrapper";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <LayoutWrapper>{children}</LayoutWrapper>
//       </body>
//     </html>
//   );
// }

import "../styles/globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
