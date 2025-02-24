// Working starts

"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LikertQuestion {
  question: string;
  options: string[];
}

interface Option {
  value: string;
  nextSection: number | null; // Add nextSection property
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
  // options: string[];
  options: Option[]; // Update options to use the Option interface
  likertQuestions: LikertQuestion[];
}

export default function Questions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sections, setSections] = useState<
    { title: string; questions: Question[] }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const saveFormAsDraft = () => {
    const formData = {
      title,
      subtitle,
      sections,
    };
    localStorage.setItem("formDraft", JSON.stringify(formData));
    toast("Form saved as draft!");
  };

  const handleTyping = () => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setIsAutoSaving(true);
      setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
    }, 1000);
  };

  const loadFormFromDraft = () => {
    const savedForm = localStorage.getItem("formDraft");
    if (savedForm) {
      const parsedData = JSON.parse(savedForm);
      setTitle(parsedData.title);
      setSubtitle(parsedData.subtitle);
      setSections(parsedData.sections);
    }
  };

  useEffect(() => {
    loadFormFromDraft();
  }, []);

  const addSection = () => {
    setSections([
      ...sections,
      { title: `Section ${sections.length + 1}`, questions: [] },
    ]);
  };

  const handleSectionTitleChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].title = value;
    setSections(newSections);
  };

  const addQuestionToSection = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      question: "",
      type: "text", // Default type, can be changed
      options: [],
      likertQuestions: [],
    });
    setSections(newSections);
  };

  const handleSectionQuestionChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].question = value;
    setSections(newSections);
  };

  // const handleSectionQuestionTypeChange = (
  //   sectionIndex: number,
  //   questionIndex: number,
  //   type: string
  // ) => {
  //   const newSections = [...sections];
  //   newSections[sectionIndex].questions[questionIndex].type =
  //     type as Question["type"];
  //   setSections(newSections);
  // };

  // const handleSectionQuestionTypeChange = (
  //   sectionIndex: number,
  //   questionIndex: number,
  //   type: string
  // ) => {
  //   const newSections = [...sections];
  //   const question = newSections[sectionIndex].questions[questionIndex];

  //   question.type = type as Question["type"];

  //   // Remove options and likertQuestions for text type questions
  //   if (type === "text") {
  //     question.options = [];
  //     question.likertQuestions = [];
  //   }

  //   // Ensure that likertQuestions is emptied for non-likert type questions
  //   if (type !== "likert-scale") {
  //     question.likertQuestions = [];
  //   }
  //   setSections(newSections);
  // };

  const handleSectionQuestionTypeChange = (
    sectionIndex: number,
    questionIndex: number,
    type: string
  ) => {
    const newSections = [...sections];
    const question = newSections[sectionIndex].questions[questionIndex];
    question.type = type as Question["type"];

    // Clear options and likertQuestions if the type is not likert-scale
    if (type === "text") {
      question.options = [];
      question.likertQuestions = [];
    } else if (type !== "likert-scale") {
      question.likertQuestions = [];
    }

    setSections(newSections);
  };

  const addLikertQuestion = (sectionIndex: number, qIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].likertQuestions.push({
      question: "",
      options: ["", "", "", "", ""],
    });
    setSections(newSections);
  };

  const handleLikertQuestionChange = (
    sectionIndex: number,
    qIndex: number,
    lIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].likertQuestions[
      lIndex
    ].question = value;
    setSections(newSections);
  };

  const handleOptionChange = (
    sectionIndex: number,
    qIndex: number,
    oIndex: number,
    value: string,
    nextSection: number | null
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].options[oIndex] = {
      value,
      nextSection,
    };
    setSections(newSections);
  };

  const addOption = (sectionIndex: number, qIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].options.push({
      value: "",
      nextSection: null,
    });
    setSections(newSections);
  };

  const removeQuestion = (sectionIndex: number, qIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(qIndex, 1);
    setSections(newSections);
  };

  const removeOption = (
    sectionIndex: number,
    qIndex: number,
    lIndex: number | null,
    oIndex: number
  ) => {
    const newSections = [...sections];
    if (lIndex !== null) {
      newSections[sectionIndex].questions[qIndex].likertQuestions[
        lIndex
      ].options.splice(oIndex, 1);
    } else {
      newSections[sectionIndex].questions[qIndex].options.splice(oIndex, 1);
    }

    setSections(newSections);
  };

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

    for (const section of sections) {
      for (const question of section.questions) {
        if (!question.question.trim()) {
          toast.error("All questions must have a valid text.");
          return;
        }

        if (
          (question.type === "multiple-choice" ||
            question.type === "single-choice") &&
          (question.options.length === 0 ||
            question.options.some((option) => !option.value.trim()))
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

        // Additional check: Ensure text questions do not have options or likertQuestions
        if (question.type === "text") {
          if (
            question.options.length > 0 ||
            question.likertQuestions.length > 0
          ) {
            toast.error(
              "Text questions should not have options or Likert questions."
            );
            return;
          }
        }
      }
    }

    // Clean sections to ensure text questions don't have options or likertQuestions
    const cleanedSections = sections.map((section) => {
      const cleanedQuestions = section.questions.map((question) => {
        if (question.type === "text") {
          return { ...question, options: [], likertQuestions: [] };
        } else if (question.type !== "likert-scale") {
          return { ...question, likertQuestions: [] };
        }
        return question;
      });
      return { ...section, questions: cleanedQuestions };
    });

    const surveyData = {
      title,
      subtitle,
      sections: cleanedSections,
      // sections
    };
    setIsSubmitting(true);
    try {
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
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      console.log("Survey submitted successfully:", data);
      toast("Survey submitted successfully!");

      setTitle("");
      setSubtitle("");
      setSections([]);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("An error occurred while submitting the survey.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-6">
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
          />
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-4 p-4 border rounded-md">
              <label className="block mb-2 font-medium">Section Title:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                value={section.title}
                onChange={(e) =>
                  handleSectionTitleChange(sectionIndex, e.target.value)
                }
              />
              {section.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-4">
                  <label className="block mb-2 font-medium">
                    Question {qIndex + 1}:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4"
                    value={q.question}
                    onChange={(e) =>
                      handleSectionQuestionChange(
                        sectionIndex,
                        qIndex,
                        e.target.value
                      )
                    }
                  />
                  <label className="block mb-2 font-medium">
                    Select Question Type:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md mb-4"
                    value={q.type}
                    onChange={(e) =>
                      handleSectionQuestionTypeChange(
                        sectionIndex,
                        qIndex,
                        e.target.value as
                          | "likert-scale"
                          | "multiple-choice"
                          | "single-choice"
                          | "text"
                          | "record-audio"
                          | "record-video"
                          | "take-picture"
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
                                sectionIndex,
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
                                    sectionIndex,
                                    qIndex,
                                    oIndex,
                                    e.target.value,
                                    null
                                  )
                                }
                              />
                            ))}
                          </div>

                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                            onClick={() => addOption(sectionIndex, qIndex)} // Removed lIndex
                          >
                            + Add Option
                          </button>
                        </div>
                      ))}
                      <button
                        className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
                        onClick={() => addLikertQuestion(sectionIndex, qIndex)}
                      >
                        + Add Likert Scale Question
                      </button>
                    </div>
                  )}
                  {(q.type === "multiple-choice" ||
                    q.type === "single-choice") && (
                    <div>
                      <label className="block mb-2 font-medium">
                        {q.type === "multiple-choice"
                          ? "Multiple Choice"
                          : "Single Choice"}{" "}
                        Options:
                      </label>
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex}>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md mb-2"
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(
                                sectionIndex,
                                qIndex,
                                oIndex,
                                e.target.value,
                                option.nextSection
                              )
                            }
                          />
                          <label className="block mb-2 font-medium">
                            Next Section:
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded-md mb-2"
                            value={option.nextSection || ""}
                            onChange={(e) =>
                              handleOptionChange(
                                sectionIndex,
                                qIndex,
                                oIndex,
                                option.value,
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <button
                            className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
                            onClick={() =>
                              removeOption(
                                sectionIndex,

                                qIndex,
                                null,
                                oIndex
                              )
                            }
                          >
                            Remove Option
                          </button>
                        </div>
                      ))}

                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                        onClick={() => addOption(sectionIndex, qIndex)} // Removed lIndex
                      >
                        + Add Option
                      </button>
                    </div>
                  )}

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

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded mt-4 w-full"
                    onClick={() => removeQuestion(sectionIndex, qIndex)}
                  >
                    Delete Question
                  </button>
                </div>
              ))}

              <button
                className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
                onClick={() => addQuestionToSection(sectionIndex)}
              >
                + Add Question
              </button>
            </div>
          ))}

          <button
            className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={addSection}
          >
            + Add Section
          </button>

          <button
            onClick={saveFormAsDraft}
            className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Save as Draft
          </button>
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

//working ends

// "use client";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { toast } from "react-toastify";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface LikertQuestion {
//   question: string;
//   options: string[];
// }

// interface Question {
//   question: string;
//   type:
//     | "likert-scale"
//     | "multiple-choice"
//     | "single-choice"
//     | "text"
//     | "record-audio"
//     | "record-video"
//     | "take-picture";
//   options: string[];
//   likertQuestions: LikertQuestion[];
//   sections: { [option: string]: Question[] };  // New sections property

// }

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       question: "Question 1",
//       type: "likert-scale",
//       options: [],
//       likertQuestions: [],
//       sections: {},  // Initialize sections property
//     },
//   ]);
//   //   const [mediaInstruction, setMediaInstruction] = useState("");
//   //   const [mediaType, setMediaType] = useState("");

//   const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
//   const [isAutoSaving, setIsAutoSaving] = useState(false); // State to track auto-saving status

//   // {
//   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
//   // }

//   // {
//   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
//   // }
//   {isAutoSaving && <p className="text-gray-500">Auto-saving...</p>}

//   // let typingTimeout: NodeJS.Timeout;
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

//   // Save form data to localStorage
//   const saveFormAsDraft = () => {
//     const formData = {
//       title,
//       subtitle,
//       questions,
//     };
//     localStorage.setItem("formDraft", JSON.stringify(formData));
//     toast("Form saved as draft!");
//   };

//   const handleTyping = () => {
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);

//     typingTimeout.current = setTimeout(() => {
//       setIsAutoSaving(true);
//       saveFormAsDraft();
//       setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
//     }, 1000);
//   };

//   // const handleTyping = () => {
//   //   clearTimeout(typingTimeout); // Clear previous timeout

//   //   //test

//   //   // Set a new timeout to save after a delay (e.g., 1 second of idle time)
//   //   typingTimeout = setTimeout(() => {
//   //     setIsAutoSaving(true); // Show the "Auto-saving..." indicator
//   //     saveFormAsDraft(); // Auto-save after pause
//   //     setIsAutoSaving(false); // Hide the "Auto-saving..." indicator
//   //   }, 1000); // Adjust the debounce time as needed
//   // };

