// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { login } from "@/services/apiService";
// import { ClipLoader } from "react-spinners";
// import Image from "next/image";

// export default function SignInPage() {
//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("enumerator");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const data = await login(emailAddress, password);
//       const role = data.role || data?.user?.role;
//       const token = data.accessToken || data?.user?.accessToken;
//       const selectedState = data.selectedState || data?.user?.selectedState;

//       if (role) {
//         // Store user role in localStorage or a global state
//         localStorage.setItem("userRole", role);
//         localStorage.setItem("accessToken", token);
//         localStorage.setItem("selectedState", selectedState);

//         if (rememberMe) {
//           localStorage.setItem("emailAddress", emailAddress);
//           localStorage.setItem("password", password);
//         } else {
//           localStorage.removeItem("emailAddress");
//           localStorage.removeItem("password");
//         }

//         switch (role) {
//           case "admin":
//             router.push("/admin");
//             break;
//           case "enumerator":
//             router.push("/enumerators-flow");
//             break;
//           case "fieldCoordinator":
//             router.push("/field-coordinators-flow");
//             break;
//           default:
//             router.push("/dashboard");
//         }
//       } else {
//         console.error("No role found in response.");
//       }
//     } catch (error) {
//       setError("Login failed. Please check your credentials and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <div className="flex justify-center items-center mb-5">
//           <Image
//             src="/geotrak-icon.png"
//             alt="Geotrak Logo"
//             width={60}
//             height={50}
//             priority
//           />
//         </div>

//         <h2 className="text-2xl font-semibold mb-4 text-center mt-5">
//           Sign In
//         </h2>

//         {/* Email */}
//         <label className="block mb-2 font-medium">Email:</label>
//         <input
//           type="email"
//           className="w-full p-2 border rounded-md mb-4"
//           placeholder="Enter your email"
//           value={emailAddress}
//           onChange={(e) => setEmailAddress(e.target.value)}
//         />

//         {/* Password */}
//         <label className="block mb-2 font-medium">Password:</label>
//         <input
//           type="password"
//           className="w-full p-2 border rounded-md mb-4"
//           placeholder="Enter your password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* Role Selection */}
//         <label className="block mb-2 font-medium">Sign in as:</label>

//         {/* Error Message */}
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {/* Remember Me */}
//         <div className="flex items-center mb-4">
//           <input
//             type="checkbox"
//             className="mr-2"
//             checked={rememberMe}
//             onChange={() => setRememberMe(!rememberMe)}
//           />
//           <label className="text-sm">Remember Me</label>
//         </div>

//         {/* Spinner */}
//         {loading && (
//           <div className="flex justify-center mb-4">
//             <ClipLoader size={35} color={"#123abc"} loading={loading} />
//           </div>
//         )}

//         {/* Sign In Button */}
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full"
//           onClick={handleLogin}
//         >
//           Sign In
//         </button>

//         {/* Forgot Password */}
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Forgot password?{" "}
//           <a href="#" className="text-blue-500">
//             Reset here
//           </a>
//         </p>
//       </div>
//     </>
//   );
// }

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { requestDemo } from "@/services/apiService";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex-none">
        <Hero />
      </div>
      <div className="flex-none">
        <Partners />
      </div>
      <div className="flex-none">
        <FeaturesOverview />
      </div>
      <div className="flex-none">
        <GeotrakUseCases />
      </div>
      <div className="flex-none">
        <PromoBanner />
      </div>
      <div className="flex-none">
        <FAQSection />
      </div>
      <div className="flex-none">
        <CTASection />
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </main>
  );
}

function DemoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestDemo({ fullName, email, phone });
      // reset form
      setFullName("");
      setEmail("");
      setPhone("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Request a Demo</h2>
        {/* <form className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
            />
          </div>
          <div>
            <input
              type="tel"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0052CC] text-white py-2 rounded-lg hover:bg-[#0041A3] transition"
          >
            Submit
          </button>
        </form> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Phone Number"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0052CC] text-white py-2 rounded-lg hover:bg-[#0041A3] transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-white to-blue-50">
      <nav className="">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/geotrak.png"
              alt="Geotrak Logo"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>

          <div className="hidden md:flex space-x-8">
            {["Features", "Use Cases", "FAQ"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center">
            <a
              href="#"
              className="hidden md:inline-block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setModalOpen(true)}
            >
              Request a Demo
            </a>

            <button
              className="md:hidden ml-3 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-4 space-y-2">
              {["Features", "Use Cases", "FAQs"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="block text-gray-600 hover:text-gray-900 transition"
                >
                  {label}
                </a>
              ))}
              <a
                href="#"
                className="block mt-2 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-100 transition"
                onClick={() => setModalOpen(true)}
              >
                Request a Demo
              </a>
            </div>
          </div>
        )}
      </nav>

      <header className="flex-grow flex items-center">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Seamless Data Collection with Location & Media Tracking
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-base md:text-lg">
            Geotrak lets your team capture photos, videos, audio, and
            geolocation data in real-time, perfect for surveys, inspections, and
            on-the-ground reporting.
          </p>
          <button
            className="mt-8 px-8 py-3 text-white rounded-lg bg-[#0052CC] hover:bg-[#0041A3] transition-colors duration-300 ease-in-out"
            onClick={() => setModalOpen(true)}
          >
            Request a Demo
          </button>
        </div>
      </header>
      <DemoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function Partners() {
  const [isModalOpen, setModalOpen] = useState(false);
  const logos = [
    "/asset/logos/gear.png",
    "/asset/logos/intellex.png",
    "/asset/logos/digiplusalliance.png",
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-center mb-6 text-2xl sm:text-3xl md:text-4xl font-semibold">
          Partners
        </h2> */}

        <div className="rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {logos.map((src, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 relative"
              >
                <Image
                  src={src}
                  alt={`Partner logo ${idx + 1}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesOverview() {
  const items = [
    {
      key: "multimedia",
      title: "Multimedia & Form Capture",
      desc: "Capture geo‑tagged photos, videos, audio, and form data from any device, automatically time and location‑stamped.",
      outerClass: "bg-[#0052CC] text-white",
    },
    {
      key: "collab",
      title: "Effortless Field Collaboration",
      desc: "Team members can capture and submit field data simultaneously from multiple locations, keeping everyone aligned and accelerating decision‑making.",
      outerClass: "bg-[#FF6D00] text-white",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          Data Collection, Anywhere, Any Workflow
        </h2>
        <p className="mt-4 text-gray-600">
          Geotrak helps teams capture accurate, location‑verified media and form
          data in the field, all organized and downloadable in CSV format for
          streamlined oversight and documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
        <div className="relative rounded-2xl overflow-hidden shadow-lg lg:row-span-2 min-h-[32rem] h-full flex flex-col">
          <Image
            src="/asset/featImg1.png"
            alt="Location‑Verified Multimedia Capture"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
            <h3 className="text-3xl font-bold text-white mb-2">
              Location‑Verified Multimedia Capture
            </h3>
            <p className="text-sm text-gray-200">
              Capture photos, videos, and audio logs, all automatically tagged
              with accurate location and timestamp, ensuring authenticity and
              traceability.
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl p-8 flex flex-col justify-end h-full ${items[0].outerClass} lg:col-span-2 min-h-[16rem]`}
        >
          <h3 className="text-3xl font-bold text-white mb-2">
            {items[0].title}
          </h3>
          <p className="text-sm leading-relaxed">{items[0].desc}</p>
        </div>

        <div
          className={`rounded-2xl p-8 flex flex-col justify-end h-full ${items[1].outerClass} min-h-[16rem]`}
        >
          <h3 className="text-3xl font-bold text-white mb-2">
            {items[1].title}
          </h3>
          <p className="text-sm leading-relaxed">{items[1].desc}</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[16rem] h-full flex flex-col">
          <Image
            src="/asset/featImg2.png"
            alt="Seamless Data Export"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
            <h3 className="text-3xl font-bold text-white mb-2">
              Seamless Data Export
            </h3>
            <p className="text-sm text-gray-200">
              Download your collected data, including media references and form
              entries, in CSV format for further processing, sharing, or
              analysis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeotrakUseCases() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Explore Geotrak in Action</h2>
        <p className="mt-2 text-gray-600">
          Discover how Geotrak is transforming data collection for field
          reporting, surveys, inspections, and real‑time documentation.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-6">
        <div className="relative w-full md:w-1/2 h-[30rem] sm:h-[20rem] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/asset/geotrakinaction.png"
            alt="Geotrak in action"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="w-full md:w-1/2 bg-[#0052CC] text-white rounded-xl p-6 flex flex-col justify-center space-y-6 shadow-lg">
          {[
            {
              title: "Field Reporting",
              desc: "Geotrak enables precise location tracking and seamless media capture for on‑the‑go reporting in the field.",
            },
            {
              title: "Surveys",
              desc: "Streamline your survey process with accurate location data, photos, videos, and audio for comprehensive feedback.",
            },
            {
              title: "Inspections",
              desc: "Capture on‑site photos, videos, & audio, all tagged with precise location data for thorough inspections & evaluations.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center">
        {/* Left Side: Text Block */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Capture and Document with Precision
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Whether you're conducting surveys, inspections, or reporting events,
            Geotrak lets you track locations and capture photos, videos, and
            audio seamlessly and in real time.
          </p>
          <button
            className="mt-8 px-8 py-3 text-white rounded-lg bg-[#0052CC] hover:bg-[#0041A3] transition-colors duration-300 ease-in-out"
            onClick={() => setModalOpen(true)}
          >
            Request a Demo
          </button>
        </div>
        {/* Right Side: Image */}
        <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
            <Image
              src="/asset/captureanddocument.png"
              alt="captureanddocument"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <DemoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center py-4 focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <svg
          className={`w-6 h-6 transition-transform transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <p className="text-gray-600 pb-4">{answer}</p>}
    </div>
  );
}

//
// FAQ Section Component – renders a list of FAQ items
//
interface FAQData {
  question: string;
  answer: string;
}
function FAQSection() {
  const faqData: FAQData[] = [
    {
      question: "What is Geotrak?",
      answer:
        "Geotrak is a data collection tool that enables users to track locations and capture photos, videos, and audio in real-time, making it ideal for inspections, surveys, reporting, and more.",
    },
    {
      question: "Who can use Geotrak?",
      answer:
        "Geotrak is designed for professionals and teams across industries, whether you're conducting audits, running surveys, or documenting events on the go.",
    },
    {
      question: "What types of media can I capture with Geotrak?",
      answer:
        "You can capture high-quality photos, record videos, and even take audio notes, all of which are automatically tagged with location metadata for accurate documentation.",
    },
    {
      question: "Is the data captured by Geotrak secure?",
      answer:
        "Absolutely. Geotrak uses encrypted storage and secure data transfer protocols to ensure your captured information remains protected and confidential.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-gray-600">
            Learn more about how Geotrak simplifies real-time data collection
            and documentation.
          </p>
        </header>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
function CTASection() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="bg-[#0052CC] rounded-2xl shadow-lg max-w-3xl w-full text-center 
                      px-8 sm:px-12 lg:px-16 
                      py-12 sm:py-16 lg:py-20 
                      mx-auto"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-white">
          See Geotrak in action
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-white mb-6">
          Discover how Geotrak simplifies location-tagged data collection and
          real-time media documentation. Get a firsthand look at how it works.
        </p>
        <button
          className="px-8 py-3 text-black rounded-lg bg-[#FFFFFF] hover:bg-[#D9D9D9] transition-colors duration-300 ease-in-out"
          onClick={() => setModalOpen(true)}
        >
          Request a Demo
        </button>
      </div>
      <DemoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white text-black w-full ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-0 border-b border-gray-300 pb-6">
          {/* Brand & Contact */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src="/geotrak-icon.png"
                alt="Geotrak logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="text-sm leading-relaxed">
              <h2 className="text-xl font-bold">Geotrak</h2>
              {/* <p>Email: support@geotrak.app</p> */}
              <p>Phone: +234 913 246 2410</p>
              <p>Address: 41, CMD Road, Lagos</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center text-sm space-x-4">
            {["Features", "Use Cases", "FAQs"].map((label) => (
              <Link
                key={label}
                href={"#" + label.toLowerCase().replace(/\s+/g, "-")}
                className="hover:text-gray-700"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 text-center text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Geotrak. All rights reserved.</p>
          {/* <div className="space-x-4">
            <Link href="#" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/t#" className="hover:text-gray-700">
              Terms of Service
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
