import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import EmptyState from "../../../components/EmptyState";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const GuestSearchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Fetch categories and authors once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const catRes = await authService.fetchCategoriesByAuthor();
        setCategories(catRes.data);

        const authorRes = await authService.getAuthorsByGuest();
        setAuthors(authorRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch posts based on current filter/search
  const fetchPosts = async (params = {}) => {
    setLoading(true);
    try {
      let res;
      if (params.search) {
        res = await authService.searchPosts(`?search=${encodeURIComponent(params.search)}&page=${params.page}`);
      } else {
        res = await authService.filterPosts({
          page: params.page,
          category: params.category || undefined,
          author: params.author || undefined,
        });
      }

      setPosts(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error(err);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      setPage(1);
      setSelectedCategory("");
      setSelectedAuthor("");
      fetchPosts({ search: searchText, page: 1 });
    }
  };

  // Handle category filter
  useEffect(() => {
    if (selectedCategory) {
      setPage(1);
      setSearchText("");
      setSelectedAuthor("");
      fetchPosts({ category: selectedCategory, page: 1 });
    }
  }, [selectedCategory]);

  // Handle author filter
  useEffect(() => {
    if (selectedAuthor) {
      setPage(1);
      setSearchText("");
      setSelectedCategory("");
      fetchPosts({ author: selectedAuthor, page: 1 });
    }
  }, [selectedAuthor]);

  // Pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    const params = searchText
      ? { search: searchText, page: value }
      : selectedCategory
        ? { category: selectedCategory, page: value }
        : selectedAuthor
          ? { author: selectedAuthor, page: value }
          : {};
    if (Object.keys(params).length > 0) fetchPosts(params);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#2c2638", height: 80, p: 1, mb: 1, borderRadius: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "white", textAlign: "center" }}>
          Read Our Blogs
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 3 }}>
        <TextField
          label="Search posts..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          size="small"
        />
        <TextField select label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} size="small">
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField select label="Author" value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} size="small">
          <MenuItem value="">All</MenuItem>
          {authors.map((a) => (
            <MenuItem key={a.id} value={a.name}>
              {a.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Loading */}
      {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />}

      {/* Posts Grid */}
      {!loading && posts.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", mt: 1 }}>
          {posts.map((post) => (
            <Card
              key={post.id}
              sx={{
                flex: "1 1 calc(100% - 16px)",
                maxWidth: "100%",
                cursor: "pointer",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
                "@media (min-width: 600px)": { flex: "1 1 calc(50% - 24px)", maxWidth: "calc(50% - 24px)" },
                "@media (min-width: 900px)": { flex: "1 1 calc(33.33% - 24px)", maxWidth: "calc(33.33% - 24px)" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: !post.media || post.media.length === 0 ? "linear-gradient(135deg, #0c0c0cff, #7b02fcff)" : "transparent",
                  color: "white",
                  overflow: "hidden",
                  textAlign: "center",
                  px: 1,
                }}
              >
                {post.media && post.media.length > 0 ? (
                  <CardMedia component="img" image={`${STORAGE_URL}/${post.media[0].url}`} alt={post.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, textAlign: "center", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}
                    title={post.title}
                  >
                    {post.title}
                  </Typography>
                )}
              </Box>
              <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={post.title}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={post.author?.name || "Deleted User"}>
                  Author: {post.author?.name || "Deleted User"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </Typography>
                <Button sx={{ color: "black", fontWeight: 500, alignSelf: "flex-start", mt: "auto" }} onClick={() => navigate(`/dashboard/guest/post/${post.id}`)}>
                  READ
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        !loading && <EmptyState message="No posts found. Try searching or selecting a filter." />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} />
        </Box>
      )}
    </Box>
  );
};

export default GuestSearchPosts;
