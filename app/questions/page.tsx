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

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
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

//   // Handle form submission (e.g., sending to an API)
//   const handleSubmit = async () => {
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

//     const surveyData = { title, subtitle, questions };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/admin/questions/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(surveyData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         return;
//       }

//       const data = await response.json();
//       console.log("Survey submitted successfully:", data);
//       alert("Survey submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
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
//             value={subtitle}
//             onChange={(e) => setSubtitle(e.target.value)}
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
//             onClick={handleSubmit}
//           >
//             Submit Survey
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

//working above

//working below

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// // Define TypeScript types
// type QuestionType =
//   | "single-choice"
//   | "multiple-choice"
//   | "likert-scale"
//   | "text";

// interface Question {
//   question: string;
//   type: QuestionType;
//   options?: string[]; // Only for single-choice & multiple-choice
//   likertQuestions?: { question: string; options: string[] }[]; // Only for likert-scale
// }

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
//   const [title, setTitle] = useState<string>("");
//   const [subtitle, setSubtitle] = useState<string>("");
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       question: "Question 1",
//       type: "single-choice",
//       options: ["Option 1", "Option 2"],
//     },
//   ]);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: `Question ${questions.length + 1}`,
//         type: "single-choice",
//         options: ["Option 1", "Option 2"],
//       },
//     ]);
//   };

//   const handleMainQuestionChange = (index: number, value: string) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//   };

//   const handleQuestionTypeChange = (index: number, type: QuestionType) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;

//     if (type === "likert-scale") {
//       newQuestions[index].likertQuestions = [
//         { question: "", options: ["", "", "", "", ""] },
//       ];
//       newQuestions[index].options = undefined;
//     } else {
//       newQuestions[index].likertQuestions = undefined;
//       newQuestions[index].options = ["Option 1", "Option 2"];
//     }

//     setQuestions(newQuestions);
//   };

//   const handleOptionChange = (
//     qIndex: number,
//     oIndex: number,
//     value: string
//   ) => {
//     const newQuestions = [...questions];
//     if (newQuestions[qIndex].options) {
//       newQuestions[qIndex].options![oIndex] = value;
//     }
//     setQuestions(newQuestions);
//   };

//   const addOption = (qIndex: number) => {
//     const newQuestions = [...questions];
//     if (newQuestions[qIndex].options) {
//       newQuestions[qIndex].options!.push("");
//     }
//     setQuestions(newQuestions);
//   };

//   const removeOption = (qIndex: number, oIndex: number) => {
//     const newQuestions = [...questions];
//     if (newQuestions[qIndex].options) {
//       newQuestions[qIndex].options!.splice(oIndex, 1);
//     }
//     setQuestions(newQuestions);
//   };

//   const handleSubmit = async () => {
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

//     const surveyData = { title, subtitle, questions };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/admin/questions/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(surveyData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         return;
//       }

//       alert("Survey submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
//     }
//   };

//   return (
//     <div className="relative p-6">
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
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <label className="block mb-2 font-medium">Survey Sub-title:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded-md mb-4"
//             value={subtitle}
//             onChange={(e) => setSubtitle(e.target.value)}
//           />

//           {questions.map((q, qIndex) => (
//             <div key={qIndex} className="border-b pb-4 mb-4">
//               <label className="block mb-2 font-medium">Question:</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.question}
//                 onChange={(e) =>
//                   handleMainQuestionChange(qIndex, e.target.value)
//                 }
//               />

//               <label className="block mb-2 font-medium">Question Type:</label>
//               <select
//                 className="w-full p-2 border rounded-md mb-4"
//                 value={q.type}
//                 onChange={(e) =>
//                   handleQuestionTypeChange(
//                     qIndex,
//                     e.target.value as QuestionType
//                   )
//                 }
//               >
//                 <option value="single-choice">Single Choice</option>
//                 <option value="multiple-choice">Multiple Choice</option>
//                 <option value="likert-scale">Likert Scale</option>
//                 <option value="text">Text</option>
//               </select>

