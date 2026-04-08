import axios from "axios"; // 🔥 MUST HAVE

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("http://127.0.0.1:8000/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // ✅ JSON
};
