// //Perfect working code

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subTitle, setSubTitle] = useState("");
//   const [questions, setQuestions] = useState([
//     {
//       question: "Question 1",
//       type: "likert-scale",
//       likertQuestions: [{ question: "", options: ["", "", "", "", ""] }],
//     },
//   ]);
//   const [mediaInstruction, setMediaInstruction] = useState("");
//   const [mediaType, setMediaType] = useState("");

//   // Add a new main question
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: `Question ${questions.length + 1}`,
//         type: "likert-scale",
//         likertQuestions: [{ question: "", options: ["", "", "", "", ""] }],
//       },
//     ]);
//   };

//   // Handle changing main question text
//   const handleMainQuestionChange = (index: number, value: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//   };

//   // Handle changing question type
//   const handleQuestionTypeChange = (index: number, type: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;
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
//     lIndex: number,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
//     setQuestions(newQuestions);
//   };

//   // Add another option for a Likert scale question
//   const addOption = (qIndex: number, lIndex: number) => {
//     const newQuestions = [...questions];
//     newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option
//     setQuestions(newQuestions);
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
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
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
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label className="block mb-2 font-medium">Survey Sub-title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             placeholder="Enter survey sub-title"
//             value={subTitle}
//             onChange={(e) => setSubTitle(e.target.value)}
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
//                   handleQuestionTypeChange(qIndex, e.target.value)
//                 }
//               >
//                 <option value="likert-scale">Likert Scale</option>
//                 <option value="multiple-choice">Multiple Choice</option>
//                 <option value="single-choice">Single Choice</option>
//                 <option value="text">Text</option>
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

//                   {/* Button to add another Likert scale question */}
//                   <button
//                     className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
//                     onClick={() => addLikertQuestion(qIndex)}
//                   >
//                     + Add Another Likert Scale Question
//                   </button>
//                 </div>
//               )}

//               {/* Additional question types (e.g., multiple choice, single choice) */}
//               {q.type === "multiple-choice" && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     Multiple Choice Options:
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md mb-2"
//                     placeholder="Option 1"
//                   />
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md mb-2"
//                     placeholder="Option 2"
//                   />
//                   <button className="bg-green-500 text-white px-3 py-1 rounded mt-2">
//                     + Add Option
//                   </button>
//                 </div>
//               )}

//               {q.type === "single-choice" && (
//                 <div>
//                   <label className="block mb-2 font-medium">
//                     Single Choice Options:
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md mb-2"
//                     placeholder="Option 1"
//                   />
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded-md mb-2"
//                     placeholder="Option 2"
//                   />
//                 </div>
//               )}

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
//             className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={addQuestion}
//           >
//             + Add Another Question
//           </button>
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={() => {
//               // Your submit logic goes here
//               console.log("Form submitted");
//             }}
//           >
//             Submit Survey
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

//working above

"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

interface LikertQuestion {
  question: string;
  options: string[];
}

// interface Question {
//   question: string;
//   type: "likert-scale" | "multiple-choice" | "single-choice" | "text";
//   options: string[];
//   likertQuestions: LikertQuestion[];
// }

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
//new
// interface Question {
//   question: string;
//   type: "likert-scale" | "multiple-choice" | "single-choice" | "text" | "record-audio" | "record-video" | "take-picture";
//   options: string[];
//   likertQuestions: LikertQuestion[];
//   requiresMedia?: boolean;
// }

//newest
// interface Question {
//   question: string;
//   type:
//     | "likert-scale"
//     | "multiple-choice"
//     | "single-choice"
//     | "text"
//     | "audio"
//     | "video"
//     | "image";
//   options: string[];
//   likertQuestions: LikertQuestion[];
//   allowAudio?: boolean;
//   allowVideo?: boolean;
//   allowImage?: boolean;
// }

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

    try {
      const response = await fetch(
        "http://localhost:3001/admin/questions/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(surveyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log("Survey submitted successfully:", data);
      toast.success("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("An error occurred while submitting the survey.");
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
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
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
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block mb-2 font-medium">Survey Sub-title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Enter survey sub-title"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

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
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={addQuestion}
          >
            + Add Another Question
          </button>

          {/* Submit Button */}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={handleSubmitSurvey}
          >
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
}
