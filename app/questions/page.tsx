"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LikertQuestion {
  question: string;
  options: string[];
}

interface Question {
  question: string;
  type:
    | "likert-scale"
    | "multiple-choice"
    | "single-choice"
    | "text"
    | "record-audio"
    | "record-video"
    | "take-picture";
  options: string[];
  likertQuestions: LikertQuestion[];
}

export default function Questions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "Question 1",
      type: "likert-scale",
      options: [],
      likertQuestions: [],
    },
  ]);
  //   const [mediaInstruction, setMediaInstruction] = useState("");
  //   const [mediaType, setMediaType] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [isAutoSaving, setIsAutoSaving] = useState(false); // State to track auto-saving status

  // {
  //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
  // }

  // {
  //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
  // }
  {isAutoSaving && <p className="text-gray-500">Auto-saving...</p>}

  // let typingTimeout: NodeJS.Timeout;
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Save form data to localStorage
  const saveFormAsDraft = () => {
    const formData = {
      title,
      subtitle,
      questions,
    };
    localStorage.setItem("formDraft", JSON.stringify(formData));
    toast("Form saved as draft!");
  };

  const handleTyping = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setIsAutoSaving(true);
      // saveFormAsDraft();
      setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
    }, 1000);
  };

  // const handleTyping = () => {
  //   clearTimeout(typingTimeout); // Clear previous timeout

  //   //test

  //   // Set a new timeout to save after a delay (e.g., 1 second of idle time)
  //   typingTimeout = setTimeout(() => {
  //     setIsAutoSaving(true); // Show the "Auto-saving..." indicator
  //     saveFormAsDraft(); // Auto-save after pause
  //     setIsAutoSaving(false); // Hide the "Auto-saving..." indicator
  //   }, 1000); // Adjust the debounce time as needed
  // };

  // Load saved form data from localStorage
  const loadFormFromDraft = () => {
    const savedForm = localStorage.getItem("formDraft");
    if (savedForm) {
      const parsedData = JSON.parse(savedForm);
      setTitle(parsedData.title);
      setSubtitle(parsedData.subtitle);
      setQuestions(parsedData.questions);
    }
  };

  // Load form data when the component mounts (on page load)
  useEffect(() => {
    loadFormFromDraft();
  }, []);

  // Add a new main question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: `Question ${questions.length + 1}`,
        type: "likert-scale", // default question type can be any, e.g., likert-scale
        options: [],
        likertQuestions: [],
      },
    ]);
  };

  // Handle changing main question text
  const handleMainQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
    handleTyping(); // Trigger typing handler when the user types
  };

  const handleQuestionTypeChange = (
    index: number,
    type:
      | "likert-scale"
      | "multiple-choice"
      | "single-choice"
      | "text"
      | "record-audio"
      | "record-video"
      | "take-picture"
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;

    // Reset media flags
    setAllowAudio(false);
    setAllowVideo(false);
    setAllowImage(false);

    // Update based on selection
    if (type === "record-audio") {
      setAllowAudio(true);
    } else if (type === "record-video") {
      setAllowVideo(true);
    } else if (type === "take-picture") {
      setAllowImage(true);
    }

    // Ensure only relevant fields are retained
    if (type === "likert-scale") {
      newQuestions[index].options = [];
      newQuestions[index].likertQuestions = [
        { question: "", options: ["", "", "", "", ""] },
      ];
    } else if (type === "multiple-choice" || type === "single-choice") {
      newQuestions[index].likertQuestions = [];
      newQuestions[index].options = ["", ""];
    } else {
      newQuestions[index].likertQuestions = [];
      newQuestions[index].options = [];
    }

    setQuestions(newQuestions);
  };

  // Add a new Likert scale question under a main question
  const addLikertQuestion = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].likertQuestions.push({
      question: "",
      options: ["", "", "", "", ""],
    });
    setQuestions(newQuestions);
  };

  // Handle changing Likert scale question text
  const handleLikertQuestionChange = (
    qIndex: number,
    lIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].likertQuestions[lIndex].question = value;
    setQuestions(newQuestions);
  };

  // Handle changing Likert scale options
  const handleOptionChange = (
    qIndex: number,
    lIndex: number | null,
    oIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    if (lIndex !== null) {
      newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
    } else {
      newQuestions[qIndex].options[oIndex] = value;
    }
    setQuestions(newQuestions);
  };

  // Add another option for a Likert scale question
  const addOption = (qIndex: number, lIndex: number | null) => {
    const newQuestions = [...questions];
    if (lIndex !== null) {
      newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option for Likert scale
    } else {
      newQuestions[qIndex].options.push(""); // Add an empty option for other types
    }
    setQuestions(newQuestions);
  };

  // Remove an option for multiple-choice or single-choice question
  const removeOption = (
    qIndex: number,
    lIndex: number | null,
    oIndex: number
  ) => {
    const newQuestions = [...questions];
    if (lIndex !== null) {
      newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1); // Remove option from Likert scale
    } else {
      newQuestions[qIndex].options.splice(oIndex, 1); // Remove option from multiple-choice or single-choice
    }
    setQuestions(newQuestions);
  };

  // // Remove a question
  // const removeQuestion = (qIndex: number) => {
  //   const newQuestions = [...questions];
  //   newQuestions.splice(qIndex, 1); // Remove the question at the specified index
  //   setQuestions(newQuestions);
  // };

  const [allowAudio, setAllowAudio] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);
  const [allowImage, setAllowImage] = useState(false);

  // POST request to submit the survey data
  const handleSubmitSurvey = async () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      alert("You are not authorized to perform this action.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Access token is missing.");
      return;
    }

    // Validation check ends
    for (const question of questions) {
      if (!question.question.trim()) {
        toast.error("All questions must have a valid text.");
        return;
      }

      if (
        (question.type === "multiple-choice" ||
          question.type === "single-choice") &&
        (question.options.length === 0 ||
          question.options.some((option) => !option.trim()))
      ) {
        toast.error(
          "Multiple-choice and single-choice questions must have at least one non-empty option."
        );
        return;
      }

      if (
        question.type === "likert-scale" &&
        question.likertQuestions.length === 0
      ) {
        toast.error(
          "Likert scale questions must contain at least one sub-question."
        );
        return;
      }
    }

    //validation check ends
    const surveyData = {
      title,
      subtitle,
      questions,
      //   mediaInstruction,
      //   mediaType,
      allowAudio, // Now included at the survey level
      allowVideo, // Now included at the survey level
      allowImage, // Now included at the survey level
    };

    setIsSubmitting(true); // Set submitting state to true when submission starts
    try {
      // const response = await fetch("https://geo-collect.onrender.com/api/v1/create", {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        setIsSubmitting(false); // Reset submitting state in case of error
        return;
      }

      const data = await response.json();
      console.log("Survey submitted successfully:", data);
      toast("Survey submitted successfully!");

      // Clear the form after successful submission
      setTitle("");
      setSubtitle("");
      setQuestions([
        {
          question: "Question 1",
          type: "likert-scale",
          options: [],
          likertQuestions: [],
        },
      ]);
      setIsSubmitting(false); // Reset submitting state after clearing form
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("An error occurred while submitting the survey.");
      setIsSubmitting(false); // Reset submitting state in case of error
    }
  };

  return (
    <div className="relative p-6">
      {/* Logo at the Top Right */}
      <div className="absolute top-4 right-6">
        <Image
          src="/digiplus.png"
          alt="Company Logo"
          width={120}
          height={50}
          priority
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        {isFormOpen ? "Close Form" : "Create New Survey"}
      </button>

      {isFormOpen && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

          <label className="block mb-2 font-medium">Survey Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey title"
            value={title}
            // onChange={(e) => setTitle(e.target.value)}
            onChange={(e) => {
              setTitle(e.target.value);
              handleTyping();
            }}
          />

          <label className="block mb-2 font-medium">Survey Sub-title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey sub-title"
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              handleTyping();
            }}
            // onChange={(e) => setSubtitle(e.target.value)}
          />
          {/* <input
            type="text"
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              handleTyping();
            }}
            placeholder="Survey Subtitle"
          /> */}

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border-b pb-4 mb-4">
              {/* Main question */}
              <label className="block mb-2 font-medium">{q.question}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                value={q.question}
                onChange={(e) =>
                  handleMainQuestionChange(qIndex, e.target.value)
                }
              />

              {/* Question Type Dropdown */}
              <label className="block mb-2 font-medium">
                Select Question Type:
              </label>
              <select
                className="w-full p-2 border rounded-md mb-4"
                value={q.type}
                onChange={(e) =>
                  handleQuestionTypeChange(
                    qIndex,
                    e.target.value as
                      | "likert-scale"
                      | "multiple-choice"
                      | "single-choice"
                      | "text"
                  )
                }
              >
                <option value="likert-scale">Likert Scale</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="single-choice">Single Choice</option>
                <option value="text">Text</option>
                <option value="record-audio">Record Audio</option>
                <option value="record-video">Record Video</option>
                <option value="take-picture">Take Picture</option>
              </select>

              {/* Show Likert scale questions if selected */}
              {q.type === "likert-scale" && (
                <div>
                  {q.likertQuestions.map((likertQ, lIndex) => (
                    <div key={lIndex} className="mb-4">
                      <label className="block mb-2 font-medium">
                        Likert Question {lIndex + 1}:
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md mb-4"
                        value={likertQ.question}
                        onChange={(e) =>
                          handleLikertQuestionChange(
                            qIndex,
                            lIndex,
                            e.target.value
                          )
                        }
                      />

                      <label className="block mb-2 font-medium">
                        Likert Scale Options:
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {likertQ.options.map((option, oIndex) => (
                          <input
                            key={oIndex}
                            type="text"
                            className="w-1/5 p-2 border rounded-md"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                lIndex,
                                oIndex,
                                e.target.value
                              )
                            }
                          />
                        ))}
                      </div>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                        onClick={() => addOption(qIndex, lIndex)}
                      >
                        + Add Option
                      </button>
                    </div>
                  ))}
                  <button
                    className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
                    onClick={() => addLikertQuestion(qIndex)}
                  >
                    + Add Another Likert Scale Question
                  </button>
                </div>
              )}

              {/* Show Multiple-Choice or Single-Choice */}
              {(q.type === "multiple-choice" || q.type === "single-choice") && (
                <div>
                  <label className="block mb-2 font-medium">
                    {q.type === "multiple-choice"
                      ? "Multiple Choice"
                      : "Single Choice"}{" "}
                    Options:
                  </label>
                  {q.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      className="w-full p-2 border rounded-md mb-2"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, null, oIndex, e.target.value)
                      }
                    />
                  ))}
                  {/* <button onClick={() => removeOption(qIndex, null, oIndex)}>Remove Option</button> */}
                  <button
                    onClick={() => addOption(qIndex, null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded mt-2 "
                  >
                    Add Option
                  </button>{" "}
                  <button
                    onClick={() => removeOption(qIndex, null, qIndex)}
                    className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
                  >
                    Remove Option
                  </button>
                </div>
              )}

              {/* Show Text input for Text Question */}
              {q.type === "text" && (
                <div>
                  <label className="block mb-2 font-medium">
                    Text Response:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your answer"
                    disabled
                  />
                </div>
              )}
            </div>
          ))}

          <button
            className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={addQuestion}
          >
            + Add Another Question
          </button>

          {/* Submit Button */}

          <button
            onClick={saveFormAsDraft}
            className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Save as Draft
          </button>
          {/* <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button> */}

          <button
            className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={handleSubmitSurvey}
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </div>
      )}
    </div>
  );
}
