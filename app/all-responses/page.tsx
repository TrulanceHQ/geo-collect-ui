// //new
// "use client";

// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// import React, { useEffect, useState } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";

// interface SurveyData {
//   _id: string;
//   surveyId: { title: string; subtitle: string };
//   enumeratorId: {
//     firstName: string;
//     lastName: string;
//     fieldCoordinatorId: {
//       firstName: string;
//       lastName: string;
//       selectedState: string;
//     };
//   };
//   responses: {
//     question: string;
//     subquestion?: string; // New optional field for likert subquestions
//     answer: string | string[];
//   }[];
//   location: string;
//   mediaUrl: string;
//   startTime: string;
//   submittedAt: string;
// }

// const tableCellStyle: React.CSSProperties = {
//   border: "1px solid black",
//   padding: "10px",
// };

// // Function to preprocess survey responses, grouping by question and subquestion
// const preprocessSurveyResponses = (responses: SurveyData[]) => {
//   const groupedResponses = new Map<string, string[]>(); // Map to group responses by question + subquestion key

//   responses.forEach((survey) => {
//     survey.responses.forEach((res) => {
//       if (res.question && res.question.trim() !== "") {
//         // Create a unique key for each question + subquestion pair
//         const key = `${res.question.trim().toLowerCase()}|||${(
//           res.subquestion || ""
//         ).toLowerCase()}`;
//         if (!groupedResponses.has(key)) {
//           groupedResponses.set(key, []);
//         }

//         // Merge answers: handle both arrays and single values
//         const existingAnswers = groupedResponses.get(key)!;
//         const newAnswer = Array.isArray(res.answer) ? res.answer : [res.answer]; // Wrap single answers in an array
//         groupedResponses.set(key, [...existingAnswers, ...newAnswer]);
//       }
//     });
//   });

//   // Convert grouped data back into a flat array
//   return Array.from(groupedResponses.entries()).map(([key, answers]) => {
//     const [question, subquestion] = key.split("|||");
//     return {
//       question,
//       subquestion,
//       answers: Array.from(new Set(answers)), // Remove duplicate answers
//     };
//   });
// };

// const SurveyResponsesTable: React.FC = () => {
//   const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

//   useEffect(() => {
//     const fetchSurveyResponses = async () => {
//       const responses = await fetchAllSurveyResponsesByAdmin();
//       setSurveyResponses(responses);
//     };
//     fetchSurveyResponses();
//   }, []);

//   const exportToExcel = () => {
//     const data = surveyResponses.map((survey) => ({
//       "Survey Title": survey.surveyId ? survey.surveyId.title : "N/A",
//       Enumerator: survey.enumeratorId
//         ? `${survey.enumeratorId.firstName} ${survey.enumeratorId.lastName}`
//         : "N/A",
//       "Field Coordinator":
//         survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//           ? `${survey.enumeratorId.fieldCoordinatorId.firstName} ${survey.enumeratorId.fieldCoordinatorId.lastName}`
//           : "N/A",
//       State:
//         survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//           ? survey.enumeratorId.fieldCoordinatorId.selectedState
//           : "N/A",
//       ...Object.fromEntries(
//         survey.responses.map((res, index) => [
//           `${res.question}${res.subquestion ? " - " + res.subquestion : ""}`,
//           Array.isArray(res.answer) ? res.answer.join(", ") : res.answer,
//         ])
//       ),
//       Location: survey.location,
//       "Media URL": survey.mediaUrl,
//       "Start Time": new Date(survey.startTime).toLocaleString(),
//       "Submitted At": new Date(survey.submittedAt).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "SurveyResponses.xlsx");
//   };

//   // const allQuestions = Array.from(
//   //   new Set(
//   //     surveyResponses.flatMap((survey) =>
//   //       survey.responses.map(
//   //         (res) => `${res.question}|||${res.subquestion || ""}`
//   //       )
//   //     )
//   //   )
//   // ).map((key) => {
//   //   const [question, subquestion] = key.split("|||");
//   //   return { question, subquestion };
//   // });

//   const allQuestions = Array.from(
//     new Set(
//       surveyResponses.flatMap(
//         (survey) =>
//           survey.responses
//             .filter(
//               (res) => res.question && res.question.trim() !== "" // Exclude empty questions
//             )
//             .map(
//               (res) =>
//                 `${res.question.trim().toLowerCase()}|||${
//                   res.subquestion || ""
//                 }`
//             ) // Normalize question text
//       )
//     )
//   ).map((key) => {
//     const [question, subquestion] = key.split("|||");
//     return { question, subquestion };
//   });

