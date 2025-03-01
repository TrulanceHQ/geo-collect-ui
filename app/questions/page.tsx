/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // Add the allowOther property for single choice questions
  allowOther?: boolean;
}

export default function Questions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sections, setSections] = useState<
    { title: string; questions: Question[] }[]
  >([]);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isAutoSaving, setIsAutoSaving] = useState(false);

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

  // const handleTyping = () => {
  //   if (typingTimeout.current) clearTimeout(typingTimeout.current);

  //   typingTimeout.current = setTimeout(() => {
  //     setIsAutoSaving(true);
  //     setTimeout(() => setIsAutoSaving(false), 500); // Add delay for UX
  //   }, 1000);
  // };

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
    setShowDeleteSection(true); // Show the delete section button when a section is added
  };

  const removeSection = (sectionIndex: number) => {
    const updatedSections = sections.filter(
      (_, index) => index !== sectionIndex
    );
    setSections(updatedSections);
    if (updatedSections.length === 0) {
      setShowDeleteSection(false);
      // Hide the delete section button if no sections are left
    }
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
      type: "text",
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
    const question = newSections[sectionIndex].questions[questionIndex];

    question.question = value;
    if (question.type === "text") {
      question.options = [];
      question.likertQuestions = [];
    }

    setSections(newSections);
  };

  
  const handleLikertOptionChange = (
    sectionIndex: number,
    qIndex: number,
    lIndex: number,
    oIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].likertQuestions[lIndex].options[
      oIndex
    ] = value;
    setSections(newSections);
  };

  
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
    
    
      options: [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ],
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


  //above
  const addLikertOption = (
    sectionIndex: number,
    qIndex: number,
    lIndex: number
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[qIndex].likertQuestions[
      lIndex
    ].options.push("");
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
      }
    }

    const cleanedSections = sections.map((section) => {
      const cleanedQuestions = section.questions.map((question) => {
        if (question.type === "text") {
          // Remove 'options' and 'likertQuestions' for text questions
          const { options, likertQuestions, ...rest } = question;
          return rest;
        } else if (question.type === "likert-scale") {
          // Ensure likert-scale questions keep their 'likertQuestions'
          return question;
        } else {
          // Remove 'likertQuestions' for multiple-choice and single-choice questions
          const { likertQuestions, ...rest } = question;
          return rest;
        }
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
      // validateForm();
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
      console.log("Survey created successfully:", data);
      toast("Survey created successfully!");

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
              // handleTyping();
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
              // handleTyping();
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
                              <div key={oIndex} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  className="w-3/4 p-2 border rounded-md"
                                  placeholder="Option (text or number)"
                                  value={option}
                                  // value={option.option}
                                  onChange={(e) =>
                                    handleLikertOptionChange(
                                      sectionIndex,
                                      qIndex,
                                      lIndex,
                                      oIndex,
                                      // "label",
                                      e.target.value
                                    )
                                  }
                                />
                               
                              
                              </div>
                            ))}
                          </div>
                        
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                            onClick={() =>
                              addLikertOption(sectionIndex, qIndex, lIndex)
                            }
                          >
                            + Add Likert Option
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

                      {/* Only for single-choice questions, render the "Allow Other" toggle */}
                      {q.type === "single-choice" && (
                        <div className="mt-4 flex items-center">
                          <input
                            type="checkbox"
                            checked={q.allowOther || false}
                            onChange={(e) => {
                              const newSections = [...sections];
                              newSections[sectionIndex].questions[
                                qIndex
                              ].allowOther = e.target.checked;
                              setSections(newSections);
                            }}
                          />
                          <span className="ml-2 font-medium">
                            Enable &quot;Other&quot; Option
                          </span>
                        </div>
                      )}

                      {/* Optionally, you may render a preview input for the "Other" option.
         In your actual respondent form, this field might be conditionally shown
         only when the respondent selects the "Other" radio button. */}
                      {q.type === "single-choice" && q.allowOther && (
                        <div className="mt-4">
                          <label className="block mb-2 font-medium">
                            Other (please specify):
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Type your answer here"
                            // This is just a preview; in a live form you would allow input when "Other" is selected.
                            disabled
                          />
                        </div>
                      )}
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
              {showDeleteSection && (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded mt-4 w-full"
                  onClick={() => removeSection(sectionIndex)}
                >
                  Delete Section
                </button>
              )}
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
