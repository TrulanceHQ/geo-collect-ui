"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

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
  // Responses may include duplicate entries,
  // which we will merge.
  responses: {
    question: string;
    subquestion?: string;
    // Initially a string or array; after preprocessing, we'll store an array.
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
  subquestion: string; // The display text for the subquestion (if any), or ""
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

// Updated normalize function: trims, lowercases, and removes any trailing colon (or semicolon)
const normalizeText = (text: string): string => {
  let normalized = text.trim().toLowerCase();
  // Remove a trailing colon (or comma, semicolon—as needed)
  normalized = normalized.replace(/[:;]+$/, "");
  return normalized;
};

// Preprocess a single survey’s responses so that duplicate
// (question, subquestion) entries are merged. Answers are merged into an array.
const preprocessSurveyResponsesForSurvey = (survey: SurveyData): SurveyData => {
  const mergedMap = new Map<
    string,
    { question: string; subquestion: string; answers: string[] }
  >();

  survey.responses.forEach((r) => {
    if (!r.question || r.question.trim() === "") return; // Skip empty questions

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
  // Raw survey responses from the API.
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
    Create a union of all dynamic headers from the preprocessed survey responses.
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
            headerMap.set(key, { key, question: qDisp, subquestion: sDisp });
          }
        }
      });
    });
    return Array.from(headerMap.values());
  }, [surveyResponses]);

  /*
    Filter out headers (dynamic columns) that have no actual nonempty answer across all surveys.
  */
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

  /*
    The Excel export builds rows using the filtered headers.
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
        const response = survey.responses.find((r) => {
          const currKey = `${normalizeText(
            r.question.trim()
          )}|||${normalizeText(r.subquestion ? r.subquestion.trim() : "")}`;
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
          min-width: 18rem;
          font-size: 0.7rem;
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
              {/* Second header row: only for headers that have a subquestion */}
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
