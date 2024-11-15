import { Appbar } from "../components/Appbar";
import axios from "axios";
import { ApiKeyGemini, BACKEND_URL ,ApiKeyLlama } from "../config";
import { useState } from "react";

import LlamaAI from 'llamaai';

import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadcheck , setLoadcheck] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found. Please login again.");
        navigate("/signin");
        return;
      }

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/blog/add`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      const data = res.data.id;
      navigate(`/blog/${data}`);
    } catch (e: any) {
      console.error(e.response?.data || e.message);
      alert("Error while publishing the post. Check console for details.");
    }
  };

  const handleGenerateContent = async () => {
    if (!title) {
      alert("Please provide a title before generating content.");
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI(`${ApiKeyGemini}`); // Initialize with environment variable
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate content with Google Gemini API
      const result = await model.generateContent(`Write a article (without giving the topic name in response) the following topic: ${title}`);
      const gptContent = await result.response.text();

      setContent(gptContent.trim()); // Set the generated content into the content box
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlellama = async()=>{

    if (!title) {
      alert("Please provide a title before generating content.");
      return;
    }

    setLoading(true);

    const llamaAPI = new LlamaAI(`${ApiKeyLlama}`); 
    console.log("Llama API Key:", ApiKeyLlama);
    const request = {
      messages: [
        {
          role: "user",
          content: `Write a article about the following topic: ${title}`,
        },
      ],
      stream: false,
    };

    try {
      const response = await llamaAPI.run(request);
      const gptContent = response.choices[0].message.content; // Adjust based on Llama API's response structure
      setContent(gptContent.trim());
    } catch (error: any) {
      if (error.response) {
        console.error("API Error Response:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Unknown Error:", error.message || error);
        alert("Unexpected error occurred.");
      }
    }finally {
      setLoading(false);
    }
  };



  const handleCheckError = async()=>{
    if (!content) {
      alert("Please provide content before checking error.");
      return;
    }

    setLoadcheck(true);
  try{
    const genAI = new GoogleGenerativeAI(`${ApiKeyGemini}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result =  await model.generateContent(`correct grammatical errors ${content}`);
  const gptContent = await result.response.text();
  setContent(gptContent.trim()); 
}catch(e){
  console.error("error while checking grammatical mistake",e);
  alert("Failed to check grammar. Please try again.");
}finally {
  setLoadcheck(false);
}
    
  }

  return (
    <div>
      <Appbar />
      <div className="px-10">
        <div>
          <label className="block mb-2 mt-2 text-sm font-medium text-gray-900">Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-3 m-1"
            placeholder="Title"
            required
          />
          <button
            onClick={handleGenerateContent}
            type="button"
            className="text-xs italic text-blue-400"
            disabled={loading}
          >
            {loading ? "Generating..." : "@Generate Content through AI"}
          </button>
          


          <div className="pt-5">
            <label id="message" className="block mb-2 font-semibold">Content
            <button  onClick={handleCheckError} className=" pl-4 text-xs italic text-blue-400">
            {loadcheck ? "checking..." : "@check grammatical mistake"}
            </button>
            </label>
            
            <textarea
              onChange={(e) => setContent(e.target.value)}
              id="message"
              rows={12}
              className="block p-5 mb-5 w-[90vw] rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your thoughts here..."
              value={content}
            ></textarea>
          </div>

          <button
            onClick={handlePublish}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gray-900 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-gray-800"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};
