import { useRef, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import "./upload.css";

export default function Upload() {
  const { uid } = useParams();
  const [method, setMethod] = useState("Upload");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (method === "Camera") navigate(`/camera/${uid}`);
    else if (method === "Upload") navigate(`/upload/${uid}`);
  }, [method, uid, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("Please select an image.");
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setEmotion("");
    setMessage("");
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setEmotion("");
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDetect = async () => {
    if (!selectedFile) return toast.error("Choose an image first.");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const uploadRes = await axios.post(
        `${import.meta.env.VITE_EXPRESS_API}/api/upload/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imgUrl = uploadRes.data?.imgUrl;
      if (!imgUrl) throw new Error("Upload failed. No image URL returned.");

      const emotionRes = await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/emotion/from-url`, {
        uid,
        imgUrl,
      });

      const { emotion, message } = emotionRes.data;
      if (emotion) {
        setEmotion(emotion);
        toast.success(`Detected: ${emotion}`);
      } else if (message) {
        setMessage(message);
        toast.warning(message);
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Emotion detection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar uid={uid} />
      <div className="upload-container">
        <h1>Face Emotion Detection</h1>

        <div className="method-switch">
          <a onClick={() => setMethod("Camera")}>Use Camera</a>
          <a onClick={() => setMethod("Upload")}>Upload Image</a>
        </div>

        <h2>Upload Image for Emotion Detection</h2>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="upload-input"
        />

        <div className="upload-buttons">
          <button onClick={handleRemove} disabled={!selectedFile}>
            Remove
          </button>
          <button onClick={handleDetect} disabled={!selectedFile || loading}>
            {loading ? "Detecting..." : "Detect Emotion"}
          </button>
        </div>

        {previewURL && (
          <div className="preview-img">
            <h3>Image Preview</h3>
            <img src={previewURL} alt="Selected" />
          </div>
        )}

        {(emotion || message) && (
          <div className="detected-emotion">
            {emotion ? (
              <>Detected Emotion: <span>{emotion}</span></>
            ) : (
              <>{message}</>
            )}
          </div>
        )}
      </div>
      <ToastContainer/>
    </>
  );
}
