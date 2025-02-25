"use client";

import { useState } from "react";
import { useResponseContext } from "@/services/ResponseContext";
import Image from "next/image";

// interface Response {
//   questionId: string;
//   answer: string | string[];
//   mediaUrl?: string;
//   location?: string;
// }

interface SurveyResponse {
  surveyId?: {
    _id: string;
    title: string;
  } | null;
  enumeratorId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
  location: string;
  mediaUrl: string;
  submittedAt: string;
}

const isMedia = (answer: string): "image" | "video" | "audio" | "text" => {
  return /\.(jpeg|jpg|png|gif|bmp|svg|webp)$/i.test(answer)
    ? "image"
    : /\.(mp4|webm|ogg)$/i.test(answer)
    ? "video"
    : /\.(mp3|wav|ogg)$/i.test(answer)
    ? "audio"
    : "text";
};

export default function ResponsesPage() {
  const { responses } = useResponseContext();
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Collected Responses</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Survey</th>
              <th className="border p-2">Enumerator</th>
              <th className="border p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((survey) => (
              <tr
                key={survey._id}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSelectedResponse({
                    ...survey,
                    location: survey.location || "",
                    mediaUrl: survey.mediaUrl || "",
                  })
                }
              >
                <td className="border p-2">
                  {survey.surveyId ? survey.surveyId.title : "No Survey"}
                </td>
                <td className="border p-2">{survey.enumeratorId}</td>
                <td className="border p-2">
                  {new Date(survey.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedResponse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedResponse(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Response Details</h2>
            <p>
              <strong>Survey:</strong>{" "}
              {selectedResponse.surveyId?.title || "No Survey"}
            </p>
            <p>
              <strong>Enumerator:</strong> {selectedResponse.enumeratorId}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(selectedResponse.submittedAt).toLocaleString()}
            </p>

            <div className="mt-4">
              {selectedResponse.responses.map((res, index) => {
                const answers = Array.isArray(res.answer)
                  ? res.answer
                  : [res.answer];
                return (
                  <div key={index} className="mb-4">
                    <p className="font-bold">Question {index + 1}</p>
                    {answers.map((ans, idx) => {
                      const mediaType = isMedia(ans);
                      return (
                        <div key={idx} className="mb-2">
                          {mediaType === "image" && (
                            <Image
                              src={ans}
                              alt="response"
                              className="w-32 h-32 object-cover"
                            />
                            // <img src={ans} alt="response" className="w-32 h-32 object-cover" />
                          )}
                          {mediaType === "video" && (
                            <video controls className="w-40">
                              <source src={ans} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {mediaType === "audio" && (
                            <audio controls>
                              <source src={ans} type="audio/mp3" />
                              Your browser does not support the audio tag.
                            </audio>
                          )}
                          {mediaType === "text" && <span>{ans}</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