//               {["single-choice", "multiple-choice"].includes(q.type) &&
//                 q.options && (
//                   <div>
//                     <label className="block mb-2 font-medium">
//                       {q.type === "single-choice"
//                         ? "Single Choice Options:"
//                         : "Multiple Choice Options:"}
//                     </label>
//                     {q.options.map((option, oIndex) => (
//                       <div key={oIndex} className="flex gap-2 mb-2">
//                         <input
//                           type="text"
//                           className="w-full p-2 border rounded-md"
//                           value={option}
//                           onChange={(e) =>
//                             handleOptionChange(qIndex, oIndex, e.target.value)
//                           }
//                         />
//                         <button
//                           className="text-red-500"
//                           onClick={() => removeOption(qIndex, oIndex)}
//                         >
//                           x
//                         </button>
//                       </div>
//                     ))}
//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded"
//                       onClick={() => addOption(qIndex)}
//                     >
//                       + Add Option
//                     </button>
//                   </div>
//                 )}
//             </div>
//           ))}
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Submit Survey
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
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

// // Handle form submission (e.g., sending to an API)
// const handleSubmit = async () => {
//   const userRole = localStorage.getItem("userRole");
//   if (userRole !== "admin") {
//     alert("You are not authorized to perform this action.");
//     return;
//   }

//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     alert("Access token is missing.");
//     return;
//   }

//   const surveyData = { title, subtitle, questions };

//   try {
//     const response = await fetch(
//       "http://localhost:5000/admin/questions/create",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(surveyData),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       alert(`Error: ${errorData.message}`);
//       return;
//     }

//     const data = await response.json();
//     console.log("Survey submitted successfully:", data);
//     alert("Survey submitted successfully!");
//   } catch (error) {
//     console.error("Error submitting survey:", error);
//     alert("An error occurred while submitting the survey.");
//   }
// };

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
//             value={subtitle}
//             onChange={(e) => setSubtitle(e.target.value)}
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

//               {/* Multiple Choice */}
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

