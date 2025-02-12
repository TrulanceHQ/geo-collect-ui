"use client";

import { useState } from "react";

export default function Questions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", type: "multiple-choice", options: [""] },
  ]);
  const [mediaInstruction, setMediaInstruction] = useState("");
  const [mediaType, setMediaType] = useState("");

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", type: "multiple-choice", options: [""] }]);
  };

  // Function to handle question input change
  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  // Function to handle question type change
  const handleQuestionTypeChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].type = value;
    if (value !== "text") newQuestions[index].options = [""]; // Reset options for new type
    setQuestions(newQuestions);
  };

  // Function to add an option for multiple-choice/single-choice
  const addOption = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  // Function to handle input change for options
  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        {isFormOpen ? "Close Form" : "Create New Survey"}
      </button>

      {isFormOpen && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

          {/* Survey Title */}
          <label className="block mb-2 font-medium">Survey Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Survey Sub-title */}
          <label className="block mb-2 font-medium">Survey Sub-title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey sub-title"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />

          {/* Questions Section */}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border-b pb-4 mb-4">
              <label className="block mb-2 font-medium">Question {qIndex + 1}:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />

              {/* Question Type */}
              <label className="block mb-2 font-medium">Question Type:</label>
              <select
                className="w-full p-2 border rounded-md mb-4"
                value={q.type}
                onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="single-choice">Single Choice</option>
                <option value="text">Text (Message Box)</option>
              </select>

              {/* Options for Multiple & Single Choice */}
              {(q.type === "multiple-choice" || q.type === "single-choice") && (
                <div>
                  <label className="block mb-2 font-medium">Options:</label>
                  {q.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      className="w-full p-2 border rounded-md mb-2"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                  ))}
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                    onClick={() => addOption(qIndex)}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Textbox for Message Box */}
              {q.type === "text" && (
                <textarea
                  className="w-full p-2 border rounded-md mt-2"
                  placeholder="User can enter a response here..."
                  disabled
                />
              )}
            </div>
          ))}

          {/* Add Another Question */}
          <button className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full" onClick={addQuestion}>
            + Add Another Question
          </button>

          {/* Media Instruction Section (Always at the End) */}
          <div className="mt-4">
            <label className="block mb-2 font-medium">Media Instruction:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter instruction like 'Take picture', 'Record video', or 'Record voice'"
              value={mediaInstruction}
              onChange={(e) => setMediaInstruction(e.target.value)}
            />

            {mediaInstruction && (
              <div>
                <label className="block mb-2 font-medium">Select Media Type:</label>
                <select
                  className="w-full p-2 border rounded-md mb-4"
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="picture">Picture</option>
                </select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
}
