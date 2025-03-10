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

// ──────────────────────────────────────────────
// Data Types
// ──────────────────────────────────────────────

// A survey response, as fetched from the API.
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
  // Note: responses array may include duplicate entries
  // which we will merge.
  responses: {
    question: string;
    subquestion?: string;
    // Initially a string or array; after preprocessing, we always store an array.
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  startTime: string;
  submittedAt: string;
}

// A dynamic header (i.e. a column) that will be rendered for each unique
// (question, subquestion) combination.
interface DynamicHeader {
  key: string; // computed as normalized(question) + "|||" + normalized(subquestion)
  question: string; // The display text for the question (trimmed, original casing)
  subquestion: string; // The display text for the subquestion (if any); or "" if none.
}

// ──────────────────────────────────────────────
// CSS for Table Cells
// ──────────────────────────────────────────────

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "10px",
};

// ──────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────

// Normalize text by trimming and converting it to lowercase.
const normalizeText = (text: string): string => text.trim().toLowerCase();

// Preprocess a single survey’s responses so that duplicate (question, subquestion)
// entries are merged. (Answers are merged into an array with duplicates removed.)
const preprocessSurveyResponsesForSurvey = (survey: SurveyData): SurveyData => {
  // Use a Map keyed by "qNorm|||sNorm".
  const mergedMap = new Map<
    string,
    { question: string; subquestion: string; answers: string[] }
  >();

  survey.responses.forEach((r) => {
    if (!r.question || r.question.trim() === "") return; // skip empty questions

    const qDisp = r.question.trim();
    const sDisp =
      r.subquestion && r.subquestion.trim() !== "" ? r.subquestion.trim() : "";
    const key = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;

    // Convert answer to an array.
    const currentAnswers = Array.isArray(r.answer) ? r.answer : [r.answer];

    if (mergedMap.has(key)) {
      const prev = mergedMap.get(key)!;
      const merged = Array.from(new Set([...prev.answers, ...currentAnswers]));
      mergedMap.set(key, {
        question: qDisp,
        subquestion: sDisp,
        answers: merged,
      });
    } else {
      mergedMap.set(key, {
        question: qDisp,
        subquestion: sDisp,
        answers: Array.from(new Set(currentAnswers)),
      });
    }
  });

  // Replace responses with merged entries.
  survey.responses = Array.from(mergedMap.values()).map((entry) => ({
    question: entry.question,
    subquestion: entry.subquestion,
    answer: entry.answers, // now always an array
  }));

  return survey;
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const SurveyResponsesTable: React.FC = () => {
  // Raw data from the API.
  const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const responses = await fetchAllSurveyResponsesByAdmin();
      // Preprocess each survey to merge duplicate question entries.
      const processed = responses.map(preprocessSurveyResponsesForSurvey);
      setSurveyResponses(processed);
    }
    fetchData();
  }, []);

  /*
    Build the union of all dynamic headers from the preprocessed survey responses.
    Each header is added only once based on its normalized key.
  */
  const unionHeaders: DynamicHeader[] = useMemo(() => {
    const headerMap = new Map<string, DynamicHeader>();
    surveyResponses.forEach((survey) => {
      survey.responses.forEach((r) => {
        if (r.question && r.question.trim() !== "") {
          const qDisp = r.question.trim();
          const sDisp =
            r.subquestion && r.subquestion.trim() !== ""
              ? r.subquestion.trim()
              : "";
          const key = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;
          if (!headerMap.has(key)) {
            headerMap.set(key, {
              key,
              question: qDisp,
              subquestion: sDisp,
            });
          }
        }
      });
    });
    return Array.from(headerMap.values());
  }, [surveyResponses]);

  /*
    Filter out headers (dynamic columns) for which no survey provided any answer.
    We check each header against every survey’s responses.
    If for a given header key none of the surveys have a nonempty answer, then we
    remove that header entirely.
  */
  const filteredHeaders: DynamicHeader[] = useMemo(() => {
    return unionHeaders.filter((header) =>
      surveyResponses.some((survey) => {
        const match = survey.responses.find((r) => {
          const currentKey = `${normalizeText(
            r.question.trim()
          )}|||${normalizeText(r.subquestion ? r.subquestion.trim() : "")}`;
          return currentKey === header.key;
        });
        if (match) {
          // If the answer (or answers) is nonempty, keep this header.
          if (Array.isArray(match.answer)) {
            return match.answer.some((ans) => ans && ans.trim() !== "");
          } else {
            return match.answer && match.answer.trim() !== "";
          }
        }
        return false;
      })
    );
  }, [unionHeaders, surveyResponses]);

  /*
    Exporting to Excel uses the same filtered headers.
    For each survey row, for each header,
    we look for a matching response (which is already merged). If not found, that column is skipped.
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

      filteredHeaders.forEach((header) => {
        // Look up the matching response by comparing normalized keys.
        const response = survey.responses.find((r) => {
          const qDisp = r.question.trim();
          const sDisp =
            r.subquestion && r.subquestion.trim() !== ""
              ? r.subquestion.trim()
              : "";
          const currKey = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;
          return currKey === header.key;
        });
        row[
          `${header.question}${
            header.subquestion ? " - " + header.subquestion : ""
          }`
        ] =
          response && Array.isArray(response.answer)
            ? response.answer.join(", ")
            : "N/A";
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
              {filteredHeaders.map((header) => {
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
              {filteredHeaders.map((header) =>
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
                {/* Static Cells */}
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
                {/* Dynamic Cells */}
                {filteredHeaders.map((header) => {
                  const response = survey.responses.find((r) => {
                    const q = r.question.trim();
                    const s =
                      r.subquestion && r.subquestion.trim() !== ""
                        ? r.subquestion.trim()
                        : "";
                    const currKey = `${normalizeText(q)}|||${normalizeText(s)}`;
                    return currKey === header.key;
                  });
                  return (
                    <td key={header.key} style={tableCellStyle}>
                      {response && Array.isArray(response.answer)
                        ? response.answer.join(", ")
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

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// // ──────────────────────────────────────────────
// // Data Types
// // ──────────────────────────────────────────────

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
//   // The responses array might have duplicate entries.
//   // We will preprocess each survey so that each unique
//   // (question, subquestion) pair appears only once with merged answers.
//   responses: {
//     question: string;
//     subquestion?: string;
//     // After merging, we will always store this as an array of answers.
//     answer: string | string[];
//   }[];
//   location: string;
//   mediaUrl: string;
//   startTime: string;
//   submittedAt: string;
// }

// // Type for each dynamic column header in the table.
// interface DynamicHeader {
//   key: string; // A unique key: normalized(question) + "|||" + normalized(subquestion)
//   question: string; // Display text for the question
//   subquestion: string; // Display text for the subquestion (if any)
// }

// // ──────────────────────────────────────────────
// // CSS for Table Cells
// // ──────────────────────────────────────────────

// const tableCellStyle: React.CSSProperties = {
//   border: "1px solid black",
//   padding: "10px",
// };

// // ──────────────────────────────────────────────
// // Helper Functions
// // ──────────────────────────────────────────────

// // Normalize a text by trimming and converting to lowercase.
// const normalizeText = (text: string): string => text.trim().toLowerCase();

// // Preprocess a single survey's responses so that duplicate entries (based on question and subquestion)
// // are merged into one. This function returns a new SurveyData with a cleaned responses array.
// const preprocessSurveyResponsesForSurvey = (survey: SurveyData): SurveyData => {
//   // Create a map keyed by "normalized(question)|||normalized(subquestion)"
//   const mergedMap = new Map<
//     string,
//     { question: string; subquestion: string; answers: string[] }
//   >();

//   survey.responses.forEach((r) => {
//     // Skip empty questions.
//     if (!r.question || r.question.trim() === "") return;

//     const q = r.question.trim();
//     const s =
//       r.subquestion && r.subquestion.trim() !== "" ? r.subquestion.trim() : "";
//     const key = `${normalizeText(q)}|||${normalizeText(s)}`;

//     // Get answers as an array (even if already an array).
//     const currentAnswers = Array.isArray(r.answer) ? r.answer : [r.answer];

//     if (mergedMap.has(key)) {
//       // Merge answers; remove duplicates.
//       const prev = mergedMap.get(key)!;
//       const merged = Array.from(new Set([...prev.answers, ...currentAnswers]));
//       mergedMap.set(key, { question: q, subquestion: s, answers: merged });
//     } else {
//       mergedMap.set(key, {
//         question: q,
//         subquestion: s,
//         answers: Array.from(new Set(currentAnswers)),
//       });
//     }
//   });

//   // Replace the survey's responses with the merged responses.
//   survey.responses = Array.from(mergedMap.values()).map((entry) => ({
//     question: entry.question,
//     subquestion: entry.subquestion,
//     answer: entry.answers, // answer is now an array
//   }));

//   return survey;
// };

// // ──────────────────────────────────────────────
// // Main Component
// // ──────────────────────────────────────────────

// const SurveyResponsesTable: React.FC = () => {
//   // Raw survey responses are fetched from the API.
//   const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       const responses = await fetchAllSurveyResponsesByAdmin();

//       // Preprocess every survey to merge duplicate question/subquestion responses.
//       const processed = responses.map(preprocessSurveyResponsesForSurvey);
//       setSurveyResponses(processed);
//     }
//     fetchData();
//   }, []);

//   /*
//     Build the union of dynamic headers from the preprocessed survey responses.
//     Now each survey's responses is unique per (question, subquestion) pair.
//     We create a header for each unique normalized key.
//   */
//   const unionHeaders: DynamicHeader[] = useMemo(() => {
//     const headerMap = new Map<string, DynamicHeader>();
//     surveyResponses.forEach((survey) => {
//       survey.responses.forEach((r) => {
//         if (r.question && r.question.trim() !== "") {
//           const q = r.question.trim();
//           const s =
//             r.subquestion && r.subquestion.trim() !== ""
//               ? r.subquestion.trim()
//               : "";
//           const key = `${normalizeText(q)}|||${normalizeText(s)}`;
//           if (!headerMap.has(key)) {
//             headerMap.set(key, { key, question: q, subquestion: s });
//           }
//         }
//       });
//     });
//     return Array.from(headerMap.values());
//   }, [surveyResponses]);

//   /*
//     Export to Excel uses the preprocessed data.
//     For each survey row, for every dynamic header, we look for a matching entry.
//     Since the responses are already merged, there should be at most one match.
//   */
//   const exportToExcel = () => {
//     const data = surveyResponses.map((survey) => {
//       const row: any = {
//         "Survey Title": survey.surveyId ? survey.surveyId.title : "N/A",
//         Enumerator: survey.enumeratorId
//           ? `${survey.enumeratorId.firstName} ${survey.enumeratorId.lastName}`
//           : "N/A",
//         "Field Coordinator":
//           survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//             ? `${survey.enumeratorId.fieldCoordinatorId.firstName} ${survey.enumeratorId.fieldCoordinatorId.lastName}`
//             : "N/A",
//         State:
//           survey.enumeratorId && survey.enumeratorId.fieldCoordinatorId
//             ? survey.enumeratorId.fieldCoordinatorId.selectedState
//             : "N/A",
//       };

//       unionHeaders.forEach((header) => {
//         // Look for a matching response entry using the normalized key.
//         const response = survey.responses.find((r) => {
//           const q = r.question.trim();
//           const s =
//             r.subquestion && r.subquestion.trim() !== ""
//               ? r.subquestion.trim()
//               : "";
//           const currentKey = `${normalizeText(q)}|||${normalizeText(s)}`;
//           return currentKey === header.key;
//         });
//         row[
//           `${header.question}${
//             header.subquestion ? " - " + header.subquestion : ""
//           }`
//         ] =
//           response && response.answer && Array.isArray(response.answer)
//             ? response.answer.join(", ")
//             : "N/A";
//       });
//       row["Location"] = survey.location;
//       row["Media URL"] = survey.mediaUrl;
//       row["Start Time"] = new Date(survey.startTime).toLocaleString();
//       row["Submitted At"] = new Date(survey.submittedAt).toLocaleString();
//       return row;
//     });

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

//   return (
//     <>
//       <style jsx>{`
//         .sticky-header {
//           position: sticky;
//           top: 0;
//           background-color: white;
//           z-index: 1;
//           font-size: 16px;
//         }
//         .table th,
//         .table td {
//           min-width: 150px;
//           font-size: 14px;
//           word-wrap: break-word;
//         }
//         .table {
//           table-layout: auto;
//           width: 100%;
//         }
//         .table-responsive {
//           overflow-x: auto;
//         }
//       `}</style>
//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead className="thead-light">
//             <tr>
//               {/* Static headers */}
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
//               {/* Dynamic headers */}
//               {unionHeaders.map((header) => {
//                 if (header.subquestion !== "") {
//                   return (
//                     <th
//                       key={header.key}
//                       style={tableCellStyle}
//                       className="sticky-header"
//                     >
//                       {header.question}
//                     </th>
//                   );
//                 } else {
//                   return (
//                     <th
//                       key={header.key}
//                       style={tableCellStyle}
//                       className="sticky-header"
//                       rowSpan={2}
//                     >
//                       {header.question}
//                     </th>
//                   );
//                 }
//               })}
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
//               {/* Second header row only for dynamic headers with a subquestion */}
//               {unionHeaders.map((header) =>
//                 header.subquestion !== "" ? (
//                   <th key={header.key} style={tableCellStyle}>
//                     {header.subquestion}
//                   </th>
//                 ) : null
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {surveyResponses.map((survey) => (
//               <tr key={survey._id}>
//                 {/* Static cells */}
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
//                 {/* Dynamic cells */}
//                 {unionHeaders.map((header) => {
//                   const response = survey.responses.find((r) => {
//                     const q = r.question.trim();
//                     const s =
//                       r.subquestion && r.subquestion.trim() !== ""
//                         ? r.subquestion.trim()
//                         : "";
//                     const currKey = `${normalizeText(q)}|||${normalizeText(s)}`;
//                     return currKey === header.key;
//                   });
//                   return (
//                     <td key={header.key} style={tableCellStyle}>
//                       {response && Array.isArray(response.answer)
//                         ? response.answer.join(", ")
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
//           className="bg-gray-800 text-white px-4 py-4 my-4 rounded"
//           onClick={exportToExcel}
//         >
//           Download as Excel
//         </button>
//       </div>
//     </>
//   );
// };

// export default SurveyResponsesTable;
