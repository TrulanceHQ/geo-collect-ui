// export default function Questions() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Survey Questions</h1>
//       <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Create New Survey</button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function Questions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [options, setOptions] = useState([""]); // Array for multiple-choice options

  // Function to add an option for multiple-choice
  const addOption = () => setOptions([...options, ""]);

  // Function to handle input change for options
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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

      {/* Survey Form - Appears when button is clicked */}
      {isFormOpen && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

          {/* Survey Title */}
          <label className="block mb-2 font-medium">Survey Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey title"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
          />

          {/* Question Input */}
          <label className="block mb-2 font-medium">Question:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Question Type Selection */}
          <label className="block mb-2 font-medium">Question Type:</label>
          <select
            className="w-full p-2 border rounded-md mb-4"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="single-choice">Single Choice</option>
            <option value="message-box">Message Box</option>
          </select>

          {/* Options for Multiple Choice Questions */}
          {questionType === "multiple-choice" && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Options:</label>
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
              <button
                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                onClick={addOption}
              >
                + Add Option
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
}