//   // Load saved form data from localStorage
//   const loadFormFromDraft = () => {
//     const savedForm = localStorage.getItem("formDraft");
//     if (savedForm) {
//       const parsedData = JSON.parse(savedForm);
//       setTitle(parsedData.title);
//       setSubtitle(parsedData.subtitle);
//       setQuestions(parsedData.questions);
//     }
//   };

//   // Load form data when the component mounts (on page load)
//   useEffect(() => {
//     loadFormFromDraft();
//   }, []);

//   // Add a new main question
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: `Question ${questions.length + 1}`,
//         type: "likert-scale", // default question type can be any, e.g., likert-scale
//         options: [],
//         likertQuestions: [],
//         sections: {},  // Initialize sections property
//       },
//     ]);
//   };

//   // Handle changing main question text
//   const handleMainQuestionChange = (index: number, value: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//     handleTyping(); // Trigger typing handler when the user types
//   };

//   const handleQuestionTypeChange = (
//     index: number,
//     type:
//       | "likert-scale"
//       | "multiple-choice"
//       | "single-choice"
//       | "text"
//       | "record-audio"
//       | "record-video"
//       | "take-picture"
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;

//     // Reset media flags
//     setAllowAudio(false);
//     setAllowVideo(false);
//     setAllowImage(false);

//     // Update based on selection
//     if (type === "record-audio") {
//       setAllowAudio(true);
//     } else if (type === "record-video") {
//       setAllowVideo(true);
//     } else if (type === "take-picture") {
//       setAllowImage(true);
//     }

//     // Ensure only relevant fields are retained
//     if (type === "likert-scale") {
//       newQuestions[index].options = [];
//       newQuestions[index].likertQuestions = [
//         { question: "", options: ["", "", "", "", ""] },
//       ];
//     } else if (type === "multiple-choice" || type === "single-choice") {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = ["", ""];
//     } else {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = [];
//     }

//     setQuestions(newQuestions);
//   };

//   // Add a new Likert scale question under a main question
//   const addLikertQuestion = (qIndex: number) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions.push({
//       question: "",
//       options: ["", "", "", "", ""],
//     });
//     setQuestions(newQuestions);
//   };

//   // Handle changing Likert scale question text
//   const handleLikertQuestionChange = (
//     qIndex: number,
//     lIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions[lIndex].question = value;
//     setQuestions(newQuestions);
//   };

//   // Handle changing Likert scale options
//   const handleOptionChange = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
//     } else {
//       newQuestions[qIndex].options[oIndex] = value;
//     }
//     setQuestions(newQuestions);
//   };

//   // Add another option for a Likert scale question
//   const addOption = (qIndex: number, lIndex: number | null) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option for Likert scale
//     } else {
//       newQuestions[qIndex].options.push(""); // Add an empty option for other types
//     }
//     setQuestions(newQuestions);
//   };

//   // Remove an option for multiple-choice or single-choice question
//   const removeOption = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1); // Remove option from Likert scale
//     } else {
//       newQuestions[qIndex].options.splice(oIndex, 1); // Remove option from multiple-choice or single-choice
//     }
//     setQuestions(newQuestions);
//   };
//   const addSection = (qIndex: number, option: string) => {
//     const newQuestions = [...questions];
//     if (!newQuestions[qIndex].sections[option]) {
//       newQuestions[qIndex].sections[option] = [];
//     }
//     newQuestions[qIndex].sections[option].push({
//       question: "",
//       type: "text",
//       options: [],
//       likertQuestions: [],
//       sections: {},
//     });
//     setQuestions(newQuestions);
//   };

//   const handleSectionQuestionChange = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].question = value;
//     setQuestions(newQuestions);
//   };

//   const handleSectionQuestionTypeChange = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     type: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].type = type;
//     setQuestions(newQuestions);
//   };

//   // // Remove a question
//   // const removeQuestion = (qIndex: number) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions.splice(qIndex, 1); // Remove the question at the specified index
//   //   setQuestions(newQuestions);
//   // };

//   const [allowAudio, setAllowAudio] = useState(false);
//   const [allowVideo, setAllowVideo] = useState(false);
//   const [allowImage, setAllowImage] = useState(false);

//   // POST request to submit the survey data
//   const handleSubmitSurvey = async () => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole !== "admin") {
//       alert("You are not authorized to perform this action.");
//       return;
//     }

//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       alert("Access token is missing.");
//       return;
//     }

//     // Validation check ends
//     for (const question of questions) {
//       if (!question.question.trim()) {
//         toast.error("All questions must have a valid text.");
//         return;
//       }

//       if (
//         (question.type === "multiple-choice" ||
//           question.type === "single-choice") &&
//         (question.options.length === 0 ||
//           question.options.some((option) => !option.trim()))
//       ) {
//         toast.error(
//           "Multiple-choice and single-choice questions must have at least one non-empty option."
//         );
//         return;
//       }

//       if (
//         question.type === "likert-scale" &&
//         question.likertQuestions.length === 0
//       ) {
//         toast.error(
//           "Likert scale questions must contain at least one sub-question."
//         );
//         return;
//       }
//     }

//     //validation check ends
//     const surveyData = {
//       title,
//       subtitle,
//       questions,
//       //   mediaInstruction,
//       //   mediaType,
//       allowAudio, // Now included at the survey level
//       allowVideo, // Now included at the survey level
//       allowImage, // Now included at the survey level
//     };

//     setIsSubmitting(true); // Set submitting state to true when submission starts
//     try {
//       const response = await fetch(`${API_BASE_URL}/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(surveyData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         setIsSubmitting(false); // Reset submitting state in case of error
//         return;
//       }

//       const data = await response.json();
//       console.log("Survey submitted successfully:", data);
//       toast("Survey submitted successfully!");

//       // Clear the form after successful submission
//       setTitle("");
//       setSubtitle("");
//       setQuestions([
//         {
//           question: "Question 1",
//           type: "likert-scale",
//           options: [],
//           likertQuestions: [],
//           sections: {},  // Initialize sections
//         },
//       ]);
//       setIsSubmitting(false); // Reset submitting state after clearing form
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
//       setIsSubmitting(false); // Reset submitting state in case of error
//     }
//   };

//   return (
//     <div className="relative p-6">
//       {/* Logo at the Top Right */}
//       <div className="absolute top-4 right-6">
//         <Image
//           src="/digiplus.png"
//           alt="Company Logo"
//           width={120}
//           height={50}
//           priority
//         />
//       </div>

//       <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
//       <button
//         className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
//         onClick={() => setIsFormOpen(!isFormOpen)}
//       >
//         {isFormOpen ? "Close Form" : "Create New Survey"}
//       </button>

//       {isFormOpen && (
//         <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
//           <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

//           <label className="block mb-2 font-medium">Survey Title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey title"
//             value={title}
//             // onChange={(e) => setTitle(e.target.value)}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               handleTyping();
//             }}
//           />

//           <label className="block mb-2 font-medium">Survey Sub-title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey sub-title"
//             value={subtitle}
//             onChange={(e) => {
//               setSubtitle(e.target.value);
//               handleTyping();
//             }}
//             // onChange={(e) => setSubtitle(e.target.value)}
//           />
//           {/* <input
//             type="text"
//             value={subtitle}
//             onChange={(e) => {
//               setSubtitle(e.target.value);
//               handleTyping();
//             }}
//             placeholder="Survey Subtitle"
//           /> */}

//           {questions.map((q, qIndex) => (
//             <div key={qIndex} className="border-b pb-4 mb-4">
//               {/* Main question */}
//               <label className="block mb-2 font-medium">{q.question}</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.question}
//                 onChange={(e) =>
//                   handleMainQuestionChange(qIndex, e.target.value)
//                 }
//               />

//               {/* Question Type Dropdown */}
//               <label className="block mb-2 font-medium">
//                 Select Question Type:
//               </label>
//               <select
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.type}
//                 onChange={(e) =>
//                   handleQuestionTypeChange(
//                     qIndex,
//                     e.target.value as
//                       | "likert-scale"
//                       | "multiple-choice"
//                       | "single-choice"
//                       | "text"
//                   )
//                 }
//               >
//                 <option value="likert-scale">Likert Scale</option>
//                 <option value="multiple-choice">Multiple Choice</option>
//                 <option value="single-choice">Single Choice</option>
//                 <option value="text">Text</option>
//                 <option value="record-audio">Record Audio</option>
//                 <option value="record-video">Record Video</option>
//                 <option value="take-picture">Take Picture</option>
//               </select>

//               {/* Show Likert scale questions if selected */}
//               {q.type === "likert-scale" && (
//                 <div>
//                   {q.likertQuestions.map((likertQ, lIndex) => (
//                     <div key={lIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Likert Question {lIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={likertQ.question}
//                         onChange={(e) =>
//                           handleLikertQuestionChange(
//                             qIndex,
//                             lIndex,
//                             e.target.value
//                           )
//                         }
//                       />

