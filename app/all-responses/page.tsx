"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// ──────────────────────────────────────────────
// Interfaces & Types
// ──────────────────────────────────────────────

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

interface DynamicHeader {
  key: string;
  question: string;
  subquestion: string;
}

// ──────────────────────────────────────────────
// Inline Styles & Helper Functions
// ──────────────────────────────────────────────

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "10px",
};

const normalizeText = (text: string): string => {
  let normalized = text.trim().toLowerCase();
  normalized = normalized.replace(/[:;]+$/, "");
  return normalized;
};

const preprocessSurveyResponsesForSurvey = (survey: SurveyData): SurveyData => {
  const mergedMap = new Map<
    string,
    { question: string; subquestion: string; answers: string[] }
  >();

  survey.responses.forEach((r) => {
    if (!r.question || r.question.trim() === "") return;
    const qDisp = r.question.trim();
    const sDisp =
      r.subquestion && r.subquestion.trim() !== "" ? r.subquestion.trim() : "";
    const key = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;
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

  survey.responses = Array.from(mergedMap.values()).map((entry) => ({
    question: entry.question,
    subquestion: entry.subquestion,
    answer: entry.answers,
  }));

  return survey;
};

// ──────────────────────────────────────────────
// Advanced Pagination Component
// ──────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdvancedPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbersToShow = 5;
  let startPage: number, endPage: number;

  if (totalPages <= pageNumbersToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const halfWindow = Math.floor(pageNumbersToShow / 2);
    if (currentPage <= halfWindow + 1) {
      startPage = 1;
      endPage = pageNumbersToShow;
    } else if (currentPage + halfWindow >= totalPages) {
      startPage = totalPages - pageNumbersToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfWindow;
      endPage = currentPage + halfWindow;
    }
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-wrapper">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>

      <style jsx>{`
        .pagination-wrapper {
          display: flex;
          gap: 0.5rem;
        }
        button {
          border: 1px solid #ccc;
          background-color: white;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          cursor: pointer;
        }
        button.active {
          background-color: #333;
          color: white;
          font-weight: bold;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// ──────────────────────────────────────────────
// Main Component with Numbering and Scroll-to-Top Pagination
// ──────────────────────────────────────────────

const SurveyResponsesTable: React.FC = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 50;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const responses = await fetchAllSurveyResponsesByAdmin();
      const processed = responses.map(preprocessSurveyResponsesForSurvey);
      setSurveyResponses(processed);
    }
    fetchData();
  }, []);

  // Scroll to the top of the tableRef when currentPage changes
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  // Calculate slice boundaries based on current page
  const indexLastRecord = currentPage * recordsPerPage;
  const indexFirstRecord = indexLastRecord - recordsPerPage;

  // Get only the current page's records
  const currentRecords = useMemo(
    () => surveyResponses.slice(indexFirstRecord, indexLastRecord),
    [surveyResponses, currentPage, recordsPerPage]
  );

  const totalPages = Math.ceil(surveyResponses.length / recordsPerPage);

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
            headerMap.set(key, { key, question: qDisp, subquestion: sDisp });
          }
        }
      });
    });
    return Array.from(headerMap.values());
  }, [surveyResponses]);

  const filteredHeaders: DynamicHeader[] = useMemo(() => {
    return unionHeaders.filter((header) =>
      surveyResponses.some((survey) => {
        const match = survey.responses.find((r) => {
          const currKey = `${normalizeText(
            r.question.trim()
          )}|||${normalizeText(r.subquestion ? r.subquestion.trim() : "")}`;
          return currKey === header.key;
        });
        if (match) {
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

  const exportToExcel = () => {
    const dataToExport = surveyResponses.map((survey) => {
      const dynamicData: Record<string, string> = {};
      filteredHeaders.forEach((header) => {
        const response = survey.responses.find((r) => {
          const q = r.question.trim();
          const s =
            r.subquestion && r.subquestion.trim() !== ""
              ? r.subquestion.trim()
              : "";
          const currKey = `${normalizeText(q)}|||${normalizeText(s)}`;
          return currKey === header.key;
        });
        dynamicData[
          header.question +
            (header.subquestion ? " - " + header.subquestion : "")
        ] =
          response && Array.isArray(response.answer)
            ? response.answer.join(", ")
            : "N/A";
      });
      return {
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
        ...dynamicData,
        Location: survey.location,
        "Media URL": survey.mediaUrl,
        "Start Time": new Date(survey.startTime).toLocaleString(),
        "Submitted At": new Date(survey.submittedAt).toLocaleString(),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SurveyResponses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "survey_responses.xlsx");
  };

  return (
    <>
      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        .table {
          table-layout: auto;
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          min-width: 20rem;
          font-size: 0.7rem;
          word-wrap: break-word;
          border: 1px solid black;
        }

        .controls-container {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .download-btn {
          padding: 0.75rem 2rem;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .download-btn:hover {
          background-color: #555;
        }
      `}</style>

      {/* The table container is referenced by tableRef */}
      <div className="table-responsive" ref={tableRef}>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              {/* Numbering column header */}
              <th className="sticky-header" style={tableCellStyle}>
                #
              </th>
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
              {filteredHeaders.map((header) =>
                header.subquestion !== "" ? (
                  <th
                    key={header.key}
                    style={tableCellStyle}
                    className="sticky-header"
                  >
                    {header.question}
                  </th>
                ) : (
                  <th
                    key={header.key}
                    style={tableCellStyle}
                    className="sticky-header"
                    rowSpan={2}
                  >
                    {header.question}
                  </th>
                )
              )}
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
            {currentRecords.map((survey, index) => (
              <tr key={survey._id}>
                {/* Number this row relative to overall dataset */}
                <td style={tableCellStyle}>{indexFirstRecord + index + 1}</td>
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
      </div>

      <div className="controls-container">
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <div>
          <button className="download-btn" onClick={exportToExcel}>
            Download as Excel
          </button>
        </div>
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
//   // Responses may include duplicate entries,
//   // which we will merge.
//   responses: {
//     question: string;
//     subquestion?: string;
//     // Initially a string or array; after preprocessing, we'll store an array.
//     answer: string | string[];
//   }[];
//   location: string;
//   mediaUrl: string;
//   startTime: string;
//   submittedAt: string;
// }

// // A dynamic header (i.e. a column) that will be rendered for each unique
// // (question, subquestion) combination.
// interface DynamicHeader {
//   key: string; // computed as normalized(question) + "|||" + normalized(subquestion)
//   question: string; // The display text for the question (trimmed, original casing)
//   subquestion: string; // The display text for the subquestion (if any), or ""
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

// // Updated normalize function: trims, lowercases, and removes any trailing colon (or semicolon)
// const normalizeText = (text: string): string => {
//   let normalized = text.trim().toLowerCase();
//   // Remove a trailing colon (or comma, semicolon—as needed)
//   normalized = normalized.replace(/[:;]+$/, "");
//   return normalized;
// };

// // Preprocess a single survey’s responses so that duplicate
// // (question, subquestion) entries are merged. Answers are merged into an array.
// const preprocessSurveyResponsesForSurvey = (survey: SurveyData): SurveyData => {
//   const mergedMap = new Map<
//     string,
//     { question: string; subquestion: string; answers: string[] }
//   >();

//   survey.responses.forEach((r) => {
//     if (!r.question || r.question.trim() === "") return; // Skip empty questions

//     const qDisp = r.question.trim();
//     const sDisp =
//       r.subquestion && r.subquestion.trim() !== "" ? r.subquestion.trim() : "";
//     const key = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;

//     const currentAnswers = Array.isArray(r.answer) ? r.answer : [r.answer];

//     if (mergedMap.has(key)) {
//       const prev = mergedMap.get(key)!;
//       const merged = Array.from(new Set([...prev.answers, ...currentAnswers]));
//       mergedMap.set(key, {
//         question: qDisp,
//         subquestion: sDisp,
//         answers: merged,
//       });
//     } else {
//       mergedMap.set(key, {
//         question: qDisp,
//         subquestion: sDisp,
//         answers: Array.from(new Set(currentAnswers)),
//       });
//     }
//   });

//   // Replace responses with merged entries.
//   survey.responses = Array.from(mergedMap.values()).map((entry) => ({
//     question: entry.question,
//     subquestion: entry.subquestion,
//     answer: entry.answers, // now always an array
//   }));

//   return survey;
// };

// // ──────────────────────────────────────────────
// // Main Component
// // ──────────────────────────────────────────────

// const SurveyResponsesTable: React.FC = () => {
//   // Raw survey responses from the API.
//   const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       const responses = await fetchAllSurveyResponsesByAdmin();
//       // Preprocess each survey to merge duplicate question entries.
//       const processed = responses.map(preprocessSurveyResponsesForSurvey);
//       setSurveyResponses(processed);
//     }
//     fetchData();
//   }, []);

//   /*
//     Create a union of all dynamic headers from the preprocessed survey responses.
//     Each header is added only once based on its normalized key.
//   */
//   const unionHeaders: DynamicHeader[] = useMemo(() => {
//     const headerMap = new Map<string, DynamicHeader>();
//     surveyResponses.forEach((survey) => {
//       survey.responses.forEach((r) => {
//         if (r.question && r.question.trim() !== "") {
//           const qDisp = r.question.trim();
//           const sDisp =
//             r.subquestion && r.subquestion.trim() !== ""
//               ? r.subquestion.trim()
//               : "";
//           const key = `${normalizeText(qDisp)}|||${normalizeText(sDisp)}`;
//           if (!headerMap.has(key)) {
//             headerMap.set(key, { key, question: qDisp, subquestion: sDisp });
//           }
//         }
//       });
//     });
//     return Array.from(headerMap.values());
//   }, [surveyResponses]);

//   /*
//     Filter out headers (dynamic columns) that have no actual nonempty answer across all surveys.
//   */
//   const filteredHeaders: DynamicHeader[] = useMemo(() => {
//     return unionHeaders.filter((header) =>
//       surveyResponses.some((survey) => {
//         const match = survey.responses.find((r) => {
//           const currKey = `${normalizeText(
//             r.question.trim()
//           )}|||${normalizeText(r.subquestion ? r.subquestion.trim() : "")}`;
//           return currKey === header.key;
//         });
//         if (match) {
//           if (Array.isArray(match.answer)) {
//             return match.answer.some((ans) => ans && ans.trim() !== "");
//           } else {
//             return match.answer && match.answer.trim() !== "";
//           }
//         }
//         return false;
//       })
//     );
//   }, [unionHeaders, surveyResponses]);

//   /*
//     The Excel export builds rows using the filtered headers.
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

//       filteredHeaders.forEach((header) => {
//         const response = survey.responses.find((r) => {
//           const currKey = `${normalizeText(
//             r.question.trim()
//           )}|||${normalizeText(r.subquestion ? r.subquestion.trim() : "")}`;
//           return currKey === header.key;
//         });
//         row[
//           `${header.question}${
//             header.subquestion ? " - " + header.subquestion : ""
//           }`
//         ] =
//           response && Array.isArray(response.answer)
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
//           min-width: 20rem;
//           font-size: 0.7rem;
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
//               {/* Static Headers */}
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
//               {/* Dynamic Headers */}
//               {filteredHeaders.map((header) => {
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
//               {/* Second header row: only for headers that have a subquestion */}
//               {filteredHeaders.map((header) =>
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
//                 {/* Static Cells */}
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
//                 {/* Dynamic Cells */}
//                 {filteredHeaders.map((header) => {
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
