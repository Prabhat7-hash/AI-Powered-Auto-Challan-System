import React, { useState } from "react";
import { analyzeImage } from "../services/aiService";

console.log("🚀 AutoDetect component loaded");
function AutoDetect() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

const handleUpload = async () => {
  console.log("🔥 BUTTON CLICKED");

  if (!file) {
    alert("Select file first");
    return;
  }

  try {
    setLoading(true);

    console.log("🚀 Calling API...");

    const data = await analyzeImage(file);

    console.log("✅ API RESPONSE:", data);

    setResult(data);
  } catch (error) {
    console.error("❌ ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🚗 Auto Detection</h2>

      <input
        type="file"
        onChange={(e) => {
          console.log("FILE SELECTED:", e.target.files[0]); // ✅ DEBUG
          setFile(e.target.files[0]);
        }}
      />

      <br />
      <br />

      <button
        style={{ position: "relative", zIndex: 9999 }}
        onClick={handleUpload}
      >
        Analyze Image
      </button>

      <br />
      <br />

      {/* ✅ SHOW RESULT */}
      {result && result.image && result.detections && (
        <div>
          <h3>Detection Result</h3>

          {/* Image */}
          <img
            src={`data:image/jpeg;base64,${result.image}`}
            alt="Result"
            width="500"
          />

          <br />
          <br />

          {/* Detection info */}
          <p>
            <b>Vehicle:</b> {result.detections[0]?.type}
          </p>
          <p>
            <b>Confidence:</b> {result.detections[0]?.confidence?.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default AutoDetect;
