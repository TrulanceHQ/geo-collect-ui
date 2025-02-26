// // "use client";
// // import { useEffect, useState } from "react";
// // import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";

// // interface SurveyResponse {
// //   enumeratorId: string;
// //   responses: { questionId: string; answer: string }[];
// //   location: string;
// //   mediaUrl: string;
// //   submittedAt: string;
// // }

// // const SurveyResponsesPage: React.FC = () => {
// //   const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const data = await fetchAllSurveyResponsesByAdmin();
// //       setSurveyResponses(data);
// //     };
// //     fetchData();
// //   }, []);

// //   return (
// //     <div>
// //       <div className="h-screen flex flex-col">
// //         <h1>Survey Responses</h1>
// //         <div className="flex-1">
// //           <div
// //             className="table-container"
// //             style={{
// //               maxHeight: "80vh" /* Adjust max height as needed */,
// //               overflowY: "auto" /* Enable vertical scrolling */,
// //               overflowX: "auto" /* Enable horizontal scrolling */,
// //             }}
// //           >
// //             <table className="table-auto w-full border-collapse responsive">
// //               <thead className="bg-gray-200 sticky top-0">
// //                 <tr>
// //                   <th className="py-2">Enumerator ID</th>
// //                   <th className="py-2">Location</th>
// //                   <th className="py-2">Media URL</th>
// //                   <th className="py-2">Submitted At</th>
// //                   {/* <th className="py-2">Responses</th> */}
// //                   {surveyResponses[0]?.responses.map((response, index) => (
// //                     <>
// //                       <th className="py-2" key={`question-${index}`}>
// //                         Question {index + 1} Id
// //                       </th>
// //                       <th className="py-2" key={`response-${index}`}>
// //                         Question {index + 1} Responses
// //                       </th>
// //                     </>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {surveyResponses.map((surveyResponse, index) => (
// //                   <tr key={`${surveyResponse.enumeratorId}-${index}`}>
// //                     <td className="border px-4 py-2">
// //                       {surveyResponse.enumeratorId}
// //                     </td>
// //                     <td className="border px-4 py-2">
// //                       {surveyResponse.location}
// //                     </td>
// //                     <td className="border px-4 py-2">
// //                       <a
// //                         href={surveyResponse.mediaUrl}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         style={{ textDecoration: "underline", color: "black" }}
// //                       >
// //                         {surveyResponse.mediaUrl}
// //                       </a>
// //                     </td>

// //                     <td className="border px-4 py-2">
// //                       {new Date(surveyResponse.submittedAt).toLocaleString()}
// //                     </td>
// //                     {surveyResponse.responses.map((response, responseIndex) => (
// //                       <>
// //                         <td
// //                           className="border px-4 py-2"
// //                           key={`questionId-${index}-${responseIndex}`}
// //                         >
// //                           {response.questionId}
// //                         </td>
// //                         <td
// //                           className="border px-4 py-2"
// //                           key={`answer-${index}-${responseIndex}`}
// //                         >
// //                           {Array.isArray(response.answer)
// //                             ? response.answer.join(", ")
// //                             : response.answer}
// //                         </td>
// //                       </>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SurveyResponsesPage;

// "use client";
// import { useEffect, useState } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";

// interface SurveyResponse {
//   enumeratorId: string;
//   responses: { questionId: string; answer: string }[];
//   location: string;
//   mediaUrl: string;
//   submittedAt: string;
// }

// const SurveyResponsesPage: React.FC = () => {
//   const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await fetchAllSurveyResponsesByAdmin();
//       setSurveyResponses(data);
//     };
//     fetchData();
//   }, []);

//   const getMaxResponsesLength = () => {
//     return Math.max(...surveyResponses.map((sr) => sr.responses.length));
//   };

