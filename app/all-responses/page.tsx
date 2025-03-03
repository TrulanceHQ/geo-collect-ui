//new
"use client";

// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

import React, { useEffect, useState } from "react";
import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";

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
    subquestion?: string; // New optional field for likert subquestions
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  startTime: string;
  submittedAt: string;
}

const tableCellStyle: React.CSSProperties = {
  border: "1px solid black",
  padding: "10px",
};

const SurveyResponsesTable: React.FC = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyData[]>([]);

  useEffect(() => {
    const fetchSurveyResponses = async () => {
      const responses = await fetchAllSurveyResponsesByAdmin();
      setSurveyResponses(responses);
    };
    fetchSurveyResponses();
  }, []);

  // Create a union of all dynamic columns using a composite key:
  // For standard questions, subquestion will be an empty string.
  const allQuestions = Array.from(
    new Set(
      surveyResponses.flatMap((survey) =>
        survey.responses.map(
          (res) => `${res.question}|||${res.subquestion || ""}`
        )
      )
    )
  ).map((key) => {
    const [question, subquestion] = key.split("|||");
    return { question, subquestion };
  });

  return (
    <>
      <style jsx>{`
        .sticky-header {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 1;
        }
      `}</style>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            {/* <table
        style={{
          width: "100%",
          tableLayout: "auto",
          border: "2px solid black",
          borderCollapse: "collapse",
        }}
      >
        <thead> */}
            <tr>
              {/* Static Columns */}
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

              {/* Dynamic Columns */}
              {allQuestions.map((q, index) => {
                // If a subquestion exists, do not use rowSpan here.
                if (q.subquestion) {
                  return (
                    <th
                      key={index}
                      style={tableCellStyle}
                      className="sticky-header"
                    >
                      {q.question}
                    </th>
                  );
                } else {
                  // For standard questions (no subquestion) use rowSpan to cover both header rows.
                  return (
                    <th
                      key={index}
                      style={tableCellStyle}
                      className="sticky-header"
                      rowSpan={2}
                    >
                      {q.question}
                    </th>
                  );
                }
              })}

              {/* More Static Columns */}
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
              {/* Render second header row for columns that have a subquestion */}
              {allQuestions.map((q, index) =>
                q.subquestion ? (
                  <th key={index} style={tableCellStyle}>
                    {q.subquestion}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {surveyResponses.map((survey) => (
              <tr key={survey._id}>
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
                {/* Render dynamic question responses */}
                {allQuestions.map((q, index) => {
                  const foundResponse = survey.responses.find(
                    (res) =>
                      res.question === q.question &&
                      (res.subquestion || "") === q.subquestion
                  );
                  let answerRendered = "N/A";
                  if (foundResponse) {
                    answerRendered = Array.isArray(foundResponse.answer)
                      ? foundResponse.answer.join(", ")
                      : foundResponse.answer;
                  }
                  return (
                    <td key={index} style={tableCellStyle}>
                      {answerRendered}
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
    </>
  );
};

export default SurveyResponsesTable;