//   return (
//     <>
//       {/* <style jsx>{`
//         .sticky-header {
//           position: sticky;
//           top: 0;
//           background-color: white;
//           z-index: 1;
//         }
//         .table th,
//         .table td {
//           font-size: 10px;
//         }
//       `}</style> */}
//       <style jsx>{`
//         .sticky-header {
//           position: sticky;
//           top: 0;
//           background-color: white;
//           z-index: 1;
//           font-size: 16px; /* Adjust header font size */
//         }

//         .table th,
//         .table td {
//           min-width: 15rem; /* Prevent content from narrowing too much */
//           font-size: 14px; /* Adjust data font size */
//           word-wrap: break-word; /* Ensure long text wraps */
//         }

//         .table {
//           table-layout: auto;
//           width: 100%; /* Allow table to span the full container */
//         }

//         .table-responsive {
//           overflow-x: auto; /* Add horizontal scrolling for overflow */
//         }
//       `}</style>
//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead className="thead-light">
//             <tr>
//               {/* Static Columns */}
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Survey Title
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Enumerator
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Field Coordinator
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 State
//               </th>

//               {/* Dynamic Columns */}
//               {allQuestions.map((q, index) => {
//                 // If a subquestion exists, do not use rowSpan here.
//                 if (q.subquestion) {
//                   return (
//                     <th
//                       key={index}
//                       style={tableCellStyle}
//                       className="sticky-header"
//                     >
//                       {q.question}
//                     </th>
//                   );
//                 } else {
//                   // For standard questions (no subquestion) use rowSpan to cover both header rows.
//                   return (
//                     <th
//                       key={index}
//                       style={tableCellStyle}
//                       className="sticky-header"
//                       rowSpan={2}
//                     >
//                       {q.question}
//                     </th>
//                   );
//                 }
//               })}