//   return (
//     <div>
//       <div className="h-screen flex flex-col">
//         <h1>Survey Responses</h1>
//         <div className="flex-1">
//           <div
//             className="table-container"
//             style={{
//               maxHeight: "80vh" /* Adjust max height as needed */,
//               overflowY: "auto" /* Enable vertical scrolling */,
//               overflowX: "auto" /* Enable horizontal scrolling */,
//             }}
//           >
//             <table className="table-auto w-full border-collapse responsive">
//               <thead className="bg-gray-200 sticky top-0">
//                 <tr>
//                   <th className="py-2">Enumerator ID</th>
//                   <th className="py-2">Location</th>
//                   <th className="py-2">Media URL</th>
//                   <th className="py-2">Submitted At</th>
//                   {Array.from({ length: getMaxResponsesLength() }).map(
//                     (_, index) => (
//                       <>
//                         <th className="py-2" key={`question-${index}`}>
//                           Question {index + 1} Id
//                         </th>
//                         <th className="py-2" key={`response-${index}`}>
//                           Question {index + 1} Response
//                         </th>
//                       </>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {surveyResponses.map((surveyResponse, index) => (
//                   <tr key={`${surveyResponse.enumeratorId}-${index}`}>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.enumeratorId}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.location}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.mediaUrl ? (
//                         <a
//                           href={surveyResponse.mediaUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           style={{
//                             textDecoration: "underline",
//                             color: "black",
//                           }}
//                         >
//                           {surveyResponse.mediaUrl}
//                         </a>
//                       ) : (
//                         ""
//                       )}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.submittedAt
//                         ? new Date(surveyResponse.submittedAt).toLocaleString()
//                         : ""}
//                     </td>
//                     {Array.from({ length: getMaxResponsesLength() }).map(
//                       (_, responseIndex) => (
//                         <>
//                           <td
//                             className="border px-4 py-2"
//                             key={`questionId-${index}-${responseIndex}`}
//                           >
//                             {surveyResponse.responses[responseIndex]
//                               ?.questionId || ""}
//                           </td>
//                           <td
//                             className="border px-4 py-2"
//                             key={`answer-${index}-${responseIndex}`}
//                           >
//                             {surveyResponse.responses[responseIndex]?.answer
//                               ? Array.isArray(
//                                   surveyResponse.responses[responseIndex].answer
//                                 )
//                                 ? surveyResponse.responses[
//                                     responseIndex
//                                   ].answer.join(", ")
//                                 : surveyResponse.responses[responseIndex].answer
//                               : ""}
//                           </td>
//                         </>
//                       )
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SurveyResponsesPage;

"use client";
import { useEffect, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface SurveyResponse {
  enumeratorId: string;
  responses: { questionId: string; answer: string }[];
  location: string;
  mediaUrl: string;
  submittedAt: string;
}

const SurveyResponsesPage: React.FC = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllSurveyResponsesByAdmin();
      setSurveyResponses(data);
    };
    fetchData();
  }, []);

  const getMaxResponsesLength = () => {
    return Math.max(...surveyResponses.map((sr) => sr.responses.length), 0);
  };

  const prepareDataForExport = () => {
    return surveyResponses.map((surveyResponse) => {
      const baseData: any = {
        "Enumerator ID": surveyResponse.enumeratorId,
        Location: surveyResponse.location,
        "Media URL": surveyResponse.mediaUrl,
        "Submitted At": surveyResponse.submittedAt
          ? new Date(surveyResponse.submittedAt).toLocaleString()
          : "",
      };

      surveyResponse.responses.forEach((resp, index) => {
        baseData[`Question ${index + 1} ID`] = resp.questionId;
        baseData[`Question ${index + 1} Response`] = Array.isArray(resp.answer)
          ? resp.answer.join(", ")
          : resp.answer;
      });

      return baseData;
    });
  };

  const downloadCSV = () => {
    const csvData = Papa.unparse(prepareDataForExport());
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "survey_responses.csv");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prepareDataForExport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "survey_responses.xlsx");
  };

  return (
    <div>
      <div className="h-screen flex flex-col">
        <h1>Survey Responses</h1>

        <div className="mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        </div>

        <div className="flex-1">
          <div
            className="table-container"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <table className="table-auto w-full border-collapse responsive">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="py-2">Enumerator ID</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Media URL</th>
                  <th className="py-2">Submitted At</th>
                  {Array.from({ length: getMaxResponsesLength() }).map(
                    (_, index) => (
                      <>
                        <th className="py-2" key={`question-${index}`}>
                          Question {index + 1} ID
                        </th>
                        <th className="py-2" key={`response-${index}`}>
                          Question {index + 1} Response
                        </th>
                      </>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {surveyResponses.map((surveyResponse, index) => (
                  <tr key={`${surveyResponse.enumeratorId}-${index}`}>
                    <td className="border px-4 py-2">
                      {surveyResponse.enumeratorId}
                    </td>
                    <td className="border px-4 py-2">
                      {surveyResponse.location}
                    </td>
                    <td className="border px-4 py-2">
                      {surveyResponse.mediaUrl ? (
                        <a
                          href={surveyResponse.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {surveyResponse.mediaUrl}
                        </a>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {surveyResponse.submittedAt
                        ? new Date(surveyResponse.submittedAt).toLocaleString()
                        : ""}
                    </td>
                    {Array.from({ length: getMaxResponsesLength() }).map(
                      (_, responseIndex) => (
                        <>
                          <td
                            className="border px-4 py-2"
                            key={`questionId-${index}-${responseIndex}`}
                          >
                            {surveyResponse.responses[responseIndex]
                              ?.questionId || ""}
                          </td>
                          <td
                            className="border px-4 py-2"
                            key={`answer-${index}-${responseIndex}`}
                          >
                            {surveyResponse.responses[responseIndex]?.answer
                              ? Array.isArray(
                                  surveyResponse.responses[responseIndex].answer
                                )
                                ? surveyResponse.responses[
                                    responseIndex
                                  ].answer.join(", ")
                                : surveyResponse.responses[responseIndex].answer
                              : ""}
                          </td>
                        </>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsesPage;
