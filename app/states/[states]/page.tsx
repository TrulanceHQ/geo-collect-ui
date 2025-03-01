"use client";
import { useParams } from "next/navigation";

export default function StatePage() {
  const { state } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Data for {state}</h1>
      <table className="w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Metric</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id}>
              <td className="border p-2">{id}</td>
              <td className="border p-2">Sample Name</td>
              <td className="border p-2">100</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// StatePage.tsx
// "use client";
// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
// import { SurveyResponse } from "@/services/apiService"; // Import the SurveyResponse type

// export default function StatePage() {
//   const { state } = useParams();
//   const [data, setData] = useState<SurveyResponse[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const selectedState = Array.isArray(state) ? state[0] : state;
//         const responses = await fetchAllSurveyResponsesByAdmin(selectedState);
//         setData(responses);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [state]);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">
//         Data for {Array.isArray(state) ? state[0] : state}
//       </h1>
//       <table className="w-full border-collapse border border-gray-200 mt-4">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Metric</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((response, index) => (
//             <tr key={index}>
//               <td className="border p-2">{response._id}</td>
//               <td className="border p-2">
//                 {response.enumeratorId.firstName}{" "}
//                 {response.enumeratorId.lastName}
//               </td>
//               <td className="border p-2">{response.metric}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
