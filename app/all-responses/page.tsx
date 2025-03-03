// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { fetchAllSurveyResponsesByAdmin } from "@/services/apiService";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

"use client";

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
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  startTime: string;
  submittedAt: string;
}

const tableCellStyle = {
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

  // Compute the union of all questions from all survey responses.
  const allQuestions = Array.from(
    new Set(
      surveyResponses.flatMap((survey) =>
        survey.responses.map((res) => res.question)
      )
    )
  );

  return (
    <table
      style={{
        width: "100%",
        tableLayout: "auto",
        border: "2px solid black",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={tableCellStyle}>Survey Title</th>
          <th style={tableCellStyle}>Enumerator</th>
          <th style={tableCellStyle}>Field Coordinator Name</th>
          <th style={tableCellStyle}>Field Coordinator State</th>
          {/* Dynamically generated question columns */}
          {allQuestions.map((question, index) => (
            <th key={index} style={tableCellStyle}>
              {question}
            </th>
          ))}
          <th style={tableCellStyle}>Location</th>
          <th style={tableCellStyle}>Media URL</th>
          <th style={tableCellStyle}>Start Time</th>
          <th style={tableCellStyle}>Submitted At</th>
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
            {/* Render the answer for each dynamic question column */}
            {allQuestions.map((question, index) => {
              const foundResponse = survey.responses.find(
                (res) => res.question === question
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
  );
};

export default SurveyResponsesTable;
