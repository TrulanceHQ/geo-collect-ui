// import { useState, useRef } from "react";
// import axios from "axios";
// import Image from "next/image";

// interface MediaCaptureProps {
//   onUploadSuccess: (url: string) => void;
//   onClose: () => void;
// }

// // const uploadPreset = process.env.NEXT_CLOUDINARY_UPLOAD_PRESET;
// // const cloudName = process.env.NEXT_CLOUDINARY_CLOUD_NAME;

// const uploadPreset = "geo-collect";
// const cloudName = "dc2qyc09d"


// export default function MediaCapture({ onUploadSuccess, onClose }: MediaCaptureProps) {
//   const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [capturingImage, setCapturingImage] = useState(false);
//   const [useFrontCamera, setUseFrontCamera] = useState(true);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const getConstraints = (type: "video" | "audio") => {
//     const videoConstraints = {
//       facingMode: useFrontCamera ? "user" : "environment",
//     };
//     return type === "video"
//       ? { video: videoConstraints, audio: true }
//       : { audio: true };
//   };

//   // Start recording video or audio
//   const startCapture = async (type: "video" | "audio") => {
//     try {
//       setIsRecording(true);
//       const constraints: MediaStreamConstraints = type === "video"
//         ? { video: { facingMode: "user" }, audio: true }
//         : { audio: true };

//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       streamRef.current = stream;

//       if (type === "video" && videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       const recorder = new MediaRecorder(stream);
//       const chunks: BlobPart[] = [];

//       recorder.ondataavailable = (event) => chunks.push(event.data);
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: type === "video" ? "video/mp4" : "audio/mpeg" });
//         setMediaBlob(blob);
//         setPreviewUrl(URL.createObjectURL(blob));
//         setIsRecording(false);
//         stream.getTracks().forEach((track) => track.stop());
//       };

//       mediaRecorder.current = recorder;
//       recorder.start();

//       // Stop after 15 seconds
//       setTimeout(() => recorder.stop(), 7000);
      
//     } catch (error) {
//       console.error("Error capturing media:", error);
//     }
//   };

//   // Capture image
//   const captureImage = async () => {
//     try {
//       setCapturingImage(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
//       streamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       setTimeout(() => {
//         if (canvasRef.current && videoRef.current) {
//           const context = canvasRef.current.getContext("2d");
//           if (context) {
//             context.drawImage(videoRef.current, 0, 0, 300, 200);
//             canvasRef.current.toBlob((blob) => {
//               if (blob) {
//                 setMediaBlob(blob);
//                 setPreviewUrl(URL.createObjectURL(blob));
//               }
//             }, "image/png");
//           }
//         }
//         stream.getTracks().forEach((track) => track.stop());
//         setCapturingImage(false);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Error capturing image:", error);
//     }
//   };

//   // Upload to Cloudinary
//   const uploadToCloudinary = async () => {
//     if (!mediaBlob) return;
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", mediaBlob);

//     if (!uploadPreset) {
//       console.error("Cloudinary upload preset is not defined");
//       setUploading(false);
//       return;
//     }
//     formData.append("upload_preset", uploadPreset);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//         formData
//       );
//       onUploadSuccess(response.data.secure_url);
//     } catch (error) {
//       console.error("Upload failed", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     // <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//       <div className="bg-white mt-10 p-6 rounded-lg shadow-lg w-[60%] relative ml-[20%]">
      
//         <h2 className="mt-4 text-lg font-semibold text-center mb-10">Capture Media</h2>

//         {/* Show live camera feed while recording or capturing */}
//         {(isRecording || capturingImage) && (
//           <video ref={videoRef} className="w-full h-48 bg-black" autoPlay muted />
//         )}

//         {/* Show captured image preview */}
//           {previewUrl && (
//             <Image src={previewUrl} className="w-full h-48 object-cover" alt="Captured" layout="responsive" width={300} height={200} />
//           )}

//         {/* Show video/audio preview after recording */}
//         {previewUrl && mediaBlob?.type.includes("video") && (
//           <video src={previewUrl} controls className="w-full bg-black" />
//         )}

//         {/* Show recording/capturing status */}
//         {isRecording && <p className="mt-4 text-red-500 font-bold text-center">Recording... (7s max)</p>}
//         {capturingImage && <p className="mt-4 text-blue-500 font-bold text-center">Capturing Image...</p>}

//         {/* Canvas for image capture */}
//         <canvas ref={canvasRef} className="hidden" width="300" height="200"></canvas>

//         {/* Buttons */}
//         {!isRecording && !capturingImage && !previewUrl && (
//           <div className="space-y-1">
//             <button onClick={() => startCapture("video")} className="w-full p-2 bg-blue-500 text-white rounded">
//               Record Video (7s)
//             </button>
//             <button onClick={() => startCapture("audio")} className="w-full p-2 bg-green-500 text-white rounded">
//               Record Audio (7s)
//             </button>
//             <button onClick={captureImage} className="w-full p-2 bg-yellow-500 text-white rounded">
//               Capture Image
//             </button>
//           </div>
//         )}

