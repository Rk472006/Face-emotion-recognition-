import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./history.css"; // styling below

export default function History() {
  const { uid } = useParams();
  const [history, setHistory] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchHistory = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/emotion/history/${uid}`);
    const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setHistory(sorted);
  } catch (err) {
    console.error("Error fetching history:", err);
    toast.error("Failed to fetch history");
  }
};

  useEffect(() => {
    fetchHistory();
  }, [uid]);

  const handlePreview = (url) => {
    setPreviewUrl(url);
  };

  const closeModal = () => {
    setPreviewUrl(null);
  };

  return (
    <>
      <Navbar uid={uid} />
      <div className="history-container">
        <h1>Emotion History</h1>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item._id} className="history-item">
                <div>
                  <strong>{item.emotion}</strong> &nbsp;|&nbsp; {new Date(item.timestamp).toLocaleString()}
                </div>
                <button onClick={() => handlePreview(item.imgUrl)}>View Image</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Emotion Preview" />
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
