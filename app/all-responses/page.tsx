/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React from "react";
// import { useEffect, useState } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// interface SurveyResponse {
//   surveyId: {
//     _id: string;
//     title: string;
//     subtitle: string;
//   } | null; // Allow for null values
//   enumeratorId: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     fieldCoordinatorId: {
//       _id: string;
//       firstName: string;
//       lastName: string;
//       selectedState: string;
//     } | null; // Allow for null values
//   } | null; // Allow for null values
//   responses: {
//     question: string;
//     // question: { _id: string; question: string };
//     answer: string;
//   }[];
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
//     return Math.max(...surveyResponses.map((sr) => sr.responses.length), 0);
//   };

//   const prepareDataForExport = () => {
//     return surveyResponses.map((surveyResponse) => {
//       const baseData: any = {
//         "Survey Title": surveyResponse.surveyId?.title || "N/A",
//         "Survey Subtitle": surveyResponse.surveyId?.subtitle || "N/A",
//         "Enumerator Name": surveyResponse.enumeratorId
//           ? `${surveyResponse.enumeratorId.firstName} ${surveyResponse.enumeratorId.lastName}`
//           : "N/A",
//         "Field Coordinator Name": surveyResponse.enumeratorId
//           ?.fieldCoordinatorId
//           ? `${surveyResponse.enumeratorId.fieldCoordinatorId.firstName} ${surveyResponse.enumeratorId.fieldCoordinatorId.lastName}`
//           : "N/A",
//         "Field Coordinator State":
//           surveyResponse.enumeratorId?.fieldCoordinatorId?.selectedState ||
//           "N/A",
//         Location: surveyResponse.location,
//         "Media URL": surveyResponse.mediaUrl,
//         "Submitted At": surveyResponse.submittedAt
//           ? new Date(surveyResponse.submittedAt).toLocaleString()
//           : "",
//       };

//       // surveyResponse.responses.forEach((resp, index) => {
//       //   baseData[`Question ${index + 1}`] = resp.question.question;
//       //   baseData[`Question ${index + 1} Response`] = Array.isArray(resp.answer)
//       //     ? resp.answer.join(", ")
//       //     : resp.answer;
//       // });
//       surveyResponse.responses.forEach((resp, index) => {
//         baseData[`Question ${index + 1}`] = resp.question; // Now directly a string.
//         baseData[`Question ${index + 1} Response`] = Array.isArray(resp.answer)
//           ? resp.answer.join(", ")
//           : resp.answer;
//       });

//       return baseData;
//     });
//   };

//   const downloadCSV = () => {
//     const csvData = Papa.unparse(prepareDataForExport());
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "survey_responses.csv");
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(prepareDataForExport());
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, "survey_responses.xlsx");
//   };

//   return (
//     <div>
//       <div className="h-screen flex flex-col">
//         <h1>Survey Responses</h1>

//         <div className="mb-4">
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//             onClick={downloadCSV}
//           >
//             Download CSV
//           </button>
//           <button
//             className="px-4 py-2 bg-green-500 text-white rounded"
//             onClick={downloadExcel}
//           >
//             Download Excel
//           </button>
//         </div>

