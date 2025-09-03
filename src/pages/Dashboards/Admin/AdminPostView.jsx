import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const BASE_URL = "http://localhost:8000";

const AdminViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/admin/posts/${postId}`);
        setPost(res.data);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      await axios.post(`/posts/${post.id}/publish`);
      alert("Post published successfully!");
      navigate("/dashboard/admin/posts");
    } catch {
      alert("Failed to publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      alert("Please select a date/time.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/posts/${post.id}/schedule`, {
        schedule_at: scheduleDate,
      });
      alert("Post scheduled successfully!");
      navigate("/dashboard/admin/posts");
    } catch {
      alert("Failed to schedule post.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>No post found.</p>;

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

        {/* Editor Feedback */}
        {post?.editor_review && (
          <div
            style={{
              background: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "10px",
              marginTop: "15px",
            }}
          >
            <p>
              <strong>Editor Feedback:</strong>{" "}
              {post.editor_review.feedback || "No feedback"}
            </p>
            <p>
              <strong>Editor Decision:</strong>{" "}
              {post.editor_review.status || "N/A"}
            </p>
          </div>
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

        {/* Schedule Date */}
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          style={{
            marginTop: "15px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />

        {/* Actions */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={handleSchedule}
            disabled={submitting}
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
            Schedule
          </button>
          <button
            onClick={handlePublish}
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
            Publish
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

export default AdminViewPost;
