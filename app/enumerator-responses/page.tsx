"use client";

import { useState } from "react";
import { useResponseContext } from "@/services/ResponseContext";
import Image from "next/image";

interface SurveyResponse {
  _id: string;
  surveyId?: {
    _id: string;
    title: string;
  } | null;
  responses: SurveyResponseDetail[];
  location: string;
  mediaUrl: string;
  submittedAt: string;
  startTime?: string | number | Date | undefined;
}

interface SurveyResponseDetail {
  questionId: string;
  question: string | string[];
  answer: string | string[];
}

const isMedia = (url: string): "image" | "audio" | "other" => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac"];

  const extension = url.split(".").pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return "image";
  } else if (extension && audioExtensions.includes(extension)) {
    return "audio";
  }
  return "other";
};


export default function ResponsesPage() {
  const { responses } = useResponseContext();
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  return (
    <div className="p-6 space-y-6 w-full">
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => window.history.back()}>
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Collected Responses</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">S/N</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((survey, index) => (
              <tr
                key={survey._id}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedResponse(survey)}
              >
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{survey.location}</td>
                <td className="border p-2">{new Date(survey.submittedAt).toLocaleString()}</td>
                <td className="border p-2">{new Date(survey.startTime).toLocaleString() || "-" }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedResponse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-3xl relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setSelectedResponse(null)}>
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Response Details</h2>
            <p>
              <strong>Location:</strong> {selectedResponse.location}
            </p>
            <p>
              <strong>Started At:</strong> {selectedResponse.startTime ? new Date(selectedResponse.startTime).toLocaleString() : "-"}
            </p>
            <p>
              <strong>Submitted At:</strong> {selectedResponse.submittedAt ? new Date(selectedResponse.submittedAt).toLocaleString() : "-"}
            </p>

            {/* Display Responses */}
            <div className="mt-4">
              <h3 className="font-bold">Responses:</h3>
              <ul className="list-disc pl-5">
                {selectedResponse.responses.map((resp, index) => (
                  <li key={index}>
                    <strong>{resp.question}:</strong> {resp.answer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Display Media */}
            {selectedResponse.mediaUrl && (
              <div className="mt-4">
                <h3 className="font-bold">Media:</h3>
                {isMedia(selectedResponse.mediaUrl) === "image" ? (
                  <Image
                    src={selectedResponse.mediaUrl}
                    alt="Uploaded media"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                ) : isMedia(selectedResponse.mediaUrl) === "audio" ? (
                  <audio controls className="mt-2">
                    <source src={selectedResponse.mediaUrl} type={`audio/${selectedResponse.mediaUrl.split(".").pop()}`} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <a
                    href={selectedResponse.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Media
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