//                       <label className="block mb-2 font-medium">
//                         Likert Scale Options:
//                       </label>
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {likertQ.options.map((option, oIndex) => (
//                           <input
//                             key={oIndex}
//                             type="text"
//                             className="w-1/5 p-2 border rounded-md"
//                             value={option}
//                             onChange={(e) =>
//                               handleOptionChange(
//                                 qIndex,
//                                 lIndex,
//                                 oIndex,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         ))}
//                       </div>
//                       <button
//                         className="bg-green-500 text-white px-3 py-1 rounded mt-2"
//                         onClick={() => addOption(qIndex, lIndex)}
//                       >
//                         + Add Option
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
//                     onClick={() => addLikertQuestion(qIndex)}
//                   >
//                     + Add Another Likert Scale Question
//                   </button>
//                 </div>
//               )}

//               {/* Show Multiple-Choice or Single-Choice */}
//               {(q.type === "multiple-choice" || q.type === "single-choice") && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     {q.type === "multiple-choice"
//                       ? "Multiple Choice"
//                       : "Single Choice"}{" "}
//                     Options:
//                   </label>
//                   {q.options.map((option, oIndex) => (
//                     // <input
//                     //   key={oIndex}
//                     //   type="text"
//                     //   className="w-full p-2 border rounded-md mb-2"
//                     //   value={option}
//                     //   onChange={(e) =>
//                     //     handleOptionChange(qIndex, null, oIndex, e.target.value)
//                     //   }
//                     // />
//                     <div key={oIndex}>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-2"
//                         value={option}
//                         onChange={(e) =>
//                           handleOptionChange(qIndex, null, oIndex, e.target.value)
//                         }
//                       />
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//                         onClick={() => addSection(qIndex, option)}
//                       >
//                         Add Section for {option}
//                       </button>
//                     </div>
//                   ))}
//                   {/* <button onClick={() => removeOption(qIndex, null, oIndex)}>Remove Option</button> */}
//                   <button
//                     onClick={() => addOption(qIndex, null)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 "
//                   >
//                     Add Option
//                   </button>{" "}
//                   <button
//                     onClick={() => removeOption(qIndex, null, qIndex)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
//                   >
//                     Remove Option
//                   </button>
//                 </div>
//               )}

//               {/* Show Text input for Text Question */}
//               {q.type === "text" && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     Text Response:
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md"
//                     placeholder="Enter your answer"
//                     disabled
//                   />
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Show linked sections */}
//           {Object.keys(q.sections).map((option, sIndex) => (
//                 <div key={sIndex} className="mt-4 p-4 border rounded-md">
//                   <h4 className="font-semibold mb-2">
//                     Section for option: {option}
//                   </h4>
//                   {q.sections[option].map((sectionQuestion, sqIndex) => (
//                     <div key={sqIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Section Question {sqIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-2"
//                         value={sectionQuestion.question}
//                         onChange={(e) =>
//                           handleSectionQuestionChange(qIndex, option, sqIndex, e.target.value)
//                         }
//                       />
//                       <select
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={sectionQuestion.type}
//                         onChange={(e) =>
//                           handleSectionQuestionTypeChange(qIndex, option, sqIndex, e.target.value)
//                         }
//                       >
//                         <option value="text">Text</option>
//                         <option value="multiple-choice">Multiple Choice</option>
//                         <option value="single-choice">Single Choice</option>
//                         <option value="likert-scale">Likert Scale</option>
//                         <option value="record-audio">Record Audio</option>
//                         <option value="record-video">Record Video</option>
//                         <option value="take-picture">Take Picture</option>
//                       </select>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}

//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={addQuestion}
//           >
//             + Add Another Question
//           </button>

//           {/* Submit Button */}

//           <button
//             onClick={saveFormAsDraft}
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//           >
//             Save as Draft
//           </button>
//           {/* <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Submit Survey"}
//           </button> */}

//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={handleSubmitSurvey}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Survey"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

//new starts

//new ends

// "use client";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { toast } from "react-toastify";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface LikertQuestion {
//   question: string;
//   options: string[];
// }

// interface Question {
//   question: string;
//   type:
//     | "likert-scale"
//     | "multiple-choice"
//     | "single-choice"
//     | "text"
//     | "record-audio"
//     | "record-video"
//     | "take-picture";
//   options: string[];
//   likertQuestions: LikertQuestion[];
// }

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       question: "Question 1",
//       type: "likert-scale",
//       options: [],
//       likertQuestions: [],
//     },
//   ]);
//   //   const [mediaInstruction, setMediaInstruction] = useState("");
//   //   const [mediaType, setMediaType] = useState("");

//   const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
//   const [isAutoSaving, setIsAutoSaving] = useState(false); // State to track auto-saving status

//   // {
//   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
//   // }

//   // {
//   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
//   // }
//   {isAutoSaving && <p className="text-gray-500">Auto-saving...</p>}

//   // let typingTimeout: NodeJS.Timeout;
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

//   // Save form data to localStorage
//   const saveFormAsDraft = () => {
//     const formData = {
//       title,
//       subtitle,
//       questions,
//     };
//     localStorage.setItem("formDraft", JSON.stringify(formData));
//     toast("Form saved as draft!");
//   };

//   const handleTyping = () => {
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);

//     typingTimeout.current = setTimeout(() => {
//       setIsAutoSaving(true);
//       saveFormAsDraft();
//       setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
//     }, 1000);
//   };

//   // const handleTyping = () => {
//   //   clearTimeout(typingTimeout); // Clear previous timeout

//   //   //test

//   //   // Set a new timeout to save after a delay (e.g., 1 second of idle time)
//   //   typingTimeout = setTimeout(() => {
//   //     setIsAutoSaving(true); // Show the "Auto-saving..." indicator
//   //     saveFormAsDraft(); // Auto-save after pause
//   //     setIsAutoSaving(false); // Hide the "Auto-saving..." indicator
//   //   }, 1000); // Adjust the debounce time as needed
//   // };

//   // Load saved form data from localStorage
//   const loadFormFromDraft = () => {
//     const savedForm = localStorage.getItem("formDraft");
//     if (savedForm) {
//       const parsedData = JSON.parse(savedForm);
//       setTitle(parsedData.title);
//       setSubtitle(parsedData.subtitle);
//       setQuestions(parsedData.questions);
//     }
//   };

//   // Load form data when the component mounts (on page load)
//   useEffect(() => {
//     loadFormFromDraft();
//   }, []);

//   // Add a new main question
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: `Question ${questions.length + 1}`,
//         type: "likert-scale", // default question type can be any, e.g., likert-scale
//         options: [],
//         likertQuestions: [],
//       },
//     ]);
//   };

//   // Handle changing main question text
//   const handleMainQuestionChange = (index: number, value: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//     handleTyping(); // Trigger typing handler when the user types
//   };

//   const handleQuestionTypeChange = (
//     index: number,
//     type:
//       | "likert-scale"
//       | "multiple-choice"
//       | "single-choice"
//       | "text"
//       | "record-audio"
//       | "record-video"
//       | "take-picture"
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;

//     // Reset media flags
//     setAllowAudio(false);
//     setAllowVideo(false);
//     setAllowImage(false);

//     // Update based on selection
//     if (type === "record-audio") {
//       setAllowAudio(true);
//     } else if (type === "record-video") {
//       setAllowVideo(true);
//     } else if (type === "take-picture") {
//       setAllowImage(true);
//     }

//     // Ensure only relevant fields are retained
//     if (type === "likert-scale") {
//       newQuestions[index].options = [];
//       newQuestions[index].likertQuestions = [
//         { question: "", options: ["", "", "", "", ""] },
//       ];
//     } else if (type === "multiple-choice" || type === "single-choice") {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = ["", ""];
//     } else {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = [];
//     }

//     setQuestions(newQuestions);
//   };

//   // Add a new Likert scale question under a main question
//   const addLikertQuestion = (qIndex: number) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions.push({
//       question: "",
//       options: ["", "", "", "", ""],
//     });
//     setQuestions(newQuestions);
//   };

//   // Handle changing Likert scale question text
//   const handleLikertQuestionChange = (
//     qIndex: number,
//     lIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions[lIndex].question = value;
//     setQuestions(newQuestions);
//   };

//   // Handle changing Likert scale options
//   const handleOptionChange = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
//     } else {
//       newQuestions[qIndex].options[oIndex] = value;
//     }
//     setQuestions(newQuestions);
//   };

//   // Add another option for a Likert scale question
//   const addOption = (qIndex: number, lIndex: number | null) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option for Likert scale
//     } else {
//       newQuestions[qIndex].options.push(""); // Add an empty option for other types
//     }
//     setQuestions(newQuestions);
//   };

//   // Remove an option for multiple-choice or single-choice question
//   const removeOption = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1); // Remove option from Likert scale
//     } else {
//       newQuestions[qIndex].options.splice(oIndex, 1); // Remove option from multiple-choice or single-choice
//     }
//     setQuestions(newQuestions);
//   };

//   // // Remove a question
//   // const removeQuestion = (qIndex: number) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions.splice(qIndex, 1); // Remove the question at the specified index
//   //   setQuestions(newQuestions);
//   // };

//   const [allowAudio, setAllowAudio] = useState(false);
//   const [allowVideo, setAllowVideo] = useState(false);
//   const [allowImage, setAllowImage] = useState(false);

//   // POST request to submit the survey data
//   const handleSubmitSurvey = async () => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole !== "admin") {
//       alert("You are not authorized to perform this action.");
//       return;
//     }

//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       alert("Access token is missing.");
//       return;
//     }

//     // Validation check ends
//     for (const question of questions) {
//       if (!question.question.trim()) {
//         toast.error("All questions must have a valid text.");
//         return;
//       }

//       if (
//         (question.type === "multiple-choice" ||
//           question.type === "single-choice") &&
//         (question.options.length === 0 ||
//           question.options.some((option) => !option.trim()))
//       ) {
//         toast.error(
//           "Multiple-choice and single-choice questions must have at least one non-empty option."
//         );
//         return;
//       }

//       if (
//         question.type === "likert-scale" &&
//         question.likertQuestions.length === 0
//       ) {
//         toast.error(
//           "Likert scale questions must contain at least one sub-question."
//         );
//         return;
//       }
//     }

//     //validation check ends
//     const surveyData = {
//       title,
//       subtitle,
//       questions,
//       //   mediaInstruction,
//       //   mediaType,
//       allowAudio, // Now included at the survey level
//       allowVideo, // Now included at the survey level
//       allowImage, // Now included at the survey level
//     };

//     setIsSubmitting(true); // Set submitting state to true when submission starts
//     try {
//       const response = await fetch(`${API_BASE_URL}/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(surveyData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         setIsSubmitting(false); // Reset submitting state in case of error
//         return;
//       }

//       const data = await response.json();
//       console.log("Survey submitted successfully:", data);
//       toast("Survey submitted successfully!");

//       // Clear the form after successful submission
//       setTitle("");
//       setSubtitle("");
//       setQuestions([
//         {
//           question: "Question 1",
//           type: "likert-scale",
//           options: [],
//           likertQuestions: [],
//         },
//       ]);
//       setIsSubmitting(false); // Reset submitting state after clearing form
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
//       setIsSubmitting(false); // Reset submitting state in case of error
//     }
//   };

//   return (
//     <div className="relative p-6">
//       {/* Logo at the Top Right */}
//       <div className="absolute top-4 right-6">
//         <Image
//           src="/digiplus.png"
//           alt="Company Logo"
//           width={120}
//           height={50}
//           priority
//         />
//       </div>

//       <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
//       <button
//         className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
//         onClick={() => setIsFormOpen(!isFormOpen)}
//       >
//         {isFormOpen ? "Close Form" : "Create New Survey"}
//       </button>

//       {isFormOpen && (
//         <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
//           <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

//           <label className="block mb-2 font-medium">Survey Title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey title"
//             value={title}
//             // onChange={(e) => setTitle(e.target.value)}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               handleTyping();
//             }}
//           />

//           <label className="block mb-2 font-medium">Survey Sub-title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey sub-title"
//             value={subtitle}
//             onChange={(e) => {
//               setSubtitle(e.target.value);
//               handleTyping();
//             }}
//             // onChange={(e) => setSubtitle(e.target.value)}
//           />
//           {/* <input
//             type="text"
//             value={subtitle}
//             onChange={(e) => {
//               setSubtitle(e.target.value);
//               handleTyping();
//             }}
//             placeholder="Survey Subtitle"
//           /> */}

//           {questions.map((q, qIndex) => (
//             <div key={qIndex} className="border-b pb-4 mb-4">
//               {/* Main question */}
//               <label className="block mb-2 font-medium">{q.question}</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.question}
//                 onChange={(e) =>
//                   handleMainQuestionChange(qIndex, e.target.value)
//                 }
//               />

//               {/* Question Type Dropdown */}
//               <label className="block mb-2 font-medium">
//                 Select Question Type:
//               </label>
//               <select
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.type}
//                 onChange={(e) =>
//                   handleQuestionTypeChange(
//                     qIndex,
//                     e.target.value as
//                       | "likert-scale"
//                       | "multiple-choice"
//                       | "single-choice"
//                       | "text"
//                   )
//                 }
//               >
//                 <option value="likert-scale">Likert Scale</option>
//                 <option value="multiple-choice">Multiple Choice</option>
//                 <option value="single-choice">Single Choice</option>
//                 <option value="text">Text</option>
//                 <option value="record-audio">Record Audio</option>
//                 <option value="record-video">Record Video</option>
//                 <option value="take-picture">Take Picture</option>
//               </select>

