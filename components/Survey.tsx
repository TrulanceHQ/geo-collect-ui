/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchQuestionnaires,
  submitQuestionnaire,
} from "@/services/apiService";
import { requestLocationPermission } from "@/services/util-services";
import SubmissionSuccessModal from "@/components/SubmissionSuccessModal";
import LocationApprovalModal from "@/components/LocationApprovalModal";
import MediaCapture from "@/components/MediaCapture";
import { toast } from "react-toastify";
import './../styles/globals.css';

type SurveyFormProps = {
  isOpen: boolean;
  onClose: () => void;
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string;
  };
  initialLocation: {
    latitude: number | null;
    longitude: number | null;
    address: string;
  };
};

interface Option {
  value: string;
  nextSection: number | null;
}

interface Question {
  question: string;
  type: string;
  options: Option[];
  _id: string;
  likertQuestions: { question: string; options: string[] }[];
}

interface Section {
  title: string;
  questions: Question[];
}

interface SurveyData {
  _id: string;
  title: string;
  subtitle: string;
  sections: Section[];
}

export default function SurveyForm({
  isOpen,
  onClose,
  initialLocation,
}: SurveyFormProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [responses, setResponses] = useState<{
    [key: string]: string | string[] | undefined;
  }>({});
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLocationApprovalModal, setShowLocationApprovalModal] =
    useState(false);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [navigatedByNextSection, setNavigatedByNextSection] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [mediaCaptured, setMediaCaptured] = useState(false);

  // Initialize state for start time
  const [startTime, setStartTime] = useState<Date | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Set the start time once when the modal becomes open
  useEffect(() => {
    if (isOpen && !startTimeRef.current) {
      startTimeRef.current = new Date();
      setStartTime(startTimeRef.current);
    }
  }, [isOpen]);

  // Fetch survey data when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchQuestionnaires()
        .then(({ surveys }) => {
          if (surveys?.length > 0) {
            const lastSurvey = surveys[surveys.length - 1];
            setSurveyData(lastSurvey);
            setSurveyId(lastSurvey._id);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching survey data:", error);
          setLoading(false);
        });
    }
  }, [isOpen, surveyId]);

  const sections = surveyData?.sections || [];
  const currentSection = sections[currentSectionIndex] || {
    title: "",
    questions: [],
  };
  const currentQuestion = currentSection.questions[currentQuestionIndex] || {
    question: "",
    type: "text",
    options: [],
    likertQuestions: [],
  };

  const handleNext = () => {
    if (
      currentQuestion &&
      currentQuestion.options &&
      currentQuestion.options.length > 0
    ) {
      const selectedOption = currentQuestion.options.find(
        (option) => option.value === responses[currentQuestion._id]
      );
      if (selectedOption && selectedOption.nextSection !== null) {
        // Convert 1-based nextSection to 0-based index
        const nextSectionIndex = selectedOption.nextSection - 1;
        if (nextSectionIndex >= 0 && nextSectionIndex < sections.length) {
          setCurrentSectionIndex(nextSectionIndex);
          setCurrentQuestionIndex(0);
          setNavigatedByNextSection(true);
          setIsLastQuestion(false);
          return;
        }
      }
    }

    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (navigatedByNextSection) {
      handleSubmit();
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }

    // Check if this is the last question in the section
    if (currentQuestionIndex === currentSection.questions.length - 1) {
      setIsLastQuestion(true);
    } else {
      setIsLastQuestion(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(
        sections[currentSectionIndex - 1].questions.length - 1
      );
    }
  };

  const handleResponseChange = (
    questionId: string,
    value: string | string[] | undefined
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Final submission after media upload
  const finalSubmit = async (mediaUrl: string) => {
    if (!location || !location.address) {
      setShowLocationApprovalModal(true);
      return;
    }

    // Fallback: use the captured startTime if available, otherwise assign a new Date.
    const effectiveStartTime = startTime ?? new Date();

    try {
      setLoading(true);
      const formattedResponses = Object.entries(responses).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );
      const payload = {
        responses: formattedResponses,
        surveyId,
        location: location.address,
        mediaUrl,
        startTime: effectiveStartTime, // Ensure a valid Date is passed
      };

      const payloadString = JSON.stringify(payload);
      
      await submitQuestionnaire(JSON.parse(payloadString));      
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
      // setShowMediaUploadModal(false);
    }
  };

  const handleMediaUploadSuccess = async (url: string) => {
    setMediaUrl(url);
    setMediaCaptured(true);
  };

  const handleSubmit = () => {
    if (!location || !location.address) {
      setShowLocationApprovalModal(true);
      return;
    }
    finalSubmit(mediaUrl as string);
  };

  const handleApproveLocation = async () => {
    try {
      const locationData = await requestLocationPermission();
      setLocation(locationData);
      setShowLocationApprovalModal(false);
    } catch (error) {
      toast.error(String(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-10 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-5xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {loading ? (
                <div className="flex justify-center items-center">
                   <div className="spinner"></div>
                 </div>
        ) : (
          <>
            {!mediaCaptured? (
              <MediaCapture
                onUploadSuccess={handleMediaUploadSuccess}
                onClose={() => setShowMediaUploadModal(false)}
              />
            ) : (
              <>
                <h2 className="text-xl font-bold text-center">
                  {surveyData?.title}
                </h2>
                <p className="text-sm text-center text-gray-500">
                  {surveyData?.subtitle}
                </p>

                <div className="relative min-h-[200px] mt-4">
                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div
                        key={currentQuestion._id}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {currentQuestion.question}
                        </h3>

                        {/* Render Question Type */}
                        <div>
                          {currentQuestion.type === "single-choice" &&
                            currentQuestion.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="radio"
                                  name={currentQuestion._id}
                                  value={option.value}
                                  checked={
                                    responses[currentQuestion._id] ===
                                    option.value
                                  }
                                  onChange={() =>
                                    handleResponseChange(
                                      currentQuestion._id,
                                      option.value
                                    )
                                  }
                                  className="w-4 h-4"
                                />
                                <label className="cursor-pointer">
                                  {option.value}
                                </label>
                              </div>
                            ))}

                          {currentQuestion.type === "multiple-choice" &&
                            currentQuestion.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  value={option.value}
                                  checked={
                                    responses[currentQuestion._id]?.includes(
                                      option.value
                                    ) || false
                                  }
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [
                                          ...(responses[
                                            currentQuestion._id
                                          ] || []),
                                          option.value,
                                        ]
                                      : (
                                          responses[
                                            currentQuestion._id
                                          ] as string[] | undefined
                                        )?.filter(
                                          (item) => item !== option.value
                                        );
                                    handleResponseChange(
                                      currentQuestion._id,
                                      newValue
                                    );
                                  }}
                                  className="w-4 h-4"
                                />
                                <label className="cursor-pointer">
                                  {option.value}
                                </label>
                              </div>
                            ))}

                          {currentQuestion.type === "text" && (
                            <textarea
                              className="w-full border p-2 rounded-lg"
                              placeholder="Type your response..."
                              value={responses[currentQuestion._id] || ""}
                              onChange={(e) =>
                                handleResponseChange(
                                  currentQuestion._id,
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {currentQuestion.type === "likert-scale" && (
                            <div className="space-y-4">
                              {currentQuestion.likertQuestions.map(
                                (likertQ, idx) => (
                                  <div key={idx} className="flex flex-col">
                                    <span className="font-medium">
                                      {likertQ.question}
                                    </span>
                                    <div className="flex flex-wrap justify-between mt-2 gap-2">
                                      {likertQ.options.map(
                                        (option, optionIdx) => (
                                          <label
                                            key={optionIdx}
                                            className="flex flex-col items-center"
                                          >
                                            <input
                                              type="radio"
                                              name={`${currentQuestion._id}-${idx}`}
                                              value={option}
                                              checked={
                                                responses[
                                                  `${currentQuestion._id}-${idx}`
                                                ] === option
                                              }
                                              onChange={() =>
                                                handleResponseChange(
                                                  `${currentQuestion._id}-${idx}`,
                                                  option
                                                )
                                              }
                                              className="w-4 h-4"
                                            />
                                            <span className="text-sm">
                                              {option}
                                            </span>
                                          </label>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
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
                    disabled={
                      currentSectionIndex === 0 && currentQuestionIndex === 0
                    }
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    onClick={isLastQuestion ? () => finalSubmit(mediaUrl as string) : handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {isLastQuestion ? "Submit" : "Next"}
                  </button>
                </div>
              </>
            )}

            {/* Success Modal */}
            <SubmissionSuccessModal
              isOpen={showSuccessModal}
              onClose={() => {
                setShowSuccessModal(false);
                onClose();
              }}
            />

            {/* Location Approval Modal */}
            <LocationApprovalModal
              isOpen={showLocationApprovalModal}
              onClose={() => setShowLocationApprovalModal(false)}
              onApprove={handleApproveLocation}
            />
          </>
        )}
      </div>
    </div>
  );
}