//         {/* Wait button while recording/capturing */}
//         {(isRecording || capturingImage) && (
//           <button className="mt-4 w-full p-2 bg-gray-500 text-white rounded" disabled>
//             Wait...
//           </button>
//         )}

//         {/* Show Cancel + Upload after recording/capturing */}
//         {previewUrl && (
//           <div className="mt-4 flex gap-2">
//             <button onClick={() => { setPreviewUrl(null); setMediaBlob(null); }} className="w-1/2 p-2 bg-red-500 text-white rounded">
//               Cancel
//             </button>
//             <button onClick={uploadToCloudinary} className="w-1/2 p-2 bg-purple-500 text-white rounded" disabled={uploading}>
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         )}
//       </div>
//     // </div>
//   );
// }

import { useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";

interface MediaCaptureProps {
  onUploadSuccess: (url: string) => void;
  onClose: () => void;
}

const uploadPreset = "geo-collect";
const cloudName = "dc2qyc09d";

// export default function MediaCapture({ onUploadSuccess }: MediaCaptureProps) {
//   const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [capturingImage, setCapturingImage] = useState(false);
//   const [useFrontCamera, setUseFrontCamera] = useState(true);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const mediaRecorder = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const getConstraints = (type: "video" | "audio") => {
//     const videoConstraints = {
//       facingMode: useFrontCamera ? "user" : "environment",
//     };
//     return type === "video"
//       ? { video: videoConstraints, audio: true }
//       : { audio: true };
//   };

//   // Start recording video or audio
//   const startCapture = async (type: "video" | "audio") => {
//     try {
//       setIsRecording(true);
//       const constraints = getConstraints(type);

//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       streamRef.current = stream;

//       if (type === "video" && videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       const recorder = new MediaRecorder(stream);
//       const chunks: BlobPart[] = [];

//       recorder.ondataavailable = (event) => chunks.push(event.data);
//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: type === "video" ? "video/mp4" : "audio/mpeg" });
//         setMediaBlob(blob);
//         setPreviewUrl(URL.createObjectURL(blob));
//         setIsRecording(false);
//         stream.getTracks().forEach((track) => track.stop());
//       };

//       mediaRecorder.current = recorder;
//       recorder.start();

//       // Stop after 7 seconds
//       setTimeout(() => recorder.stop(), 7000);
      
//     } catch (error) {
//       console.error("Error capturing media:", error);
//     }
//   };

//   // Capture image
//   const captureImage = async () => {
//     try {
//       setCapturingImage(true);
//       const constraints = getConstraints("video");
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       streamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }

//       setTimeout(() => {
//         if (canvasRef.current && videoRef.current) {
//           const context = canvasRef.current.getContext("2d");
//           if (context) {
//             context.drawImage(videoRef.current, 0, 0, 300, 200);
//             canvasRef.current.toBlob((blob) => {
//               if (blob) {
//                 setMediaBlob(blob);
//                 setPreviewUrl(URL.createObjectURL(blob));
//               }
//             }, "image/png");
//           }
//         }
//         stream.getTracks().forEach((track) => track.stop());
//         setCapturingImage(false);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Error capturing image:", error);
//     }
//   };

//   // Upload to Cloudinary
//   const uploadToCloudinary = async () => {
//     if (!mediaBlob) return;
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", mediaBlob);

//     if (!uploadPreset) {
//       console.error("Cloudinary upload preset is not defined");
//       setUploading(false);
//       return;
//     }
//     formData.append("upload_preset", uploadPreset);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
//         formData
//       );
//       onUploadSuccess(response.data.secure_url);
//     } catch (error) {
//       console.error("Upload failed", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     // <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//       <div className="my-10 bg-white p-6 rounded-lg shadow-lg w-[60%] ml-[20%]">

//         <h2 className=" text-lg font-semibold text-center mb-10">Capture Media</h2>

//         {/* Show live camera feed while recording or capturing */}
//         {(isRecording || capturingImage) && (
//           <video ref={videoRef} className="w-full h-48 bg-black" autoPlay muted />
//         )}

//         {/* Show captured image preview */}
//         {previewUrl && (
//           <Image src={previewUrl} className="w-full h-48 object-cover" alt="Captured" layout="responsive" width={300} height={200} />
//         )}

//         {/* Show video/audio preview after recording */}
//         {previewUrl && mediaBlob?.type.includes("video") && (
//           <video src={previewUrl} controls className="w-full bg-black" />
//         )}

//         {/* Show recording/capturing status */}
//         {isRecording && <p className="mt-4 text-red-500 font-bold text-center">Recording... (7s max)</p>}
//         {capturingImage && <p className="mt-4 text-blue-500 font-bold text-center">Capturing Image...</p>}

//         {/* Canvas for image capture */}
//         <canvas ref={canvasRef} className="hidden" width="300" height="200"></canvas>

