import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchQuestionnaires, submitQuestionnaire } from "@/services/apiService";
import SubmissionSuccessModal from "./SubmissionSuccessModal";
import { toast } from "react-toastify";

interface SurveyFormProps {
  isOpen: boolean;
  onClose: () => void;
  location: { latitude: number; longitude: number; address?: string } | null;
}

export default function SurveyForm({ isOpen, onClose, location }: SurveyFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  interface SurveyData {
    _id: string;
    title: string;
    subtitle: string;
    questions: {
      question: string;
      type: string;
      options: string[];
      _id: string;
      likertQuestions: { question: string; options: string[] }[];
    }[];
  }

  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: string | string[] | undefined }>({});
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  // Fetch survey data when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchQuestionnaires()
        .then(({ surveys }) => {
          if (surveys?.length > 0) {
            setSurveyData(surveys[0]);
            setSurveyId(surveys[0]._id);
          }
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Error fetching survey data");
          console.error("Error fetching survey data:", error);
          setLoading(false);
        });
    }
  }, [isOpen, surveyId]);

  const questions = surveyData?.questions || [];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleResponseChange = (questionId: string, value: string | string[] | undefined) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
        const payload = { responses: formattedResponses, surveyId, location: location?.address };
      console.log("Submitting payload:", payload);
      await submitQuestionnaire(payload);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-10 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✖
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading survey...</p>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center">{surveyData?.title}</h2>
            <p className="text-sm text-center text-gray-500">{surveyData?.subtitle}</p>

            <div className="relative min-h-[200px] mt-4">
              <AnimatePresence mode="wait">
                {questions[currentIndex] && (
                  <motion.div
                    key={questions[currentIndex]._id}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <h3 className="text-lg font-semibold mb-2">{questions[currentIndex].question}</h3>

                    {/* Render Question Type */}
                    <div>
                      {questions[currentIndex].type === "single-choice" &&
                        questions[currentIndex].options.map((option: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="radio"
                              name={questions[currentIndex]._id}
                              value={option}
                              checked={responses[questions[currentIndex]._id] === option}
                              onChange={() => handleResponseChange(questions[currentIndex]._id, option)}
                              className="w-4 h-4"
                            />
                            <label className="cursor-pointer">{option}</label>
                          </div>
                        ))}

                      {questions[currentIndex].type === "multiple-choice" &&
                        questions[currentIndex].options.map((option: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              value={option}
                              checked={responses[questions[currentIndex]._id]?.includes(option) || false}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...(responses[questions[currentIndex]._id] || []), option]
                                  : (responses[questions[currentIndex]._id] as string[] | undefined)?.filter(
                                      (item) => item !== option
                                    );
                                handleResponseChange(questions[currentIndex]._id, newValue);
                              }}
                              className="w-4 h-4"
                            />
                            <label className="cursor-pointer">{option}</label>
                          </div>
                        ))}

                      {questions[currentIndex].type === "text" && (
                        <textarea
                          className="w-full border p-2 rounded-lg"
                          placeholder="Type your response..."
                          value={responses[questions[currentIndex]._id] || ""}
                          onChange={(e) => handleResponseChange(questions[currentIndex]._id, e.target.value)}
                        />
                      )}

                        {questions[currentIndex].type === "likert-scale" && (
                          <div className="space-y-4">
                            {questions[currentIndex].likertQuestions.map((likertQ, idx) => (
                              <div key={idx} className="flex flex-col">
                                <span className="font-medium">{likertQ.question}</span>
                                <div className="flex flex-wrap justify-between mt-2 gap-2">
                                  {likertQ.options.map((option: string, optionIdx: number) => (
                                    <label key={optionIdx} className="flex flex-col items-center">
                                      <input
                                        type="radio"
                                        name={`${questions[currentIndex]._id}-${idx}`}
                                        value={option}
                                        checked={responses[`${questions[currentIndex]._id}-${idx}`] === option}
                                        onChange={() => handleResponseChange(`${questions[currentIndex]._id}-${idx}`, option)}
                                        className="w-4 h-4"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded">
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              )}
            </div>


              {/* Success Modal */}
              <SubmissionSuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); onClose(); }} />
          </>
        )}
      </div>
    </div>
  );
}

