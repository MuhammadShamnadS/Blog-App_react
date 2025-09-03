import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const BASE_URL = "http://localhost:8000";

const EditorViewPost = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        //fetch a single review by id
        const res = await axios.get(`/editor/reviews/${reviewId}`);
        setReview(res.data);
      } catch {
        setError("Failed to load review.");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [reviewId]);

  const handleDecision = async (status) => {
    if (status === "rejected" && !feedback.trim()) {
      alert("Feedback is required when rejecting.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/editor/reviews/${reviewId}`, {
        status,
        feedback,
      });
      alert(`Post ${status} successfully!`);
      navigate("/dashboard/editor/posts");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit decision.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!review) return <p>No review found.</p>;

  const post = review.post;

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
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>
            <strong>{post?.author?.name || "Unknown Author"}</strong>
          </p>
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              background: "#1976d2",
              color: "#fff",
              fontSize: "12px",
            }}
          >
            {post?.status}
          </span>
        </div>

        {/* Title */}
        <h2>{post?.title}</h2>

        {/* Content */}
        <p>{post?.content}</p>

        {/* Category + Tags */}
        {post?.category && (
          <p>
            <strong>Category:</strong> {post.category.name}
          </p>
        )}
        {post?.tags && post.tags.length > 0 && (
          <p>
            <strong>Tags:</strong> {post.tags.map((t) => t.name).join(", ")}
          </p>
        )}

        {/* Media */}
        <div style={{ marginTop: "10px" }}>
          {post?.media && post.media.length > 0 ? (
            post.media.map((m) => (
              <img
                key={m.id}
                src={`${BASE_URL}/storage/${m.url}`}
                alt="Post media"
                style={{
                  width: "200px",
                  borderRadius: "6px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setModalImage(`${BASE_URL}/storage/${m.url}`)}
              />
            ))
          ) : (
            <p style={{ color: "#888" }}>No media</p>
          )}
        </div>

        {/* Feedback box */}
        <textarea
          placeholder="Feedback (required if rejecting)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          rows={3}
        />

        {/* Actions */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleDecision("approved")}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: "#4caf50",
              color: "#fff",
            }}
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("rejected")}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: "#f44336",
              color: "#fff",
            }}
          >
            Reject
          </button>
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

export default EditorViewPost;