//         {/* Buttons */}
//         {!isRecording && !capturingImage && !previewUrl && (
//           <div className="space-y-1">
//             <button onClick={() => startCapture("video")} className="w-full p-2 bg-blue-500 text-white rounded">
//               Record Video (7s)
//             </button>
//             <button onClick={() => startCapture("audio")} className="w-full p-2 bg-green-500 text-white rounded">
//               Record Audio (7s)
//             </button>
//             <button onClick={captureImage} className="w-full p-2 bg-yellow-500 text-white rounded">
//               Capture Image
//             </button>
//             <button onClick={() => setUseFrontCamera(!useFrontCamera)} className="w-full p-2 bg-gray-500 text-white rounded">
//               Switch to {useFrontCamera ? "Back" : "Front"} Camera
//             </button>
//           </div>
//         )}

//         {/* Wait button while recording/capturing */}
//         {(isRecording || capturingImage) && (
//           <button className="mt-4 w-full p-2 bg-gray-500 text-white rounded" disabled>
//             Wait...
//           </button>
//         )}

//         {/* Show Cancel + Upload after recording/capturing */}
//         {previewUrl && (
//           <div className="mt-4 flex gap-2">
//             <button onClick={() => { setPreviewUrl(null); setMediaBlob(null); }} className="w-1/2 p-2 bg-red-500 text-white rounded">
//               Cancel
//             </button>
//             <button onClick={uploadToCloudinary} className="w-1/2 p-2 bg-purple-500 text-white rounded" disabled={uploading}>
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         )}
//       </div>
//     // </div>
//   );
// }


export default function MediaCapture({ onUploadSuccess }: MediaCaptureProps) {
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturingImage, setCapturingImage] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getConstraints = () => {
    return {
      video: { facingMode: useFrontCamera ? "user" : "environment" },
    };
  };

  // Start recording audio
  const startCaptureAudio = async () => {
    try {
      setIsRecording(true);
      const constraints = { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mpeg" });
        setMediaBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current = recorder;
      recorder.start();

      // Stop after 20 seconds
      setTimeout(() => recorder.stop(), 20000);
      
    } catch (error) {
      console.error("Error capturing audio:", error);
    }
  };

  // Capture image
  const captureImage = async () => {
    try {
      setCapturingImage(true);
      const constraints = getConstraints();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setTimeout(() => {
        if (canvasRef.current && videoRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
            context.drawImage(videoRef.current, 0, 0, 300, 200);
            canvasRef.current.toBlob((blob) => {
              if (blob) {
                setMediaBlob(blob);
                setPreviewUrl(URL.createObjectURL(blob));
              }
            }, "image/png");
          }
        }
        stream.getTracks().forEach((track) => track.stop());
        setCapturingImage(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async () => {
    if (!mediaBlob) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", mediaBlob);

    if (!uploadPreset) {
      console.error("Cloudinary upload preset is not defined");
      setUploading(false);
      return;
    }
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );
      onUploadSuccess(response.data.secure_url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
      <div className="mt-10 bg-white p-6 rounded-lg shadow-lg w-[60%] ml-[20%]">
        <h2 className="text-lg font-semibold text-center mb-10">Capture Media</h2>

        {/* Show live camera feed while capturing */}
        {capturingImage && (
          <video ref={videoRef} className="w-full h-48 bg-black" autoPlay muted />
        )}

        {/* Show captured image preview */}
        {previewUrl && (
          <Image src={previewUrl} className="w-full h-48 object-cover" alt="Captured" layout="responsive" width={300} height={200} />
        )}

        {/* Show audio preview after recording */}
        {previewUrl && mediaBlob?.type.includes("audio") && (
          <audio src={previewUrl} controls className="w-full" />
        )}

        {/* Show recording/capturing status */}
        {isRecording && <p className="mt-4 text-red-500 font-bold text-center">Recording... (7s max)</p>}
        {capturingImage && <p className="mt-4 text-blue-500 font-bold text-center">Capturing Image...</p>}

        {/* Canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" width="300" height="200"></canvas>

        {/* Buttons */}
        {!isRecording && !capturingImage && !previewUrl && (
          <div className="space-y-1">
            <button onClick={startCaptureAudio} className="w-full p-2 bg-green-500 text-white rounded">
              Record Audio (7s)
            </button>
            <button onClick={captureImage} className="w-full p-2 bg-yellow-500 text-white rounded">
              Capture Image
            </button>
            <button onClick={() => setUseFrontCamera(!useFrontCamera)} className="w-full p-2 bg-gray-500 text-white rounded">
              Use {useFrontCamera ? "Back" : "Front"} Camera
            </button>
          </div>
        )}

        {/* Wait button while recording/capturing */}
        {(isRecording || capturingImage) && (
          <button className="mt-4 w-full p-2 bg-gray-500 text-white rounded" disabled>
            Wait...
          </button>
        )}

        {/* Show Cancel + Upload after recording/capturing */}
        {previewUrl && (
          <div className="mt-4 flex gap-2">
            <button onClick={() => { setPreviewUrl(null); setMediaBlob(null); }} className="w-1/2 p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
            <button onClick={uploadToCloudinary} className="w-1/2 p-2 bg-purple-500 text-white rounded" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </div>
  );
}
