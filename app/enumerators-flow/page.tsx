/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FaPlayCircle } from "react-icons/fa";
import SurveyForm from "@/components/Survey";
import Image from "next/image";
import ProtectedPage from "@/components/ProtectedPage";
import axios from "axios";
import { fetchEnumeratorResponses } from "@/services/apiService";

export default function EnumeratorDashboard() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  interface Response {
    surveyId: string;
    enumeratorId: string;
    responses: {
      questionId: string;
      answer: string | string[];
    }[];
    location: string;
    mediaUrl: string;
    submittedAt: string;
  }

  const [responses, setResponses] = useState<Response[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string;
  }>({
    latitude: null,
    longitude: null,
    address: "",
  });

  useEffect(() => {
    setIsClient(true); 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));
  
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const address = response.data.display_name;
            setLocation((prev) => ({ ...prev, address }));
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data: Response[] = await fetchEnumeratorResponses();
        setResponses(data);
        setTotalResponses(data.length);
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [setResponses]);

  if (!isClient) {
    return null;
  }

  return (
    <ProtectedPage allowedRoles={["enumerator"]} redirectPath="/">
      <div className="relative p-6">
        <h1 style={{ fontSize: "1.4rem" }}>
          <b>Enumerator</b>
        </h1>
        {/* Logo at the top right */}
        <div className="absolute top-4 right-6">
          <Image
            src="/digiplus.png"
            alt="Company Logo"
            width={120}
            height={50}
            priority
          />
        </div>

        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold">Jane Doe</h2>
            <p className="text-gray-600">janedoe@example.com</p>
            <p className="text-gray-600">+234 123 4567</p>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Surveys Completed</h3>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Pending Surveys</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Total Responses</h3>
            <p className="text-2xl font-bold">
              {totalResponses > 0 ? totalResponses : "-"}
            </p>
          </div>
        </div>

        {/* Start Survey Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold">Start a New Survey</h2>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
            onClick={() => setIsSurveyOpen(true)}
          >
            <FaPlayCircle />
            <span>Start Survey</span>
          </button>
        </div>

        {/* View Data Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">View Collected Data</h2>
          <p className="text-gray-600">
            See all the data you&apos;ve gathered from your surveys.
          </p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            View Data
          </button>
        </div>

        {/* Survey Modal */}
        {isSurveyOpen && (
              <SurveyForm 
                isOpen={isSurveyOpen} 
                onClose={() => setIsSurveyOpen(false)} 
                location={location}
                initialLocation={location}
              />
        )}
      </div>
    </ProtectedPage>
  );
}