//               {/* Show Likert scale questions if selected */}
//               {q.type === "likert-scale" && (
//                 <div>
//                   {q.likertQuestions.map((likertQ, lIndex) => (
//                     <div key={lIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Likert Question {lIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={likertQ.question}
//                         onChange={(e) =>
//                           handleLikertQuestionChange(
//                             qIndex,
//                             lIndex,
//                             e.target.value
//                           )
//                         }
//                       />

//                       <label className="block mb-2 font-medium">
//                         Likert Scale Options:
//                       </label>
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {likertQ.options.map((option, oIndex) => (
//                           <input
//                             key={oIndex}
//                             type="text"
//                             className="w-1/5 p-2 border rounded-md"
//                             value={option}
//                             onChange={(e) =>
//                               handleOptionChange(
//                                 qIndex,
//                                 lIndex,
//                                 oIndex,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         ))}
//                       </div>
//                       <button
//                         className="bg-green-500 text-white px-3 py-1 rounded mt-2"
//                         onClick={() => addOption(qIndex, lIndex)}
//                       >
//                         + Add Option
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
//                     onClick={() => addLikertQuestion(qIndex)}
//                   >
//                     + Add Another Likert Scale Question
//                   </button>
//                 </div>
//               )}

//               {/* Show Multiple-Choice or Single-Choice */}
//               {(q.type === "multiple-choice" || q.type === "single-choice") && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     {q.type === "multiple-choice"
//                       ? "Multiple Choice"
//                       : "Single Choice"}{" "}
//                     Options:
//                   </label>
//                   {q.options.map((option, oIndex) => (
//                     <input
//                       key={oIndex}
//                       type="text"
//                       className="w-full p-2 border rounded-md mb-2"
//                       value={option}
//                       onChange={(e) =>
//                         handleOptionChange(qIndex, null, oIndex, e.target.value)
//                       }
//                     />
//                   ))}
//                   {/* <button onClick={() => removeOption(qIndex, null, oIndex)}>Remove Option</button> */}
//                   <button
//                     onClick={() => addOption(qIndex, null)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 "
//                   >
//                     Add Option
//                   </button>{" "}
//                   <button
//                     onClick={() => removeOption(qIndex, null, qIndex)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
//                   >
//                     Remove Option
//                   </button>
//                 </div>
//               )}

//               {/* Show Text input for Text Question */}
//               {q.type === "text" && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     Text Response:
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md"
//                     placeholder="Enter your answer"
//                     disabled
//                   />
//                 </div>
//               )}
//             </div>
//           ))}

//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={addQuestion}
//           >
//             + Add Another Question
//           </button>

//           {/* Submit Button */}

//           <button
//             onClick={saveFormAsDraft}
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//           >
//             Save as Draft
//           </button>
//           {/* <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Submit Survey"}
//           </button> */}

//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={handleSubmitSurvey}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Survey"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { toast } from "react-toastify";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface LikertQuestion {
//   question: string;
//   options: string[];
// }

// interface Question {
//   question: string;
//   type:
//     | "likert-scale"
//     | "multiple-choice"
//     | "single-choice"
//     | "text"
//     | "record-audio"
//     | "record-video"
//     | "take-picture";
//   options: string[];
//   likertQuestions: LikertQuestion[];
//   sections: { [option: string]: Question[] }; // New sections property
// }

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       question: "Question 1",
//       type: "likert-scale",
//       options: [],
//       likertQuestions: [],
//       sections: {}, // Initialize sections property
//     },
//   ]);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAutoSaving, setIsAutoSaving] = useState(false);

//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

//   const saveFormAsDraft = () => {
//     const formData = {
//       title,
//       subtitle,
//       questions,
//     };
//     localStorage.setItem("formDraft", JSON.stringify(formData));
//     toast("Form saved as draft!");
//   };

//   const handleTyping = () => {
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);

//     typingTimeout.current = setTimeout(() => {
//       setIsAutoSaving(true);
//       // saveFormAsDraft();
//       setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
//     }, 1000);
//   };

//   const loadFormFromDraft = () => {
//     const savedForm = localStorage.getItem("formDraft");
//     if (savedForm) {
//       const parsedData = JSON.parse(savedForm);
//       setTitle(parsedData.title);
//       setSubtitle(parsedData.subtitle);
//       setQuestions(parsedData.questions);
//     }
//   };

//   useEffect(() => {
//     loadFormFromDraft();
//   }, []);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: `Question ${questions.length + 1}`,
//         type: "likert-scale",
//         options: [],
//         likertQuestions: [],
//         sections: {}, // Initialize sections property
//       },
//     ]);
//   };

//   const handleMainQuestionChange = (index: number, value: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//     handleTyping();
//   };

//   const handleQuestionTypeChange = (
//     index: number,
//     type:
//       | "likert-scale"
//       | "multiple-choice"
//       | "single-choice"
//       | "text"
//       | "record-audio"
//       | "record-video"
//       | "take-picture"
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;

//     setAllowAudio(false);
//     setAllowVideo(false);
//     setAllowImage(false);

//     if (type === "record-audio") {
//       setAllowAudio(true);
//     } else if (type === "record-video") {
//       setAllowVideo(true);
//     } else if (type === "take-picture") {
//       setAllowImage(true);
//     }

//     if (type === "likert-scale") {
//       newQuestions[index].options = [];
//       newQuestions[index].likertQuestions = [
//         { question: "", options: ["", "", "", "", ""] },
//       ];
//     } else if (type === "multiple-choice" || type === "single-choice") {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = [""];
//       // newQuestions[index].options = ["", ""];
//     } else {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = [];
//     }

//     setQuestions(newQuestions);
//   };

//   const addLikertQuestion = (qIndex: number) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions.push({
//       question: "",
//       options: ["", "", "", "", ""],
//     });
//     setQuestions(newQuestions);
//   };

//   const handleLikertQuestionChange = (
//     qIndex: number,
//     lIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions[lIndex].question = value;
//     setQuestions(newQuestions);
//   };

//   const handleOptionChange = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
//     } else {
//       newQuestions[qIndex].options[oIndex] = value;
//     }
//     setQuestions(newQuestions);
//   };

//   const addOption = (qIndex: number, lIndex: number | null) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.push("");
//     } else {
//       newQuestions[qIndex].options.push("");
//     }
//     setQuestions(newQuestions);
//   };

//   const removeOption = (
//     qIndex: number,
//     lIndex: number | null,
//     oIndex: number
//   ) => {
//     const newQuestions = [...questions];
//     if (lIndex !== null) {
//       newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1);
//     } else {
//       newQuestions[qIndex].options.splice(oIndex, 1);
//     }
//     setQuestions(newQuestions);
//   };

//   //section
//   const addSectionOption = (qIndex: number, option: string, sIndex: number) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].options.push("");
//     setQuestions(newQuestions);
//   };

//   // const handleSectionOptionChange = (
//   //   qIndex: number,
//   //   option: string,
//   //   sIndex: number,
//   //   oIndex: number,
//   //   value: string
//   // ) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[qIndex].sections[option][sIndex].options[oIndex] = value;
//   //   setQuestions(newQuestions);
//   // };
//   const handleSectionOptionChange = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];

//     console.log("qIndex:", qIndex);
//     console.log("option:", option);
//     console.log("sIndex:", sIndex);
//     console.log("oIndex:", oIndex);
//     console.log("newQuestions:", newQuestions);

//     // Ensure the question, section, and option indices are valid
//     if (
//       newQuestions[qIndex] &&
//       newQuestions[qIndex].sections[option] &&
//       newQuestions[qIndex].sections[option][sIndex] &&
//       newQuestions[qIndex].sections[option][sIndex].options[oIndex] !==
//         undefined
//     ) {
//       newQuestions[qIndex].sections[option][sIndex].options[oIndex] = value;
//       setQuestions(newQuestions);
//     } else {
//       console.error("Invalid indices for section option change");
//     }
//   };

//   const removeSectionOption = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     oIndex: number
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].options.splice(oIndex, 1);
//     setQuestions(newQuestions);
//   };

//   const addSection = (qIndex: number, option: string) => {
//     const newQuestions = [...questions];

//     if (!newQuestions[qIndex].sections[option]) {
//       newQuestions[qIndex].sections[option] = [];
//     }
//     newQuestions[qIndex].sections[option].push({
//       question: "",
//       type: "text",
//       options: [],
//       likertQuestions: [],
//       sections: {},
//     });
//     setQuestions(newQuestions);
//   };

//   const handleSectionQuestionChange = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].question = value;
//     setQuestions(newQuestions);
//   };

//   const handleSectionQuestionTypeChange = (
//     qIndex: number,
//     option: string,
//     sIndex: number,
//     type: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].sections[option][sIndex].type =
//       type as Question["type"];
//     // newQuestions[qIndex].sections[option][sIndex].type = type;
//     setQuestions(newQuestions);
//   };

//   const [allowAudio, setAllowAudio] = useState(false);
//   const [allowVideo, setAllowVideo] = useState(false);
//   const [allowImage, setAllowImage] = useState(false);

//   const handleSubmitSurvey = async () => {
//     const userRole = localStorage.getItem("userRole");
//     if (userRole !== "admin") {
//       alert("You are not authorized to perform this action.");
//       return;
//     }

//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       alert("Access token is missing.");
//       return;
//     }

//     for (const question of questions) {
//       if (!question.question.trim()) {
//         toast.error("All questions must have a valid text.");
//         return;
//       }

//       if (
//         (question.type === "multiple-choice" ||
//           question.type === "single-choice") &&
//         (question.options.length === 0 ||
//           question.options.some((option) => !option.trim()))
//       ) {
//         toast.error(
//           "Multiple-choice and single-choice questions must have at least one non-empty option."
//         );
//         return;
//       }

//       if (
//         question.type === "likert-scale" &&
//         question.likertQuestions.length === 0
//       ) {
//         toast.error(
//           "Likert scale questions must contain at least one sub-question."
//         );
//         return;
//       }
//     }

//     const surveyData = {
//       title,
//       subtitle,
//       questions,
//       allowAudio,
//       allowVideo,
//       allowImage,
//     };

//     setIsSubmitting(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(surveyData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         setIsSubmitting(false);
//         return;
//       }

//       const data = await response.json();
//       console.log("Survey submitted successfully:", data);
//       toast("Survey submitted successfully!");

//       setTitle("");
//       setSubtitle("");
//       setQuestions([
//         {
//           question: "Question 1",
//           type: "likert-scale",
//           options: [],
//           likertQuestions: [],
//           sections: {}, // Initialize sections property
//         },
//       ]);
//       setIsSubmitting(false);
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
//       setIsSubmitting(false); // Reset submitting state in case of error
//     }
//   };

//   return (
//     <div className="relative p-6">
//       {/* Logo at the Top Right */}
//       <div className="absolute top-4 right-6">
//         <Image
//           src="/digiplus.png"
//           alt="Company Logo"
//           width={120}
//           height={50}
//           priority
//         />
//       </div>

//       <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
//       <button
//         className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
//         onClick={() => setIsFormOpen(!isFormOpen)}
//       >
//         {isFormOpen ? "Close Form" : "Create New Survey"}
//       </button>

//       {isFormOpen && (
//         <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
//           <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

//           <label className="block mb-2 font-medium">Survey Title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey title"
//             value={title}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               handleTyping();
//             }}
//           />

//           <label className="block mb-2 font-medium">Survey Sub-title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey sub-title"
//             value={subtitle}
//             onChange={(e) => {
//               setSubtitle(e.target.value);
//               handleTyping();
//             }}
//           />

//           {questions.map((q, qIndex) => (
//             <div key={qIndex} className="border-b pb-4 mb-4">
//               {/* Main question */}
//               <label className="block mb-2 font-medium">{q.question}</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.question}
//                 onChange={(e) =>
//                   handleMainQuestionChange(qIndex, e.target.value)
//                 }
//               />

//               {/* Question Type Dropdown */}
//               <label className="block mb-2 font-medium">
//                 Select Question Type:
//               </label>
//               <select
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.type}
//                 onChange={(e) =>
//                   handleQuestionTypeChange(
//                     qIndex,
//                     e.target.value as
//                       | "likert-scale"
//                       | "multiple-choice"
//                       | "single-choice"
//                       | "text"
//                   )
//                 }
//               >
//                 <option value="likert-scale">Likert Scale</option>
//                 <option value="multiple-choice">Multiple Choice</option>
//                 <option value="single-choice">Single Choice</option>
//                 <option value="text">Text</option>
//                 <option value="record-audio">Record Audio</option>
//                 <option value="record-video">Record Video</option>
//                 <option value="take-picture">Take Picture</option>
//               </select>