//               {/* Single Choice */}
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
//             onClick={handleSubmit}
//           >
//             Submit Survey
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [questions, setQuestions] = useState([
//     {
//       question: "Question 1",
//       type: "likert-scale",
//       likertQuestions: [{ question: "", options: ["", "", "", "", ""] }],
//     },
//   ]);
//   const [mediaInstruction, setMediaInstruction] = useState("");
//   const [mediaType, setMediaType] = useState("");

//   // Add a new main question (with customizable type)
//   // const addQuestion = (type = "likert-scale") => {
//   //   setQuestions([
//   //     ...questions,
//   //     {
//   //       question: `Question ${questions.length + 1}`,
//   //       type: type,
//   //       likertQuestions:
//   //         type === "likert-scale"
//   //           ? [{ question: "", options: ["", "", "", "", ""] }]
//   //           : [],
//   //     },
//   //   ]);
//   // };

//   const addQuestion = (type = "likert-scale") => {
//     let newQuestion = {
//       question: `Question ${questions.length + 1}`,
//       type: type,
//       likertQuestions:
//         type === "likert-scale"
//           ? [{ question: "", options: ["", "", "", "", ""] }]
//           : [],
//       options:
//         type === "single-choice" ? ["Option 1", "Option 2", "Option 3"] : [], // Initialize options for single-choice
//     };

//     setQuestions([...questions, newQuestion]);
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
//     if (type !== "likert-scale") {
//       newQuestions[index].likertQuestions = []; // Reset Likert scale for non-likert types
//     }
//     setQuestions(newQuestions);
//   };

//   // Add a new Likert scale question under a main question
//   const addLikertQuestion = (qIndex: number) => {
//     const newQuestions = [...questions];
//     if (newQuestions[qIndex].type === "likert-scale") {
//       newQuestions[qIndex].likertQuestions.push({
//         question: "",
//         options: ["", "", "", "", ""],
//       });
//     }
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
//     if (newQuestions[qIndex].type === "likert-scale") {
//       newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option
//     }
//     setQuestions(newQuestions);
//   };

//   // const [title, setTitle] = useState("");
//   // const [subtitle, setSubtitle] = useState("");
//   // const [questions, setQuestions] = useState([
//   //   {
//   //     question: "Question 1",
//   //     type: "likert-scale",
//   //     likertQuestions: [{ question: "", options: ["", "", "", "", ""] }],
//   //   },
//   // ]);
//   // const [mediaInstruction, setMediaInstruction] = useState("");
//   // const [mediaType, setMediaType] = useState("");

//   // // Add a new main question
//   // const addQuestion = () => {
//   //   setQuestions([
//   //     ...questions,
//   //     {
//   //       question: `Question ${questions.length + 1}`,
//   //       type: "likert-scale",
//   //       likertQuestions: [{ question: "", options: ["", "", "", "", ""] }],
//   //     },
//   //   ]);
//   // };

//   // // Handle changing main question text
//   // const handleMainQuestionChange = (index: number, value: string) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[index].question = value;
//   //   setQuestions(newQuestions);
//   // };

//   // // Handle changing question type
//   // const handleQuestionTypeChange = (index: number, type: string) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[index].type = type;
//   //   if (type !== "likert-scale") {
//   //     newQuestions[index].likertQuestions = []; // Reset Likert scale for non-likert types
//   //   }
//   //   setQuestions(newQuestions);
//   // };

//   // // Add a new Likert scale question under a main question
//   // const addLikertQuestion = (qIndex: number) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[qIndex].likertQuestions.push({
//   //     question: "",
//   //     options: ["", "", "", "", ""],
//   //   });
//   //   setQuestions(newQuestions);
//   // };

//   // // Handle changing Likert scale question text
//   // const handleLikertQuestionChange = (
//   //   qIndex: number,
//   //   lIndex: number,
//   //   value: string
//   // ) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[qIndex].likertQuestions[lIndex].question = value;
//   //   setQuestions(newQuestions);
//   // };

//   // // Handle changing Likert scale options
//   // const handleOptionChange = (
//   //   qIndex: number,
//   //   lIndex: number,
//   //   oIndex: number,
//   //   value: string
//   // ) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[qIndex].likertQuestions[lIndex].options[oIndex] = value;
//   //   setQuestions(newQuestions);
//   // };

//   // // Add another option for a Likert scale question
//   // const addOption = (qIndex: number, lIndex: number) => {
//   //   const newQuestions = [...questions];
//   //   newQuestions[qIndex].likertQuestions[lIndex].options.push(""); // Add an empty option
//   //   setQuestions(newQuestions);
//   // };

//   // Handle form submission (e.g., sending to an API)
//   const handleSubmit = async () => {
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

//     const surveyData = { title, subtitle, questions };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/admin/questions/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(surveyData),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.message}`);
//         return;
//       }

//       const data = await response.json();
//       console.log("Survey submitted successfully:", data);
//       alert("Survey submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting survey:", error);
//       alert("An error occurred while submitting the survey.");
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
//             value={subtitle}
//             onChange={(e) => setSubtitle(e.target.value)}
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

//           {/* <button
//             className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={addQuestion}
//           >
//             + Add Another Question
//           </button> */}
//           <button onClick={() => addQuestion("likert-scale")}>
//             Add Question
//           </button>

//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={handleSubmit}
//           >
//             Submit Survey
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

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
//         </div>
//       )}
//     </div>
//   );
// }
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
//       type: "likert-scale", // Default type, can be changed to any other type
//       options: [], // Empty options by default
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
//         type: "likert-scale", // Default type
//         options: [],
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
//     newQuestions[index].likertQuestions = []; // Clear likert questions
//     newQuestions[index].options = []; // Clear options
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

//               {/* Multiple choice questions */}
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

//               {/* Single choice questions */}
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

//               {/* Text response questions */}
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
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import Image from "next/image";

// interface LikertQuestion {
//   question: string;
//   options: string[];
// }

// interface Question {
//   question: string;
//   type: "likert-scale" | "multiple-choice" | "single-choice" | "text";
//   options: string[];
//   likertQuestions: LikertQuestion[];
// }

// export default function Questions() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subTitle, setSubTitle] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       question: "Question 1",
//       type: "likert-scale", // Default type can be anything, for example "likert-scale"
//       options: [],
//       likertQuestions: [],
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
//   };

//   // Handle changing question type
//   const handleQuestionTypeChange = (
//     index: number,
//     type: "likert-scale" | "multiple-choice" | "single-choice" | "text"
//   ) => {
//     const newQuestions = [...questions];
//     newQuestions[index].type = type;
//     // Clear options or likertQuestions depending on the selected type
//     if (type === "likert-scale") {
//       newQuestions[index].options = [];
//       newQuestions[index].likertQuestions = [
//         { question: "", options: ["", "", "", "", ""] },
//       ];
//     } else if (type === "multiple-choice" || type === "single-choice") {
//       newQuestions[index].likertQuestions = [];
//       newQuestions[index].options = ["", ""];
//     } else if (type === "text") {
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

//   // POST request to submit the survey data
//   const handleSubmitSurvey = async () => {
//     const surveyData = {
//       title,
//       subTitle,
//       questions,
//       mediaInstruction,
//       mediaType,
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/admin/questions/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(surveyData),
//         }
//       );

//       if (response.ok) {
//         alert("Survey submitted successfully!");
//       } else {
//         alert("There was an issue submitting your survey.");
//       }
//     } catch (error: unknown) {
//       // TypeScript doesn't know the type of 'error', so assert it to be an instance of Error
//       if (error instanceof Error) {
//         alert("Error: " + error.message); // Now you can safely access error.message
//       } else {
//         alert("An unknown error occurred.");
//       }
//     }

//     //     try {
//     //       const response = await fetch("http://localhost:5000/admin/questions/create", {
//     //         method: "POST",
//     //         headers: {
//     //           "Content-Type": "application/json",
//     //         },
//     //         body: JSON.stringify(surveyData),
//     //       });

//     //       if (response.ok) {
//     //         alert("Survey submitted successfully!");
//     //       } else {
//     //         alert("There was an issue submitting your survey.");
//     //       }
//     //     }
//     //     catch (error) {
//     //       alert("Error: " + error.message);
//     //     }
//     //   };

//     return (
//       <div className="relative p-6">
//         {/* Logo at the Top Right */}
//         <div className="absolute top-4 right-6">
//           <Image
//             src="/digiplus.png"
//             alt="Company Logo"
//             width={120}
//             height={50}
//             priority
//           />
//         </div>

//         <h1 className="text-2xl font-bold mb-4">Survey Questions</h1>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
//           onClick={() => setIsFormOpen(!isFormOpen)}
//         >
//           {isFormOpen ? "Close Form" : "Create New Survey"}
//         </button>

//         {isFormOpen && (
//           <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
//             <h2 className="text-xl font-semibold mb-4">Create a New Survey</h2>

//             <label className="block mb-2 font-medium">Survey Title:</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md mb-4"
//               placeholder="Enter survey title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label className="block mb-2 font-medium">Survey Sub-title:</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md mb-4"
//               placeholder="Enter survey sub-title"
//               value={subTitle}
//               onChange={(e) => setSubTitle(e.target.value)}
//             />

//             {questions.map((q, qIndex) => (
//               <div key={qIndex} className="border-b pb-4 mb-4">
//                 {/* Main question */}
//                 <label className="block mb-2 font-medium">{q.question}</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded-md mb-4"
//                   value={q.question}
//                   onChange={(e) =>
//                     handleMainQuestionChange(qIndex, e.target.value)
//                   }
//                 />

//                 {/* Question Type Dropdown */}
//                 <label className="block mb-2 font-medium">
//                   Select Question Type:
//                 </label>
//                 <select
//                   className="w-full p-2 border rounded-md mb-4"
//                   value={q.type}
//                   onChange={(e) =>
//                     handleQuestionTypeChange(
//                       qIndex,
//                       e.target.value as
//                         | "likert-scale"
//                         | "multiple-choice"
//                         | "single-choice"
//                         | "text"
//                     )
//                   }
//                 >
//                   <option value="likert-scale">Likert Scale</option>
//                   <option value="multiple-choice">Multiple Choice</option>
//                   <option value="single-choice">Single Choice</option>
//                   <option value="text">Text</option>
//                 </select>

//                 {/* Show Likert scale questions if selected */}
//                 {q.type === "likert-scale" && (
//                   <div>
//                     {q.likertQuestions.map((likertQ, lIndex) => (
//                       <div key={lIndex} className="mb-4">
//                         <label className="block mb-2 font-medium">
//                           Likert Question {lIndex + 1}:
//                         </label>
//                         <input
//                           type="text"
//                           className="w-full p-2 border rounded-md mb-4"
//                           value={likertQ.question}
//                           onChange={(e) =>
//                             handleLikertQuestionChange(
//                               qIndex,
//                               lIndex,
//                               e.target.value
//                             )
//                           }
//                         />

//                         <label className="block mb-2 font-medium">
//                           Likert Scale Options:
//                         </label>
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {likertQ.options.map((option, oIndex) => (
//                             <input
//                               key={oIndex}
//                               type="text"
//                               className="w-1/5 p-2 border rounded-md"
//                               value={option}
//                               onChange={(e) =>
//                                 handleOptionChange(
//                                   qIndex,
//                                   lIndex,
//                                   oIndex,
//                                   e.target.value
//                                 )
//                               }
//                             />
//                           ))}
//                         </div>
//                         <button
//                           className="bg-green-500 text-white px-3 py-1 rounded mt-2"
//                           onClick={() => addOption(qIndex, lIndex)}
//                         >
//                           + Add Option
//                         </button>
//                       </div>
//                     ))}
//                     <button
//                       className="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full"
//                       onClick={() => addLikertQuestion(qIndex)}
//                     >
//                       + Add Another Likert Scale Question
//                     </button>
//                   </div>
//                 )}

//                 {/* Show Multiple-Choice or Single-Choice */}
//                 {(q.type === "multiple-choice" ||
//                   q.type === "single-choice") && (
//                   <div>
//                     <label className="block mb-2 font-medium">
//                       {q.type === "multiple-choice"
//                         ? "Multiple Choice"
//                         : "Single Choice"}{" "}
//                       Options:
//                     </label>
//                     {q.options.map((option, oIndex) => (
//                       <input
//                         key={oIndex}
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
//                     ))}
//                   </div>
//                 )}

//                 {/* Show Text input for Text Question */}
//                 {q.type === "text" && (
//                   <div>
//                     <label className="block mb-2 font-medium">
//                       Text Response:
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full p-2 border rounded-md"
//                       placeholder="Enter your answer"
//                       disabled
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}

//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
//               onClick={addQuestion}
//             >
//               + Add Another Question
//             </button>

//             {/* Submit Button */}
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
//               onClick={handleSubmitSurvey}
//             >
//               Submit Survey
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };
// }
"use client";
import { useState } from "react";
import Image from "next/image";

interface LikertQuestion {
  question: string;
  options: string[];
}

interface Question {
  question: string;
  type: "likert-scale" | "multiple-choice" | "single-choice" | "text";
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

  // Handle changing question type
  const handleQuestionTypeChange = (
    index: number,
    type: "likert-scale" | "multiple-choice" | "single-choice" | "text"
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;
    // Clear options or likertQuestions depending on the selected type
    if (type === "likert-scale") {
      newQuestions[index].options = [];
      newQuestions[index].likertQuestions = [
        { question: "", options: ["", "", "", "", ""] },
      ];
    } else if (type === "multiple-choice" || type === "single-choice") {
      newQuestions[index].likertQuestions = [];
      newQuestions[index].options = ["", ""];
    } else if (type === "text") {
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
    };

    try {
      const response = await fetch(
        "http://localhost:5000/admin/questions/create",
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
      alert("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("An error occurred while submitting the survey.");
    }
  };
  //       if (response.ok) {
  //         alert("Survey submitted successfully!");
  //       } else {
  //         alert("There was an issue submitting your survey.");
  //       }
  //     } catch (error: unknown) {
  //       // TypeScript doesn't know the type of 'error', so assert it to be an instance of Error
  //       if (error instanceof Error) {
  //         alert("Error: " + error.message); // Now you can safely access error.message
  //       } else {
  //         alert("An unknown error occurred.");
  //       }
  //     }
  //   };

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         alert(`Error: ${errorData.message}`);
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log("Survey submitted successfully:", data);
  //       alert("Survey submitted successfully!");
  //     } catch (error) {
  //       console.error("Error submitting survey:", error);
  //       alert("An error occurred while submitting the survey.");
  //     }
  //   };
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