//         <div className="flex-1">
//           <div
//             className="table-container"
//             style={{
//               maxHeight: "80vh",
//               overflowY: "auto",
//               overflowX: "auto",
//             }}
//           >
//             <table className="table-auto w-full border-collapse responsive">
//               <thead className="bg-gray-200 sticky top-0">
//                 <tr>
//                   <th className="py-2">Survey Title</th>
//                   <th className="py-2">Survey Subtitle</th>
//                   <th className="py-2">Enumerator Name</th>
//                   <th className="py-2">Field Coordinator Name</th>
//                   <th className="py-2">Field Coordinator State</th>
//                   <th className="py-2">Location</th>
//                   <th className="py-2">Media URL</th>
//                   <th className="py-2">Submitted At</th>
//                   {Array.from({ length: getMaxResponsesLength() }).map(
//                     (_, index) => (
//                       <React.Fragment key={`question-${index}`}>
//                         <th className="py-2">Question {index + 1}</th>
//                         <th className="py-2">Question {index + 1} Response</th>
//                       </React.Fragment>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {surveyResponses.map((surveyResponse, index) => (
//                   <tr
//                     key={surveyResponse.enumeratorId?._id || `survey-${index}`}
//                   >
//                     <td className="border px-4 py-2">
//                       {surveyResponse.surveyId?.title || "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.surveyId?.subtitle || "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.enumeratorId
//                         ? `${surveyResponse.enumeratorId.firstName} ${surveyResponse.enumeratorId.lastName}`
//                         : "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.enumeratorId?.fieldCoordinatorId
//                         ? `${surveyResponse.enumeratorId.fieldCoordinatorId.firstName} ${surveyResponse.enumeratorId.fieldCoordinatorId.lastName}`
//                         : "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {surveyResponse.enumeratorId?.fieldCoordinatorId
//                         ? surveyResponse.enumeratorId.fieldCoordinatorId
//                             .selectedState
//                         : "N/A"}
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
//                         <React.Fragment
//                           key={`response-${index}-${responseIndex}`}
//                         >
//                           {/* <td className="border px-4 py-2">
//                             {surveyResponse.responses[responseIndex]?.question
//                               ?.question || ""}
//                           </td>
//                           <td className="border px-4 py-2">
//                             {surveyResponse.responses[responseIndex]?.answer
//                               ? Array.isArray(
//                                   surveyResponse.responses[responseIndex].answer
//                                 )
//                                 ? surveyResponse.responses[
//                                     responseIndex
//                                   ].answer.join(", ")
//                                 : surveyResponse.responses[responseIndex].answer
//                               : ""}
//                           </td> */}
//                           <td className="border px-4 py-2">
//                             {surveyResponse.responses[responseIndex]
//                               ?.question || ""}
//                           </td>
//                           <td className="border px-4 py-2">
//                             {surveyResponse.responses[responseIndex]?.answer ||
//                               ""}
//                           </td>
//                         </React.Fragment>
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
import React, { useEffect, useState, useMemo } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface SurveyResponse {
  surveyId: {
    _id: string;
    title: string;
    subtitle: string;
  } | null;
  enumeratorId: {
    _id: string;
    firstName: string;
    lastName: string;
    fieldCoordinatorId: {
      _id: string;
      firstName: string;
      lastName: string;
      selectedState: string;
    } | null;
  } | null;
  // Each response now has the question text as a string.
  responses: {
    question: string;
    answer: string;
  }[];
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

  // Get all unique question texts across responses for dynamic columns.
  const allQuestions = useMemo(() => {
    const questionSet = new Set<string>();
    surveyResponses.forEach((sr) => {
      sr.responses.forEach((resp) => {
        if (resp.question) {
          questionSet.add(resp.question);
        }
      });
    });
    return Array.from(questionSet);
  }, [surveyResponses]);

  // Prepare export data with each question as a column header.
  const prepareDataForExport = () => {
    return surveyResponses.map((surveyResponse) => {
      const baseData: any = {
        "Survey Title": surveyResponse.surveyId?.title || "N/A",
        "Survey Subtitle": surveyResponse.surveyId?.subtitle || "N/A",
        "Enumerator Name": surveyResponse.enumeratorId
          ? `${surveyResponse.enumeratorId.firstName} ${surveyResponse.enumeratorId.lastName}`
          : "N/A",
        "Field Coordinator Name": surveyResponse.enumeratorId
          ?.fieldCoordinatorId
          ? `${surveyResponse.enumeratorId.fieldCoordinatorId.firstName} ${surveyResponse.enumeratorId.fieldCoordinatorId.lastName}`
          : "N/A",
        "Field Coordinator State":
          surveyResponse.enumeratorId?.fieldCoordinatorId?.selectedState ||
          "N/A",
        Location: surveyResponse.location,
        "Media URL": surveyResponse.mediaUrl,
        "Submitted At": surveyResponse.submittedAt
          ? new Date(surveyResponse.submittedAt).toLocaleString()
          : "",
      };

      allQuestions.forEach((questionText) => {
        const matchingResp = surveyResponse.responses.find(
          (resp) => resp.question === questionText
        );
        baseData[questionText] = matchingResp ? matchingResp.answer : "";
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
        <h1 className="text-2xl font-bold mb-4">Survey Responses</h1>

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

        <div className="flex-1 overflow-auto">
          <div className="table-container">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {/* Static Columns */}
                  <th className="border border-gray-400 px-4 py-2">
                    Survey Title
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Survey Subtitle
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Enumerator Name
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Field Coordinator Name
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Field Coordinator State
                  </th>
                  <th className="border border-gray-400 px-4 py-2">Location</th>
                  <th className="border border-gray-400 px-4 py-2">
                    Media URL
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Submitted At
                  </th>
                  {/* Dynamic Question Columns */}
                  {allQuestions.map((questionText, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-400 px-4 py-2 whitespace-normal"
                    >
                      {questionText}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surveyResponses.map((surveyResponse, rowIndex) => (
                  <tr
                    key={
                      surveyResponse.enumeratorId?._id || `survey-${rowIndex}`
                    }
                  >
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.surveyId?.title || "N/A"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.surveyId?.subtitle || "N/A"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.enumeratorId
                        ? `${surveyResponse.enumeratorId.firstName} ${surveyResponse.enumeratorId.lastName}`
                        : "N/A"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.enumeratorId?.fieldCoordinatorId
                        ? `${surveyResponse.enumeratorId.fieldCoordinatorId.firstName} ${surveyResponse.enumeratorId.fieldCoordinatorId.lastName}`
                        : "N/A"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.enumeratorId?.fieldCoordinatorId
                        ?.selectedState || "N/A"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.location}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
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
                    <td className="border border-gray-400 px-4 py-2">
                      {surveyResponse.submittedAt
                        ? new Date(surveyResponse.submittedAt).toLocaleString()
                        : ""}
                    </td>
                    {allQuestions.map((questionText, colIndex) => {
                      const matchingResp = surveyResponse.responses.find(
                        (resp) => resp.question === questionText
                      );
                      return (
                        <td
                          key={colIndex}
                          className="border border-gray-400 px-4 py-2 whitespace-normal"
                        >
                          {matchingResp ? matchingResp.answer : ""}
                        </td>
                      );
                    })}
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
