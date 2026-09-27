"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!resume || !jobDesc) {
      alert("Please paste both your resume and the job description!");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription: jobDesc }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data.result);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Something went wrong communicating with the server!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6 py-12">
      <h1 className="text-5xl font-bold mb-4 text-blue-400">
        Abdullah's AI Resume Tailor
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Upload your resume. Paste the job description. Let AI do the rest.
      </p>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea 
          className="h-64 p-4 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
          placeholder="Paste your current resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        ></textarea>
        
        <textarea 
          className="h-64 p-4 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
          placeholder="Paste the target job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        ></textarea>
      </div>

      <button 
        onClick={handleOptimize}
        disabled={isLoading}
        className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? "Optimizing with AI..." : "Optimize Resume"}
      </button>

      {/* This section only appears after the AI sends a result back */}
      {result && (
        <div className="w-full max-w-4xl mt-12 bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Your Tailored Resume:</h2>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("Resume successfully copied to your clipboard!");
              }}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>

          <textarea 
            className="w-full h-96 bg-gray-950 text-gray-200 p-4 border border-gray-700 rounded-lg focus:outline-none"
            readOnly
            value={result}
          ></textarea>
        </div>
      )}
    </main>
  );
}