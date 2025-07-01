import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./camera.css";

export default function Camera() {
  const { uid } = useParams();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleMethodSwitch = (method) => {
    navigate(`/${method.toLowerCase()}/${uid}`);
  };

  const capture = () => {
    if (!webcamRef.current) {
      toast.error("Webcam not ready.");
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      toast.error("Failed to capture image.");
      return;
    }

    setImageSrc(screenshot);
    setEmotion("");
    setMessage("");
  };

  const handleReset = () => {
    setImageSrc(null);
    setEmotion("");
    setMessage("");
  };

  const getResult = async () => {
    if (!imageSrc) {
      toast.error("Please capture an image first.");
      return;
    }

    setLoading(true);
    setEmotion("");
    setMessage("");

    try {
      const uploadRes = await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/upload/camera`, {
        imgData: imageSrc,
      });

      const { imgUrl } = uploadRes.data;
      if (!imgUrl) {
        toast.error("Image upload failed.");
        return;
      }


      const detectRes = await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/emotion/from-url`, {
        uid,
        imgUrl,
      });

      console.log("Detection response:", detectRes.data);

      if (detectRes.data?.emotion) {
        setEmotion(detectRes.data.emotion);
        toast.success("Emotion detected: " + detectRes.data.emotion);
      } else if (detectRes.data?.message) {
        setMessage(detectRes.data.message);
        toast.warning(detectRes.data.message);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Failed to detect emotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar uid={uid} />
      <div className="camera-container">
        <h1>Face Emotion Detection</h1>

        <div className="method-switch">
          <a onClick={() => handleMethodSwitch("Camera")}>Use Camera</a>
          <a onClick={() => handleMethodSwitch("Upload")}>Upload Image</a>
        </div>

        <h2>Camera Emotion Detection</h2>

        <div className="instructions">
          <h4> Please follow these instructions:</h4>
          <ul>
            <li> Face the camera directly.</li>
            <li> Keep your face centered in the frame.</li>
            <li> Ensure good lighting.</li>
            <li> Avoid glasses/masks if possible.</li>
            <li> Keep a neutral expression initially.</li>
          </ul>
        </div>


        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          videoConstraints={{ facingMode: "user" }}
        />

        <div className="camera-buttons">
          <button onClick={capture} disabled={loading || imageSrc}>
            Capture
          </button>
          <button onClick={getResult} disabled={loading || !imageSrc}>
            {loading ? "Detecting..." : "Get Result"}
          </button>
          {imageSrc && (
            <button onClick={handleReset} disabled={loading}>
              Reset
            </button>
          )}
        </div>

        {/* Captured Image Preview */}
        {imageSrc && (
          <div className="captured-img">
            <h3>Captured Image:</h3>
            <img src={imageSrc} alt="Captured" />
          </div>
        )}

        {/* Emotion or Message Output */}
        {(emotion || message) && (
          <div className="detected-emotion">
            {emotion ? (
              <>Detected Emotion: <span>{emotion}</span></>
            ) : (
              <> {message}</>
            )}
          </div>
        )}
      </div>
      <ToastContainer/>
    </>
  );
}
