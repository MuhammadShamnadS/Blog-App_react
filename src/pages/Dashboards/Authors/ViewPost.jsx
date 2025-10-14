import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import authService from "../../../services/authService";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await authService.fetchSinglePostsByAuthors(id);
        setPost(res.data);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // handle draft/submit
  const updateStatus = async (status) => {
    try {
      await authService.handleDraftOrSubmit(id, post, status);
      alert(`Post ${status === "draft" ? "saved as draft" : "submitted"}!`);
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data);
    } catch {
      alert("Failed to update status.");
    }
  };

  // handle resubmit (separate controller endpoint)
  const handleResubmit = async () => {
    try {
      await authService.resubmitPost(id);
      alert("Post resubmitted successfully!");
      const res = await authService.fetchSinglePostsByAuthors(id);
      setPost(res.data);
    } catch {
      alert("Failed to resubmit post.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const isSubmitted = post.status === "submitted";
  const isRejected = post.status === "editor_rejected";

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
          background: "#fff",
        }}
      >
        {/* Header: Author + Status + Edit button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>
            <strong>{post.author?.name || "Unknown Author"}</strong>
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                background:
                  post.status === "submitted"
                    ? "#4caf50"
                    : post.status === "editor_rejected"
                      ? "#f44336"
                      : "#ff9800",
                color: "#fff",
                fontSize: "12px",
              }}
            >
              {post.status}
            </span>
            <button
              onClick={() => navigate(`/dashboard/author/posts/${id}/edit`)}
              disabled={isSubmitted}
              style={{
                padding: "6px 12px",
                background: isSubmitted ? "#aaa" : "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitted ? "not-allowed" : "pointer",
                opacity: isSubmitted ? 0.6 : 1,
              }}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Show Editor Feedback if rejected */}
        {isRejected && post.editor_review?.feedback && (
          <div
            style={{
              background: "#ffe0e0",
              border: "1px solid #ff4444",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            <strong>Editor Feedback:</strong>
            <p>{post.editor_review.feedback}</p>
          </div>
        )}

        {/* Title */}
        <h2>{post.title}</h2>

        {/* Content */}
        <p>{post.content}</p>

        {/* Category + Tags */}
        {post.category && (
          <p>
            <strong>Category:</strong> {post.category.name}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <p>
            <strong>Tags:</strong> {post.tags.map((t) => t.name).join(", ")}
          </p>
        )}

        {/* Media */}
        <div style={{ marginTop: "10px" }}>
          {post.media && post.media.length > 0 ? (
            post.media.map((m) => (
              <img
                key={m.id}
                src={`${STORAGE_URL}/${m.url}`}
                alt="Post media"
                style={{
                  width: "200px",
                  borderRadius: "6px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  !isSubmitted &&
                  setModalImage(`${STORAGE_URL}/${m.url}`)
                }
              />
            ))
          ) : (
            <p style={{ color: "#888" }}>No media</p>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          {/* Draft button */}
          <button
            onClick={() => updateStatus("draft")}
            disabled={isSubmitted}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #888",
              cursor: isSubmitted ? "not-allowed" : "pointer",
              background: "#fff",
              opacity: isSubmitted ? 0.6 : 1,
            }}
          >
            Save as Draft
          </button>

          {/* Submit / Resubmit */}
          {isRejected ? (
            <button
              onClick={handleResubmit}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#1976d2",
                color: "#fff",
              }}
            >
              Resubmit
            </button>
          ) : (
            <button
              onClick={() => updateStatus("submitted")}
              disabled={isSubmitted}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: isSubmitted ? "not-allowed" : "pointer",
                background: "#1976d2",
                color: "#fff",
                opacity: isSubmitted ? 0.6 : 1,
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Modal for Image */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={modalImage}
              alt="Large Preview"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                padding: "8px 12px",
                background: "#ff4444",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