//               {/* Show Likert scale questions if selected */}
//               {q.type === "likert-scale" && (
//                 <div>
//                   {q.likertQuestions.map((likertQ, lIndex) => (
//                     <div key={lIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Likert Question {lIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={likertQ.question}
//                         onChange={(e) =>
//                           handleLikertQuestionChange(
//                             qIndex,
//                             lIndex,
//                             e.target.value
//                           )
//                         }
//                       />

//                       <label className="block mb-2 font-medium">
//                         Likert Scale Options:
//                       </label>
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {likertQ.options.map((option, oIndex) => (
//                           <input
//                             key={oIndex}
//                             type="text"
//                             className="w-1/5 p-2 border rounded-md"
//                             value={option}
//                             onChange={(e) =>
//                               handleOptionChange(
//                                 qIndex,
//                                 lIndex,
//                                 oIndex,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         ))}
//                       </div>
//                       <button
//                         className="bg-green-500 text-white px-3 py-1 rounded mt-2"
//                         onClick={() => addOption(qIndex, lIndex)}
//                       >
//                         + Add Option
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
//                     onClick={() => addLikertQuestion(qIndex)}
//                   >
//                     + Add Another Likert Scale Question
//                   </button>
//                 </div>
//               )}

//               {/* Show Multiple-Choice or Single-Choice */}
//               {(q.type === "multiple-choice" || q.type === "single-choice") && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     {q.type === "multiple-choice"
//                       ? "Multiple Choice"
//                       : "Single Choice"}{" "}
//                     Options:
//                   </label>
//                   {q.options.map((option, oIndex) => (
//                     <div key={oIndex}>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-2"
//                         value={option}
//                         onChange={(e) =>
//                           handleOptionChange(
//                             qIndex,
//                             null,
//                             oIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//                         onClick={() => addSection(qIndex, option)}
//                       >
//                         Add Section for {option}
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     onClick={() => addOption(qIndex, null)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2"
//                   >
//                     Add Option
//                   </button>
//                   <button
//                     onClick={() => removeOption(qIndex, null, qIndex)}
//                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
//                   >
//                     Remove Option
//                   </button>
//                 </div>
//               )}

//               {/* Show Text input for Text Question */}
//               {q.type === "text" && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     Text Response:
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md"
//                     placeholder="Enter your answer"
//                     disabled
//                   />
//                 </div>
//               )}

//               {/* Show linked sections */}

//               {Object.keys(q.sections).map((option, sIndex) => (
//                 <div key={sIndex} className="mt-4 p-4 border rounded-md">
//                   <h4 className="font-semibold mb-2">
//                     Section for option: {option}
//                   </h4>
//                   {q.sections[option].map((sectionQuestion, sqIndex) => (
//                     <div key={sqIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Section Question {sqIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-2"
//                         value={sectionQuestion.question}
//                         onChange={(e) =>
//                           handleSectionQuestionChange(
//                             qIndex,
//                             option,
//                             sqIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <select
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={sectionQuestion.type}
//                         onChange={(e) =>
//                           handleSectionQuestionTypeChange(
//                             qIndex,
//                             option,
//                             sqIndex,
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="text">Text</option>
//                         <option value="multiple-choice">Multiple Choice</option>
//                         <option value="single-choice">Single Choice</option>
//                         <option value="likert-scale">Likert Scale</option>
//                         <option value="record-audio">Record Audio</option>
//                         <option value="record-video">Record Video</option>
//                         <option value="take-picture">Take Picture</option>
//                       </select>

//                       {/* Section Options */}
//                       {(sectionQuestion.type === "multiple-choice" ||
//                         sectionQuestion.type === "single-choice") && (
//                         <div>
//                           <label className="block mb-2 font-medium">
//                             {sectionQuestion.type === "multiple-choice"
//                               ? "Multiple Choice"
//                               : "Single Choice"}{" "}
//                             Options:
//                           </label>
//                           {sectionQuestion.options.map((option, oIndex) => (
//                             <div key={oIndex}>
//                               <input
//                                 type="text"
//                                 className="w-full p-2 border rounded-md mb-2"
//                                 value={option}
//                                 onChange={(e) =>
//                                   handleSectionOptionChange(
//                                     qIndex,
//                                     option,
//                                     sqIndex,
//                                     oIndex,
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                               <button
//                                 className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//                                 onClick={() =>
//                                   removeSectionOption(
//                                     qIndex,
//                                     option,
//                                     sqIndex,
//                                     oIndex
//                                   )
//                                 }
//                               >
//                                 Remove Option
//                               </button>
//                             </div>
//                           ))}
//                           <button
//                             onClick={() =>
//                               addSectionOption(qIndex, option, sqIndex)
//                             }
//                             className="bg-gray-500 text-white px-3 py-1 rounded mt-2"
//                           >
//                             Add Option
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ))}

//               {/* {Object.keys(q.sections).map((option, sIndex) => (
//                 <div key={sIndex} className="mt-4 p-4 border rounded-md">
//                   <h4 className="font-semibold mb-2">
//                     Section for option: {option}
//                   </h4>
//                   {q.sections[option].map((sectionQuestion, sqIndex) => (
//                     <div key={sqIndex} className="mb-4">
//                       <label className="block mb-2 font-medium">
//                         Section Question {sqIndex + 1}:
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded-md mb-2"
//                         value={sectionQuestion.question}
//                         onChange={(e) =>
//                           handleSectionQuestionChange(
//                             qIndex,
//                             option,
//                             sqIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <select
//                         className="w-full p-2 border rounded-md mb-4"
//                         value={sectionQuestion.type}
//                         onChange={(e) =>
//                           handleSectionQuestionTypeChange(
//                             qIndex,
//                             option,
//                             sqIndex,
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="text">Text</option>
//                         <option value="multiple-choice">Multiple Choice</option>
//                         <option value="single-choice">Single Choice</option>
//                         <option value="likert-scale">Likert Scale</option>
//                         <option value="record-audio">Record Audio</option>
//                         <option value="record-video">Record Video</option>
//                         <option value="take-picture">Take Picture</option>
//                       </select>
//                     </div>
//                   ))}
//                 </div>
//               ))} */}
//             </div>
//           ))}

//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={addQuestion}
//           >
//             + Add Another Question
//           </button>

//           <button
//             onClick={saveFormAsDraft}
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//           >
//             Save as Draft
//           </button>
//           <button
//             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={handleSubmitSurvey}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Survey"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // "use client";
// // import { useEffect, useRef, useState } from "react";
// // import Image from "next/image";
// // import { toast } from "react-toastify";

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// // interface LikertQuestion {
// //   question: string;
// //   options: string[];
// // }

// // interface Question {
// //   question: string;
// //   type:
// //     | "likert-scale"
// //     | "multiple-choice"
// //     | "single-choice"
// //     | "text"
// //     | "record-audio"
// //     | "record-video"
// //     | "take-picture";
// //   options: string[];
// //   likertQuestions: LikertQuestion[];
// //   sections: { [option: string]: Question[] };  // New sections property

// // }

// // export default function Questions() {
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [title, setTitle] = useState("");
// //   const [subtitle, setSubtitle] = useState("");
// //   const [questions, setQuestions] = useState<Question[]>([
// //     {
// //       question: "Question 1",
// //       type: "likert-scale",
// //       options: [],
// //       likertQuestions: [],
// //       sections: {},  // Initialize sections property
// //     },
// //   ]);
// //   //   const [mediaInstruction, setMediaInstruction] = useState("");
// //   //   const [mediaType, setMediaType] = useState("");

// //   const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
// //   const [isAutoSaving, setIsAutoSaving] = useState(false); // State to track auto-saving status

// //   // {
// //   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
// //   // }

// //   // {
// //   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
// //   // }
// //   {isAutoSaving && <p className="text-gray-500">Auto-saving...</p>}

// //   // let typingTimeout: NodeJS.Timeout;
// //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

// //   // Save form data to localStorage
// //   const saveFormAsDraft = () => {
// //     const formData = {
// //       title,
// //       subtitle,
// //       questions,
// //     };
// //     localStorage.setItem("formDraft", JSON.stringify(formData));
// //     toast("Form saved as draft!");
// //   };

// //   const handleTyping = () => {
// //     if (typingTimeout.current) clearTimeout(typingTimeout.current);

// //     typingTimeout.current = setTimeout(() => {
// //       setIsAutoSaving(true);
// //       saveFormAsDraft();
// //       setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
// //     }, 1000);
// //   };

// //   // const handleTyping = () => {
// //   //   clearTimeout(typingTimeout); // Clear previous timeout

// //   //   //test

// //   //   // Set a new timeout to save after a delay (e.g., 1 second of idle time)
// //   //   typingTimeout = setTimeout(() => {
// //   //     setIsAutoSaving(true); // Show the "Auto-saving..." indicator
// //   //     saveFormAsDraft(); // Auto-save after pause
// //   //     setIsAutoSaving(false); // Hide the "Auto-saving..." indicator
// //   //   }, 1000); // Adjust the debounce time as needed
// //   // };

// //   // Load saved form data from localStorage
// //   const loadFormFromDraft = () => {
// //     const savedForm = localStorage.getItem("formDraft");
// //     if (savedForm) {
// //       const parsedData = JSON.parse(savedForm);
// //       setTitle(parsedData.title);
// //       setSubtitle(parsedData.subtitle);
// //       setQuestions(parsedData.questions);
// //     }
// //   };

// //   // Load form data when the component mounts (on page load)
// //   useEffect(() => {
// //     loadFormFromDraft();
// //   }, []);

// //   // Add a new main question
// //   const addQuestion = () => {
// //     setQuestions([
// //       ...questions,
// //       {
// //         question: `Question ${questions.length + 1}`,
// //         type: "likert-scale", // default question type can be any, e.g., likert-scale
// //         options: [],
// //         likertQuestions: [],
// //         sections: {},  // Initialize sections property
// //       },
// //     ]);
// //   };

// //   // Handle changing main question text
// //   const handleMainQuestionChange = (index: number, value: string) => {
// //     const newQuestions = [...questions];
// //     newQuestions[index].question = value;
// //     setQuestions(newQuestions);
// //     handleTyping(); // Trigger typing handler when the user types
// //   };

// //   const handleQuestionTypeChange = (
// //     index: number,
// //     type:
// //       | "likert-scale"
// //       | "multiple-choice"
// //       | "single-choice"
// //       | "text"
// //       | "record-audio"
// //       | "record-video"
// //       | "take-picture"
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[index].type = type;

// //     // Reset media flags
// //     setAllowAudio(false);
// //     setAllowVideo(false);
// //     setAllowImage(false);

// //     // Update based on selection
// //     if (type === "record-audio") {
// //       setAllowAudio(true);
// //     } else if (type === "record-video") {
// //       setAllowVideo(true);
// //     } else if (type === "take-picture") {
// //       setAllowImage(true);
// //     }

// //     // Ensure only relevant fields are retained
// //     if (type === "likert-scale") {
// //       newQuestions[index].options = [];
// //       newQuestions[index].likertQuestions = [
// //         { question: "", options: ["", "", "", "", ""] },
// //       ];
// //     } else if (type === "multiple-choice" || type === "single-choice") {
// //       newQuestions[index].likertQuestions = [];
// //       newQuestions[index].options = ["", ""];
// //     } else {
// //       newQuestions[index].likertQuestions = [];
// //       newQuestions[index].options = [];
// //     }

// //     setQuestions(newQuestions);
// //   };

// //   // Add a new Likert scale question under a main question
// //   const addLikertQuestion = (qIndex: number) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].likertQuestions.push({
// //       question: "",
// //       options: ["", "", "", "", ""],
// //     });
// //     setQuestions(newQuestions);
// //   };

// //   // Handle changing Likert scale question text
// //   const handleLikertQuestionChange = (
// //     qIndex: number,
// //     lIndex: number,
// //     value: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].likertQuestions[lIndex].question = value;
// //     setQuestions(newQuestions);
// //   };

// //   // Handle changing Likert scale options
// //   const handleOptionChange = (
// //     qIndex: number,
// //     lIndex: number | null,
// //     oIndex: number,
// //     value: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
// //     } else {
// //       newQuestions[qIndex].options[oIndex] = value;
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   // Add another option for a Likert scale question
// //   const addOption = (qIndex: number, lIndex: number | null) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option for Likert scale
// //     } else {
// //       newQuestions[qIndex].options.push(""); // Add an empty option for other types
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   // Remove an option for multiple-choice or single-choice question
// //   const removeOption = (
// //     qIndex: number,
// //     lIndex: number | null,
// //     oIndex: number
// //   ) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1); // Remove option from Likert scale
// //     } else {
// //       newQuestions[qIndex].options.splice(oIndex, 1); // Remove option from multiple-choice or single-choice
// //     }
// //     setQuestions(newQuestions);
// //   };
// //   const addSection = (qIndex: number, option: string) => {
// //     const newQuestions = [...questions];
// //     if (!newQuestions[qIndex].sections[option]) {
// //       newQuestions[qIndex].sections[option] = [];
// //     }
// //     newQuestions[qIndex].sections[option].push({
// //       question: "",
// //       type: "text",
// //       options: [],
// //       likertQuestions: [],
// //       sections: {},
// //     });
// //     setQuestions(newQuestions);
// //   };

// //   const handleSectionQuestionChange = (
// //     qIndex: number,
// //     option: string,
// //     sIndex: number,
// //     value: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].sections[option][sIndex].question = value;
// //     setQuestions(newQuestions);
// //   };

// //   const handleSectionQuestionTypeChange = (
// //     qIndex: number,
// //     option: string,
// //     sIndex: number,
// //     type: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].sections[option][sIndex].type = type;
// //     setQuestions(newQuestions);
// //   };

// //   // // Remove a question
// //   // const removeQuestion = (qIndex: number) => {
// //   //   const newQuestions = [...questions];
// //   //   newQuestions.splice(qIndex, 1); // Remove the question at the specified index
// //   //   setQuestions(newQuestions);
// //   // };

// //   const [allowAudio, setAllowAudio] = useState(false);
// //   const [allowVideo, setAllowVideo] = useState(false);
// //   const [allowImage, setAllowImage] = useState(false);

// //   // POST request to submit the survey data
// //   const handleSubmitSurvey = async () => {
// //     const userRole = localStorage.getItem("userRole");
// //     if (userRole !== "admin") {
// //       alert("You are not authorized to perform this action.");
// //       return;
// //     }

// //     const token = localStorage.getItem("accessToken");
// //     if (!token) {
// //       alert("Access token is missing.");
// //       return;
// //     }

// //     // Validation check ends
// //     for (const question of questions) {
// //       if (!question.question.trim()) {
// //         toast.error("All questions must have a valid text.");
// //         return;
// //       }

// //       if (
// //         (question.type === "multiple-choice" ||
// //           question.type === "single-choice") &&
// //         (question.options.length === 0 ||
// //           question.options.some((option) => !option.trim()))
// //       ) {
// //         toast.error(
// //           "Multiple-choice and single-choice questions must have at least one non-empty option."
// //         );
// //         return;
// //       }

// //       if (
// //         question.type === "likert-scale" &&
// //         question.likertQuestions.length === 0
// //       ) {
// //         toast.error(
// //           "Likert scale questions must contain at least one sub-question."
// //         );
// //         return;
// //       }
// //     }

// //     //validation check ends
// //     const surveyData = {
// //       title,
// //       subtitle,
// //       questions,
// //       //   mediaInstruction,
// //       //   mediaType,
// //       allowAudio, // Now included at the survey level
// //       allowVideo, // Now included at the survey level
// //       allowImage, // Now included at the survey level
// //     };

// //     setIsSubmitting(true); // Set submitting state to true when submission starts
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/create`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(surveyData),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         alert(`Error: ${errorData.message}`);
// //         setIsSubmitting(false); // Reset submitting state in case of error
// //         return;
// //       }

// //       const data = await response.json();
// //       console.log("Survey submitted successfully:", data);
// //       toast("Survey submitted successfully!");

// //       // Clear the form after successful submission
// //       setTitle("");
// //       setSubtitle("");
// //       setQuestions([
// //         {
// //           question: "Question 1",
// //           type: "likert-scale",
// //           options: [],
// //           likertQuestions: [],
// //           sections: {},  // Initialize sections
// //         },
// //       ]);
// //       setIsSubmitting(false); // Reset submitting state after clearing form
// //     } catch (error) {
// //       console.error("Error submitting survey:", error);
// //       alert("An error occurred while submitting the survey.");
// //       setIsSubmitting(false); // Reset submitting state in case of error
// //     }
// //   };

// //   return (
// //     <div className="relative p-6">
// //       {/* Logo at the Top Right */}
// //       <div className="absolute top-4 right-6">
// //         <Image
// //           src="/digiplus.png"
// //           alt="Company Logo"
// //           width={120}
// //           height={50}
// //           priority
// //         />
// //       </div>

// //       <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
// //       <button
// //         className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
// //         onClick={() => setIsFormOpen(!isFormOpen)}
// //       >
// //         {isFormOpen ? "Close Form" : "Create New Survey"}
// //       </button>

// //       {isFormOpen && (
// //         <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
// //           <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

// //           <label className="block mb-2 font-medium">Survey Title:</label>
// //           <input
// //             type="text"
// //             className="w-full p-2 border rounded-md mb-4"
// //             placeholder="Enter survey title"
// //             value={title}
// //             // onChange={(e) => setTitle(e.target.value)}
// //             onChange={(e) => {
// //               setTitle(e.target.value);
// //               handleTyping();
// //             }}
// //           />

// //           <label className="block mb-2 font-medium">Survey Sub-title:</label>
// //           <input
// //             type="text"
// //             className="w-full p-2 border rounded-md mb-4"
// //             placeholder="Enter survey sub-title"
// //             value={subtitle}
// //             onChange={(e) => {
// //               setSubtitle(e.target.value);
// //               handleTyping();
// //             }}
// //             // onChange={(e) => setSubtitle(e.target.value)}
// //           />
// //           {/* <input
// //             type="text"
// //             value={subtitle}
// //             onChange={(e) => {
// //               setSubtitle(e.target.value);
// //               handleTyping();
// //             }}
// //             placeholder="Survey Subtitle"
// //           /> */}

// //           {questions.map((q, qIndex) => (
// //             <div key={qIndex} className="border-b pb-4 mb-4">
// //               {/* Main question */}
// //               <label className="block mb-2 font-medium">{q.question}</label>
// //               <input
// //                 type="text"
// //                 className="w-full p-2 border rounded-md mb-4"
// //                 value={q.question}
// //                 onChange={(e) =>
// //                   handleMainQuestionChange(qIndex, e.target.value)
// //                 }
// //               />

// //               {/* Question Type Dropdown */}
// //               <label className="block mb-2 font-medium">
// //                 Select Question Type:
// //               </label>
// //               <select
// //                 className="w-full p-2 border rounded-md mb-4"
// //                 value={q.type}
// //                 onChange={(e) =>
// //                   handleQuestionTypeChange(
// //                     qIndex,
// //                     e.target.value as
// //                       | "likert-scale"
// //                       | "multiple-choice"
// //                       | "single-choice"
// //                       | "text"
// //                   )
// //                 }
// //               >
// //                 <option value="likert-scale">Likert Scale</option>
// //                 <option value="multiple-choice">Multiple Choice</option>
// //                 <option value="single-choice">Single Choice</option>
// //                 <option value="text">Text</option>
// //                 <option value="record-audio">Record Audio</option>
// //                 <option value="record-video">Record Video</option>
// //                 <option value="take-picture">Take Picture</option>
// //               </select>

// //               {/* Show Likert scale questions if selected */}
// //               {q.type === "likert-scale" && (
// //                 <div>
// //                   {q.likertQuestions.map((likertQ, lIndex) => (
// //                     <div key={lIndex} className="mb-4">
// //                       <label className="block mb-2 font-medium">
// //                         Likert Question {lIndex + 1}:
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="w-full p-2 border rounded-md mb-4"
// //                         value={likertQ.question}
// //                         onChange={(e) =>
// //                           handleLikertQuestionChange(
// //                             qIndex,
// //                             lIndex,
// //                             e.target.value
// //                           )
// //                         }
// //                       />

// //                       <label className="block mb-2 font-medium">
// //                         Likert Scale Options:
// //                       </label>
// //                       <div className="flex flex-wrap gap-2 mb-4">
// //                         {likertQ.options.map((option, oIndex) => (
// //                           <input
// //                             key={oIndex}
// //                             type="text"
// //                             className="w-1/5 p-2 border rounded-md"
// //                             value={option}
// //                             onChange={(e) =>
// //                               handleOptionChange(
// //                                 qIndex,
// //                                 lIndex,
// //                                 oIndex,
// //                                 e.target.value
// //                               )
// //                             }
// //                           />
// //                         ))}
// //                       </div>
// //                       <button
// //                         className="bg-green-500 text-white px-3 py-1 rounded mt-2"
// //                         onClick={() => addOption(qIndex, lIndex)}
// //                       >
// //                         + Add Option
// //                       </button>
// //                     </div>
// //                   ))}
// //                   <button
// //                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
// //                     onClick={() => addLikertQuestion(qIndex)}
// //                   >
// //                     + Add Another Likert Scale Question
// //                   </button>
// //                 </div>
// //               )}

// //               {/* Show Multiple-Choice or Single-Choice */}
// //               {(q.type === "multiple-choice" || q.type === "single-choice") && (
// //                 <div>
// //                   <label className="block mb-2 font-medium">
// //                     {q.type === "multiple-choice"
// //                       ? "Multiple Choice"
// //                       : "Single Choice"}{" "}
// //                     Options:
// //                   </label>
// //                   {q.options.map((option, oIndex) => (
// //                     // <input
// //                     //   key={oIndex}
// //                     //   type="text"
// //                     //   className="w-full p-2 border rounded-md mb-2"
// //                     //   value={option}
// //                     //   onChange={(e) =>
// //                     //     handleOptionChange(qIndex, null, oIndex, e.target.value)
// //                     //   }
// //                     // />
// //                     <div key={oIndex}>
// //                       <input
// //                         type="text"
// //                         className="w-full p-2 border rounded-md mb-2"
// //                         value={option}
// //                         onChange={(e) =>
// //                           handleOptionChange(qIndex, null, oIndex, e.target.value)
// //                         }
// //                       />
// //                       <button
// //                         className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
// //                         onClick={() => addSection(qIndex, option)}
// //                       >
// //                         Add Section for {option}
// //                       </button>
// //                     </div>
// //                   ))}
// //                   {/* <button onClick={() => removeOption(qIndex, null, oIndex)}>Remove Option</button> */}
// //                   <button
// //                     onClick={() => addOption(qIndex, null)}
// //                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 "
// //                   >
// //                     Add Option
// //                   </button>{" "}
// //                   <button
// //                     onClick={() => removeOption(qIndex, null, qIndex)}
// //                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
// //                   >
// //                     Remove Option
// //                   </button>
// //                 </div>
// //               )}

// //               {/* Show Text input for Text Question */}
// //               {q.type === "text" && (
// //                 <div>
// //                   <label className="block mb-2 font-medium">
// //                     Text Response:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     className="w-full p-2 border rounded-md"
// //                     placeholder="Enter your answer"
// //                     disabled
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //           {/* Show linked sections */}
// //           {Object.keys(q.sections).map((option, sIndex) => (
// //                 <div key={sIndex} className="mt-4 p-4 border rounded-md">
// //                   <h4 className="font-semibold mb-2">
// //                     Section for option: {option}
// //                   </h4>
// //                   {q.sections[option].map((sectionQuestion, sqIndex) => (
// //                     <div key={sqIndex} className="mb-4">
// //                       <label className="block mb-2 font-medium">
// //                         Section Question {sqIndex + 1}:
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="w-full p-2 border rounded-md mb-2"
// //                         value={sectionQuestion.question}
// //                         onChange={(e) =>
// //                           handleSectionQuestionChange(qIndex, option, sqIndex, e.target.value)
// //                         }
// //                       />
// //                       <select
// //                         className="w-full p-2 border rounded-md mb-4"
// //                         value={sectionQuestion.type}
// //                         onChange={(e) =>
// //                           handleSectionQuestionTypeChange(qIndex, option, sqIndex, e.target.value)
// //                         }
// //                       >
// //                         <option value="text">Text</option>
// //                         <option value="multiple-choice">Multiple Choice</option>
// //                         <option value="single-choice">Single Choice</option>
// //                         <option value="likert-scale">Likert Scale</option>
// //                         <option value="record-audio">Record Audio</option>
// //                         <option value="record-video">Record Video</option>
// //                         <option value="take-picture">Take Picture</option>
// //                       </select>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ))}
// //             </div>
// //           ))}

// //           <button
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //             onClick={addQuestion}
// //           >
// //             + Add Another Question
// //           </button>

// //           {/* Submit Button */}

// //           <button
// //             onClick={saveFormAsDraft}
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //           >
// //             Save as Draft
// //           </button>
// //           {/* <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
// //             {isSubmitting ? "Submitting..." : "Submit Survey"}
// //           </button> */}

// //           <button
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //             onClick={handleSubmitSurvey}
// //           >
// //             {isSubmitting ? "Submitting..." : "Submit Survey"}
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// //new starts

// //new ends

// // "use client";
// // import { useEffect, useRef, useState } from "react";
// // import Image from "next/image";
// // import { toast } from "react-toastify";

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// // interface LikertQuestion {
// //   question: string;
// //   options: string[];
// // }

// // interface Question {
// //   question: string;
// //   type:
// //     | "likert-scale"
// //     | "multiple-choice"
// //     | "single-choice"
// //     | "text"
// //     | "record-audio"
// //     | "record-video"
// //     | "take-picture";
// //   options: string[];
// //   likertQuestions: LikertQuestion[];
// // }

// // export default function Questions() {
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [title, setTitle] = useState("");
// //   const [subtitle, setSubtitle] = useState("");
// //   const [questions, setQuestions] = useState<Question[]>([
// //     {
// //       question: "Question 1",
// //       type: "likert-scale",
// //       options: [],
// //       likertQuestions: [],
// //     },
// //   ]);
// //   //   const [mediaInstruction, setMediaInstruction] = useState("");
// //   //   const [mediaType, setMediaType] = useState("");

// //   const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
// //   const [isAutoSaving, setIsAutoSaving] = useState(false); // State to track auto-saving status

// //   // {
// //   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
// //   // }

// //   // {
// //   //   isAutoSaving && <p className="text-gray-500">Auto-saving...</p>;
// //   // }
// //   {isAutoSaving && <p className="text-gray-500">Auto-saving...</p>}

// //   // let typingTimeout: NodeJS.Timeout;
// //   const typingTimeout = useRef<NodeJS.Timeout | null>(null);

// //   // Save form data to localStorage
// //   const saveFormAsDraft = () => {
// //     const formData = {
// //       title,
// //       subtitle,
// //       questions,
// //     };
// //     localStorage.setItem("formDraft", JSON.stringify(formData));
// //     toast("Form saved as draft!");
// //   };

// //   const handleTyping = () => {
// //     if (typingTimeout.current) clearTimeout(typingTimeout.current);

// //     typingTimeout.current = setTimeout(() => {
// //       setIsAutoSaving(true);
// //       saveFormAsDraft();
// //       setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
// //     }, 1000);
// //   };

// //   // const handleTyping = () => {
// //   //   clearTimeout(typingTimeout); // Clear previous timeout

// //   //   //test

// //   //   // Set a new timeout to save after a delay (e.g., 1 second of idle time)
// //   //   typingTimeout = setTimeout(() => {
// //   //     setIsAutoSaving(true); // Show the "Auto-saving..." indicator
// //   //     saveFormAsDraft(); // Auto-save after pause
// //   //     setIsAutoSaving(false); // Hide the "Auto-saving..." indicator
// //   //   }, 1000); // Adjust the debounce time as needed
// //   // };

// //   // Load saved form data from localStorage
// //   const loadFormFromDraft = () => {
// //     const savedForm = localStorage.getItem("formDraft");
// //     if (savedForm) {
// //       const parsedData = JSON.parse(savedForm);
// //       setTitle(parsedData.title);
// //       setSubtitle(parsedData.subtitle);
// //       setQuestions(parsedData.questions);
// //     }
// //   };

// //   // Load form data when the component mounts (on page load)
// //   useEffect(() => {
// //     loadFormFromDraft();
// //   }, []);

// //   // Add a new main question
// //   const addQuestion = () => {
// //     setQuestions([
// //       ...questions,
// //       {
// //         question: `Question ${questions.length + 1}`,
// //         type: "likert-scale", // default question type can be any, e.g., likert-scale
// //         options: [],
// //         likertQuestions: [],
// //       },
// //     ]);
// //   };

// //   // Handle changing main question text
// //   const handleMainQuestionChange = (index: number, value: string) => {
// //     const newQuestions = [...questions];
// //     newQuestions[index].question = value;
// //     setQuestions(newQuestions);
// //     handleTyping(); // Trigger typing handler when the user types
// //   };

// //   const handleQuestionTypeChange = (
// //     index: number,
// //     type:
// //       | "likert-scale"
// //       | "multiple-choice"
// //       | "single-choice"
// //       | "text"
// //       | "record-audio"
// //       | "record-video"
// //       | "take-picture"
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[index].type = type;

// //     // Reset media flags
// //     setAllowAudio(false);
// //     setAllowVideo(false);
// //     setAllowImage(false);

// //     // Update based on selection
// //     if (type === "record-audio") {
// //       setAllowAudio(true);
// //     } else if (type === "record-video") {
// //       setAllowVideo(true);
// //     } else if (type === "take-picture") {
// //       setAllowImage(true);
// //     }

// //     // Ensure only relevant fields are retained
// //     if (type === "likert-scale") {
// //       newQuestions[index].options = [];
// //       newQuestions[index].likertQuestions = [
// //         { question: "", options: ["", "", "", "", ""] },
// //       ];
// //     } else if (type === "multiple-choice" || type === "single-choice") {
// //       newQuestions[index].likertQuestions = [];
// //       newQuestions[index].options = ["", ""];
// //     } else {
// //       newQuestions[index].likertQuestions = [];
// //       newQuestions[index].options = [];
// //     }

// //     setQuestions(newQuestions);
// //   };

// //   // Add a new Likert scale question under a main question
// //   const addLikertQuestion = (qIndex: number) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].likertQuestions.push({
// //       question: "",
// //       options: ["", "", "", "", ""],
// //     });
// //     setQuestions(newQuestions);
// //   };

// //   // Handle changing Likert scale question text
// //   const handleLikertQuestionChange = (
// //     qIndex: number,
// //     lIndex: number,
// //     value: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     newQuestions[qIndex].likertQuestions[lIndex].question = value;
// //     setQuestions(newQuestions);
// //   };

// //   // Handle changing Likert scale options
// //   const handleOptionChange = (
// //     qIndex: number,
// //     lIndex: number | null,
// //     oIndex: number,
// //     value: string
// //   ) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
// //     } else {
// //       newQuestions[qIndex].options[oIndex] = value;
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   // Add another option for a Likert scale question
// //   const addOption = (qIndex: number, lIndex: number | null) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option for Likert scale
// //     } else {
// //       newQuestions[qIndex].options.push(""); // Add an empty option for other types
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   // Remove an option for multiple-choice or single-choice question
// //   const removeOption = (
// //     qIndex: number,
// //     lIndex: number | null,
// //     oIndex: number
// //   ) => {
// //     const newQuestions = [...questions];
// //     if (lIndex !== null) {
// //       newQuestions[qIndex].likertQuestions[lIndex].options.splice(oIndex, 1); // Remove option from Likert scale
// //     } else {
// //       newQuestions[qIndex].options.splice(oIndex, 1); // Remove option from multiple-choice or single-choice
// //     }
// //     setQuestions(newQuestions);
// //   };

// //   // // Remove a question
// //   // const removeQuestion = (qIndex: number) => {
// //   //   const newQuestions = [...questions];
// //   //   newQuestions.splice(qIndex, 1); // Remove the question at the specified index
// //   //   setQuestions(newQuestions);
// //   // };

// //   const [allowAudio, setAllowAudio] = useState(false);
// //   const [allowVideo, setAllowVideo] = useState(false);
// //   const [allowImage, setAllowImage] = useState(false);

// //   // POST request to submit the survey data
// //   const handleSubmitSurvey = async () => {
// //     const userRole = localStorage.getItem("userRole");
// //     if (userRole !== "admin") {
// //       alert("You are not authorized to perform this action.");
// //       return;
// //     }

// //     const token = localStorage.getItem("accessToken");
// //     if (!token) {
// //       alert("Access token is missing.");
// //       return;
// //     }

// //     // Validation check ends
// //     for (const question of questions) {
// //       if (!question.question.trim()) {
// //         toast.error("All questions must have a valid text.");
// //         return;
// //       }

// //       if (
// //         (question.type === "multiple-choice" ||
// //           question.type === "single-choice") &&
// //         (question.options.length === 0 ||
// //           question.options.some((option) => !option.trim()))
// //       ) {
// //         toast.error(
// //           "Multiple-choice and single-choice questions must have at least one non-empty option."
// //         );
// //         return;
// //       }

// //       if (
// //         question.type === "likert-scale" &&
// //         question.likertQuestions.length === 0
// //       ) {
// //         toast.error(
// //           "Likert scale questions must contain at least one sub-question."
// //         );
// //         return;
// //       }
// //     }

// //     //validation check ends
// //     const surveyData = {
// //       title,
// //       subtitle,
// //       questions,
// //       //   mediaInstruction,
// //       //   mediaType,
// //       allowAudio, // Now included at the survey level
// //       allowVideo, // Now included at the survey level
// //       allowImage, // Now included at the survey level
// //     };

// //     setIsSubmitting(true); // Set submitting state to true when submission starts
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/create`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(surveyData),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         alert(`Error: ${errorData.message}`);
// //         setIsSubmitting(false); // Reset submitting state in case of error
// //         return;
// //       }

// //       const data = await response.json();
// //       console.log("Survey submitted successfully:", data);
// //       toast("Survey submitted successfully!");

// //       // Clear the form after successful submission
// //       setTitle("");
// //       setSubtitle("");
// //       setQuestions([
// //         {
// //           question: "Question 1",
// //           type: "likert-scale",
// //           options: [],
// //           likertQuestions: [],
// //         },
// //       ]);
// //       setIsSubmitting(false); // Reset submitting state after clearing form
// //     } catch (error) {
// //       console.error("Error submitting survey:", error);
// //       alert("An error occurred while submitting the survey.");
// //       setIsSubmitting(false); // Reset submitting state in case of error
// //     }
// //   };

// //   return (
// //     <div className="relative p-6">
// //       {/* Logo at the Top Right */}
// //       <div className="absolute top-4 right-6">
// //         <Image
// //           src="/digiplus.png"
// //           alt="Company Logo"
// //           width={120}
// //           height={50}
// //           priority
// //         />
// //       </div>

// //       <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
// //       <button
// //         className="bg-gray-800 text-white px-4 py-2 rounded mb-6"
// //         onClick={() => setIsFormOpen(!isFormOpen)}
// //       >
// //         {isFormOpen ? "Close Form" : "Create New Survey"}
// //       </button>

// //       {isFormOpen && (
// //         <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
// //           <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

// //           <label className="block mb-2 font-medium">Survey Title:</label>
// //           <input
// //             type="text"
// //             className="w-full p-2 border rounded-md mb-4"
// //             placeholder="Enter survey title"
// //             value={title}
// //             // onChange={(e) => setTitle(e.target.value)}
// //             onChange={(e) => {
// //               setTitle(e.target.value);
// //               handleTyping();
// //             }}
// //           />

// //           <label className="block mb-2 font-medium">Survey Sub-title:</label>
// //           <input
// //             type="text"
// //             className="w-full p-2 border rounded-md mb-4"
// //             placeholder="Enter survey sub-title"
// //             value={subtitle}
// //             onChange={(e) => {
// //               setSubtitle(e.target.value);
// //               handleTyping();
// //             }}
// //             // onChange={(e) => setSubtitle(e.target.value)}
// //           />
// //           {/* <input
// //             type="text"
// //             value={subtitle}
// //             onChange={(e) => {
// //               setSubtitle(e.target.value);
// //               handleTyping();
// //             }}
// //             placeholder="Survey Subtitle"
// //           /> */}

// //           {questions.map((q, qIndex) => (
// //             <div key={qIndex} className="border-b pb-4 mb-4">
// //               {/* Main question */}
// //               <label className="block mb-2 font-medium">{q.question}</label>
// //               <input
// //                 type="text"
// //                 className="w-full p-2 border rounded-md mb-4"
// //                 value={q.question}
// //                 onChange={(e) =>
// //                   handleMainQuestionChange(qIndex, e.target.value)
// //                 }
// //               />

// //               {/* Question Type Dropdown */}
// //               <label className="block mb-2 font-medium">
// //                 Select Question Type:
// //               </label>
// //               <select
// //                 className="w-full p-2 border rounded-md mb-4"
// //                 value={q.type}
// //                 onChange={(e) =>
// //                   handleQuestionTypeChange(
// //                     qIndex,
// //                     e.target.value as
// //                       | "likert-scale"
// //                       | "multiple-choice"
// //                       | "single-choice"
// //                       | "text"
// //                   )
// //                 }
// //               >
// //                 <option value="likert-scale">Likert Scale</option>
// //                 <option value="multiple-choice">Multiple Choice</option>
// //                 <option value="single-choice">Single Choice</option>
// //                 <option value="text">Text</option>
// //                 <option value="record-audio">Record Audio</option>
// //                 <option value="record-video">Record Video</option>
// //                 <option value="take-picture">Take Picture</option>
// //               </select>

// //               {/* Show Likert scale questions if selected */}
// //               {q.type === "likert-scale" && (
// //                 <div>
// //                   {q.likertQuestions.map((likertQ, lIndex) => (
// //                     <div key={lIndex} className="mb-4">
// //                       <label className="block mb-2 font-medium">
// //                         Likert Question {lIndex + 1}:
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="w-full p-2 border rounded-md mb-4"
// //                         value={likertQ.question}
// //                         onChange={(e) =>
// //                           handleLikertQuestionChange(
// //                             qIndex,
// //                             lIndex,
// //                             e.target.value
// //                           )
// //                         }
// //                       />

// //                       <label className="block mb-2 font-medium">
// //                         Likert Scale Options:
// //                       </label>
// //                       <div className="flex flex-wrap gap-2 mb-4">
// //                         {likertQ.options.map((option, oIndex) => (
// //                           <input
// //                             key={oIndex}
// //                             type="text"
// //                             className="w-1/5 p-2 border rounded-md"
// //                             value={option}
// //                             onChange={(e) =>
// //                               handleOptionChange(
// //                                 qIndex,
// //                                 lIndex,
// //                                 oIndex,
// //                                 e.target.value
// //                               )
// //                             }
// //                           />
// //                         ))}
// //                       </div>
// //                       <button
// //                         className="bg-green-500 text-white px-3 py-1 rounded mt-2"
// //                         onClick={() => addOption(qIndex, lIndex)}
// //                       >
// //                         + Add Option
// //                       </button>
// //                     </div>
// //                   ))}
// //                   <button
// //                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
// //                     onClick={() => addLikertQuestion(qIndex)}
// //                   >
// //                     + Add Another Likert Scale Question
// //                   </button>
// //                 </div>
// //               )}

// //               {/* Show Multiple-Choice or Single-Choice */}
// //               {(q.type === "multiple-choice" || q.type === "single-choice") && (
// //                 <div>
// //                   <label className="block mb-2 font-medium">
// //                     {q.type === "multiple-choice"
// //                       ? "Multiple Choice"
// //                       : "Single Choice"}{" "}
// //                     Options:
// //                   </label>
// //                   {q.options.map((option, oIndex) => (
// //                     <input
// //                       key={oIndex}
// //                       type="text"
// //                       className="w-full p-2 border rounded-md mb-2"
// //                       value={option}
// //                       onChange={(e) =>
// //                         handleOptionChange(qIndex, null, oIndex, e.target.value)
// //                       }
// //                     />
// //                   ))}
// //                   {/* <button onClick={() => removeOption(qIndex, null, oIndex)}>Remove Option</button> */}
// //                   <button
// //                     onClick={() => addOption(qIndex, null)}
// //                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 "
// //                   >
// //                     Add Option
// //                   </button>{" "}
// //                   <button
// //                     onClick={() => removeOption(qIndex, null, qIndex)}
// //                     className="bg-gray-500 text-white px-3 py-1 rounded mt-2 mx-3"
// //                   >
// //                     Remove Option
// //                   </button>
// //                 </div>
// //               )}

// //               {/* Show Text input for Text Question */}
// //               {q.type === "text" && (
// //                 <div>
// //                   <label className="block mb-2 font-medium">
// //                     Text Response:
// //                   </label>
// //                   <input
// //                     type="text"
// //                     className="w-full p-2 border rounded-md"
// //                     placeholder="Enter your answer"
// //                     disabled
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //           <button
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //             onClick={addQuestion}
// //           >
// //             + Add Another Question
// //           </button>

// //           {/* Submit Button */}

// //           <button
// //             onClick={saveFormAsDraft}
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //           >
// //             Save as Draft
// //           </button>
// //           {/* <button onClick={handleSubmitSurvey} disabled={isSubmitting}>
// //             {isSubmitting ? "Submitting..." : "Submit Survey"}
// //           </button> */}

// //           <button
// //             className="bg-gray-800 text-white px-4 py-2 rounded mt-4 w-full"
// //             onClick={handleSubmitSurvey}
// //           >
// //             {isSubmitting ? "Submitting..." : "Submit Survey"}
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
