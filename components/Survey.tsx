"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { question: "What is your name?", field: "name", type: "text" },
  { question: "What is your age?", field: "age", type: "number" },
  { 
    question: "What is your favorite color?", 
    field: "color", 
    type: "multiple-choice", 
    options: ["Red", "Blue", "Green", "Yellow"] 
  },
  { 
    question: "Which fruits do you like?", 
    field: "fruits", 
    type: "checkboxes", 
    options: ["Apple", "Banana", "Orange", "Other"] 
  },
  { question: "Please provide additional comments", field: "comments", type: "short-answer" },
];

const SurveyForm: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(0);
  const [otherFruit, setOtherFruit] = useState("");

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const onSubmit = (data: unknown) => {
    if (step < steps.length - 1) {
      nextStep();
    } else {
      // Handle form submission
      console.log(data);
    }
  };
    
const renderQuestion = () => {
    const currentStep = steps[step];
    switch (currentStep.type) {
      case "text":
      case "number":
        return (
          <input
            type={currentStep.type}
            {...register(currentStep.field)}
            className="border p-2 rounded w-full bg-slate-300"
          />
        );
      case "multiple-choice":
        return currentStep.options?.map((option: string) => (
          <label key={option} className="block">
            <input
              type="radio"
              value={option}
              {...register(currentStep.field)}
              className="mr-2"
            />
            {option}
          </label>
        ));
      case "checkboxes":
        return currentStep.options?.map((option: string) => (
          <label key={option} className="block ">
            <input
              type="checkbox"
              value={option}
              {...register(currentStep.field)}
              className="mr-2 text-left"
            />
            {option}
            {option === "Other" && (
              <input
                type="text"
                value={otherFruit}
                onChange={(e) => setOtherFruit(e.target.value)}
                className="border p-2 rounded w-full mt-2 bg-slate-200"
                placeholder="Please specify"
              />
            )}
          </label>
        ));
      case "short-answer":
        return (
          <textarea
            {...register(currentStep.field)}
            className="border p-2 rounded w-full bg-slate-200"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex p-40 items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md ">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-6 items-center justify-center"
            >
                          
            <h2 className="text-xl font-semibold">{steps[step].question}</h2>
            <div className="w-full">
                {renderQuestion()}
              </div>
              <div className="flex justify-between w-full">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Previous
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  );
};

export default SurveyForm;