//               {/* More Static Columns */}
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Location
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Media URL
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Start Time
//               </th>
//               <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
//                 Submitted At
//               </th>
//             </tr>
//             <tr>
//               {/* Render second header row for columns that have a subquestion */}
//               {allQuestions.map((q, index) =>
//                 q.subquestion ? (
//                   <th key={index} style={tableCellStyle}>
//                     {q.subquestion}
//                   </th>
//                 ) : null
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {surveyResponses.map((survey) => (
//               <tr key={survey._id}>
//                 <td style={tableCellStyle}>
//                   {survey.surveyId ? survey.surveyId.title : "N/A"}
//                 </td>
//                 <td style={tableCellStyle}>
//                   {survey.enumeratorId
//                     ? `${survey.enumeratorId.firstName} ${survey.enumeratorId.lastName}`
//                     : "N/A"}
//                 </td>
//                 <td style={tableCellStyle}>
//                   {survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//                     ? `${survey.enumeratorId.fieldCoordinatorId.firstName} ${survey.enumeratorId.fieldCoordinatorId.lastName}`
//                     : "N/A"}
//                 </td>
//                 <td style={tableCellStyle}>
//                   {survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//                     ? survey.enumeratorId.fieldCoordinatorId.selectedState
//                     : "N/A"}
//                 </td>
//                 {/* Render dynamic question responses */}
//                 {/* {allQuestions.map((q, index) => {
//                   const foundResponse = survey.responses.find(
//                     (res) =>
//                       res.question === q.question &&
//                       (res.subquestion || "") === q.subquestion
//                   );
//                   let answerRendered = "N/A";
//                   if (foundResponse) {
//                     answerRendered = Array.isArray(foundResponse.answer)
//                       ? foundResponse.answer.join(", ")
//                       : foundResponse.answer;
//                   }
//                   return (
//                     <td key={index} style={tableCellStyle}>
//                       {answerRendered}
//                     </td>
//                   );
//                 })} */}

//                 {allQuestions.map((q, index) => {
//                   const foundResponse = survey.responses.find(
//                     (res) =>
//                       res.question &&
//                       res.question.trim().toLowerCase() ===
//                         q.question.toLowerCase() &&
//                       (res.subquestion || "") === q.subquestion
//                   );

//                   return (
//                     <td key={index} style={tableCellStyle}>
//                       {foundResponse && foundResponse.answer
//                         ? Array.isArray(foundResponse.answer)
//                           ? foundResponse.answer.join(", ")
//                           : foundResponse.answer
//                         : "N/A"}
//                     </td>
//                   );
//                 })}

//                 <td style={tableCellStyle}>{survey.location}</td>
//                 <td style={tableCellStyle}>
//                   <a
//                     href={survey.mediaUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     View Media
//                   </a>
//                 </td>
//                 <td style={tableCellStyle}>
//                   {new Date(survey.startTime).toLocaleString()}
//                 </td>
//                 <td style={tableCellStyle}>
//                   {new Date(survey.submittedAt).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button
//           className="bg-gray-800 text-white px-4 py-4 my-4 rounded "
//           onClick={exportToExcel}
//         >
//           Download as Excel
//         </button>
//       </div>
//     </>
//   );
// };

// export default SurveyResponsesTable;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// ───────────────────────────────────────────────────────
// Data Types
// ───────────────────────────────────────────────────────

interface SurveyData {
  _id: string;
  surveyId: { title: string; subtitle: string };
  enumeratorId: {
    firstName: string;
    lastName: string;
    fieldCoordinatorId: {
      firstName: string;
      lastName: string;
      selectedState: string;
    };
  };
  responses: {
    question: string;
    subquestion?: string;
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  startTime: string;
  submittedAt: string;
}

// This describes a dynamic column header that will appear in the table.
interface DynamicHeader {
  key: string; // A unique key computed from normalized question & subquestion
  question: string; // The display text for the question
  subquestion: string; // The display text for the subquestion (if any, otherwise "")
}

// ───────────────────────────────────────────────────────
// CSS for Table Cells
// ───────────────────────────────────────────────────────

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "10px",
};

// ───────────────────────────────────────────────────────
// Helper Function
// ───────────────────────────────────────────────────────

// Normalize text by trimming and converting to lowercase
const normalizeText = (text: string): string => text.trim().toLowerCase();

// ───────────────────────────────────────────────────────
// Main Component
// ───────────────────────────────────────────────────────

const SurveyResponsesTable: React.FC = () => {
  // Store raw survey responses.
  const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const responses = await fetchAllSurveyResponsesByAdmin();
      setSurveyResponses(responses);
    }
    fetchData();
  }, []);

  /*
    Compute the union of all dynamic headers.
    For each response in every survey:
      • If the question is not empty, we form a normalized key:
            key = normalizeText(question) + "|||" + normalizeText(subquestion)
      • Even if a question appears twice (with the same subquestion), the key will be the same,
        so only one header is created.
  */
  const unionHeaders: DynamicHeader[] = useMemo(() => {
    const headerMap = new Map<string, DynamicHeader>();
    surveyResponses.forEach((survey) => {
      survey.responses.forEach((res) => {
        if (res.question && res.question.trim() !== "") {
          // Compute normalized values.
          const qNorm = normalizeText(res.question);
          const sNorm =
            res.subquestion && res.subquestion.trim() !== ""
              ? normalizeText(res.subquestion)
              : "";
          // Our key always has the format "qNorm|||sNorm"
          const key = `${qNorm}|||${sNorm}`;
          // If this key is new, add it with the trimmed display values.
          if (!headerMap.has(key)) {
            headerMap.set(key, {
              key,
              question: res.question.trim(),
              subquestion: sNorm, // We use the normalized subquestion (or "" if none)
            });
          }
        }
      });
    });
    return Array.from(headerMap.values());
  }, [surveyResponses]);

  /*
    When exporting to Excel, we build rows just as in the table: static columns plus a
    column for each header where answers for that key (merged if needed) are concatenated.
  */
  const exportToExcel = () => {
    const data = surveyResponses.map((survey) => {
      const row: any = {
        "Survey Title": survey.surveyId ? survey.surveyId.title : "N/A",
        Enumerator: survey.enumeratorId
          ? `${survey.enumeratorId.firstName} ${survey.enumeratorId.lastName}`
          : "N/A",
        "Field Coordinator":
          survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
            ? `${survey.enumeratorId.fieldCoordinatorId.firstName} ${survey.enumeratorId.fieldCoordinatorId.lastName}`
            : "N/A",
        State:
          survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
            ? survey.enumeratorId.fieldCoordinatorId.selectedState
            : "N/A",
      };

      unionHeaders.forEach((header) => {
        // For each header, merge all answers whose normalized key matches.
        const mergedAnswers = survey.responses
          .filter((r) => {
            if (!r.question || r.question.trim() === "") return false;
            const currentQNorm = normalizeText(r.question);
            const currentSNorm =
              r.subquestion && r.subquestion.trim() !== ""
                ? normalizeText(r.subquestion)
                : "";
            const currKey = `${currentQNorm}|||${currentSNorm}`;
            return currKey === header.key;
          })
          .map((r) => r.answer)
          .flat(); // in case an answer is an array
        const uniqueAnswers = Array.from(new Set(mergedAnswers));
        row[
          `${header.question}${
            header.subquestion ? " - " + header.subquestion : ""
          }`
        ] = uniqueAnswers.length > 0 ? uniqueAnswers.join(", ") : "N/A";
      });

      row["Location"] = survey.location;
      row["Media URL"] = survey.mediaUrl;
      row["Start Time"] = new Date(survey.startTime).toLocaleString();
      row["Submitted At"] = new Date(survey.submittedAt).toLocaleString();
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "SurveyResponses.xlsx");
  };

  return (
    <>
      <style jsx>{`
        .sticky-header {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 1;
          font-size: 16px;
        }
        .table th,
        .table td {
          min-width: 150px;
          font-size: 14px;
          word-wrap: break-word;
        }
        .table {
          table-layout: auto;
          width: 100%;
        }
        .table-responsive {
          overflow-x: auto;
        }
      `}</style>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              {/* Static Headers */}
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Survey Title
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Enumerator
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Field Coordinator
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                State
              </th>
              {/* Dynamic Headers */}
              {unionHeaders.map((header) => {
                // If there is a subquestion, show the main question on the first row.
                if (header.subquestion !== "") {
                  return (
                    <th
                      key={header.key}
                      style={tableCellStyle}
                      className="sticky-header"
                    >
                      {header.question}
                    </th>
                  );
                } else {
                  // If no subquestion exists, have the header span two rows.
                  return (
                    <th
                      key={header.key}
                      style={tableCellStyle}
                      className="sticky-header"
                      rowSpan={2}
                    >
                      {header.question}
                    </th>
                  );
                }
              })}
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Location
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Media URL
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Start Time
              </th>
              <th className="sticky-header" style={tableCellStyle} rowSpan={2}>
                Submitted At
              </th>
            </tr>
            <tr>
              {/* Second header row: only for headers with a subquestion */}
              {unionHeaders.map((header) =>
                header.subquestion !== "" ? (
                  <th key={header.key} style={tableCellStyle}>
                    {header.subquestion}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {surveyResponses.map((survey) => (
              <tr key={survey._id}>
                {/* Render static cells */}
                <td style={tableCellStyle}>
                  {survey.surveyId ? survey.surveyId.title : "N/A"}
                </td>
                <td style={tableCellStyle}>
                  {survey.enumeratorId
                    ? `${survey.enumeratorId.firstName} ${survey.enumeratorId.lastName}`
                    : "N/A"}
                </td>
                <td style={tableCellStyle}>
                  {survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
                    ? `${survey.enumeratorId.fieldCoordinatorId.firstName} ${survey.enumeratorId.fieldCoordinatorId.lastName}`
                    : "N/A"}
                </td>
                <td style={tableCellStyle}>
                  {survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
                    ? survey.enumeratorId.fieldCoordinatorId.selectedState
                    : "N/A"}
                </td>
                {/* For each dynamic header, merge responses (if any) */}
                {unionHeaders.map((header) => {
                  const mergedAnswers = survey.responses
                    .filter((r) => {
                      if (!r.question || r.question.trim() === "") return false;
                      const currentQNorm = normalizeText(r.question);
                      const currentSNorm =
                        r.subquestion && r.subquestion.trim() !== ""
                          ? normalizeText(r.subquestion)
                          : "";
                      const currKey = `${currentQNorm}|||${currentSNorm}`;
                      return currKey === header.key;
                    })
                    .map((r) => r.answer)
                    .flat();
                  const uniqueAnswers = Array.from(new Set(mergedAnswers));
                  return (
                    <td key={header.key} style={tableCellStyle}>
                      {uniqueAnswers.length > 0
                        ? uniqueAnswers.join(", ")
                        : "N/A"}
                    </td>
                  );
                })}
                <td style={tableCellStyle}>{survey.location}</td>
                <td style={tableCellStyle}>
                  <a
                    href={survey.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Media
                  </a>
                </td>
                <td style={tableCellStyle}>
                  {new Date(survey.startTime).toLocaleString()}
                </td>
                <td style={tableCellStyle}>
                  {new Date(survey.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-gray-800 text-white px-4 py-4 my-4 rounded"
          onClick={exportToExcel}
        >
          Download as Excel
        </button>
      </div>
    </>
  );
};

export default SurveyResponsesTable;
