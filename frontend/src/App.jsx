import React, { useState, useEffect } from "react";
import CameraCapture from "./components/CameraCapture";
import ImageUpload from "./components/ImageUpload";
import ResultCard from "./components/ResultCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgPos, setBgPos] = useState(0); // For parallax scroll

  const analyzeFile = async (file) => {
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("image", file);

      // Backend URL - change if hosted elsewhere
      const resp = await fetch(
        process.env.REACT_APP_API_URL || "http://localhost:5000/analyze",
        {
          method: "POST",
          body: form,
        }
      );
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ error: e.message || "Error analyzing image" });
    } finally {
      setLoading(false);
    }
  };

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setBgPos(window.scrollY * 0.5); // Adjust speed here
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')", backgroundPositionY: `${bgPos}px` }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-extrabold mb-3 text-gray-900">
            PixProof — Real or Fake
          </h1>
          <p className="text-gray-500 mb-6">
            Upload an image or use your camera. GPT verdict = “Fake/Synthetic”
            when ensemble score &gt; 0.5.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CameraCapture onCapture={analyzeFile} />
            <ImageUpload onUpload={analyzeFile} />
          </div>

          <div className="mt-8">
            {loading && (
              <div className="text-center py-6 text-gray-600 font-medium">
                Analyzing...
              </div>
            )}
            {result && <ResultCard result={result} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
