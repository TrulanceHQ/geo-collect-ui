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

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React, { useEffect, useMemo, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";

// ----- Data Types -----

// Structure for each survey response row.
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

// Structure for dynamic header columns.
interface DynamicHeader {
  key: string; // Normalized key (question + "|||" + subquestion)
  question: string;
  subquestion: string; // May be empty if none
}

// ----- CSS Style -----

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "10px",
};

// ----- Helper Function -----

// Normalize a question/subquestion pair into a unique key.
const normalizeKey = (question: string, subquestion?: string): string => {
  return `${question.trim().toLowerCase()}|||${(subquestion || "")
    .trim()
    .toLowerCase()}`;
};

// ----- Main Component -----

const SurveyResponsesTable: React.FC = () => {
  // State for the raw survey responses fetched from your API.
  const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

  // Fetch survey responses on component mount.
  useEffect(() => {
    const fetchData = async () => {
      const responses = await fetchAllSurveyResponsesByAdmin();
      setSurveyResponses(responses);
    };
    fetchData();
  }, []);

  /*
    Build a union of all dynamic question headers (question + subquestion).
    For each survey response, look at every response item that has a non-empty question.
    Normalize (trim and lowercase) the question and subquestion so that duplicates
    (even with different formatting) yield the same key.
  */
  const allQuestions: DynamicHeader[] = useMemo(() => {
    const keys = new Set<string>();
    surveyResponses.forEach((survey) => {
      survey.responses.forEach((res) => {
        if (res.question && res.question.trim() !== "") {
          keys.add(normalizeKey(res.question, res.subquestion));
        }
      });
    });
    return Array.from(keys).map((key) => {
      const [question, subquestion] = key.split("|||");
      return { key, question, subquestion };
    });
  }, [surveyResponses]);

  // ----- Export Function -----
  const exportToExcel = () => {
    const data = surveyResponses.map((survey) => ({
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
      // Create columns for each response in its own way.
      ...Object.fromEntries(
        survey.responses.map((res) => [
          `${res.question}${res.subquestion ? " - " + res.subquestion : ""}`,
          Array.isArray(res.answer) ? res.answer.join(", ") : res.answer,
        ])
      ),
      Location: survey.location,
      "Media URL": survey.mediaUrl,
      "Start Time": new Date(survey.startTime).toLocaleString(),
      "Submitted At": new Date(survey.submittedAt).toLocaleString(),
    }));

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

  // ----- Render Table -----
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
              {allQuestions.map((col, index) => {
                // If a subquestion exists, render the question in the first header row.
                if (col.subquestion) {
                  return (
                    <th
                      key={index}
                      style={tableCellStyle}
                      className="sticky-header"
                    >
                      {col.question}
                    </th>
                  );
                } else {
                  // If no subquestion exists, span two rows.
                  return (
                    <th
                      key={index}
                      style={tableCellStyle}
                      className="sticky-header"
                      rowSpan={2}
                    >
                      {col.question}
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
              {/* Render second header row only for columns that have subquestions */}
              {allQuestions.map((col, index) =>
                col.subquestion ? (
                  <th key={index} style={tableCellStyle}>
                    {col.subquestion}
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
                {/* Render dynamic cells for each unique question/subquestion header */}
                {allQuestions.map((col, index) => {
                  // For each survey row, find all response items matching this header.
                  const mergedAnswers = survey.responses
                    .filter((res) => {
                      if (res.question && res.question.trim() !== "") {
                        return (
                          normalizeKey(res.question, res.subquestion) ===
                          col.key
                        );
                      }
                      return false;
                    })
                    .map((res) => res.answer)
                    .flat() // In case answer is an array, flatten it
                    // Remove duplicates from merged answers.
                    .filter((value, idx, self) => self.indexOf(value) === idx);
                  return (
                    <td key={index} style={tableCellStyle}>
                      {mergedAnswers.length > 0
                        ? mergedAnswers.join(", ")
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
