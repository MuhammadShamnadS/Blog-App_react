import axios from "../api/axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//SSO login
const authService = {
  loginWithGoogle: () => {
    window.location.href = `${BASE_URL}/auth/google/redirect`;
  },
  //Login
  login: async (username, password) => {
    return await axios.post("/login", { username, password });
  },
  //Logout
  logout: async () => {
    return await axios.post("/logout");
  },
  //Register User
  registerUser: async (data) => {
    return await axios.post("/register", data);
  },

  blockUser: async (id) => {
    return await axios.post(`block-user/${id}`);
  },

  unblockUser: async (id) => {
    return await axios.post(`unblock-user/${id}`);
  },

  //Forgot Password
  sendOtp: async (email) => {
    return await axios.post("/forget-password", { email });
  },

  verifyOtp: async (email, otp) => {
    return await axios.post("/verify-otp", { email, otp });
  },

  forgetPassword: async (email, otp, password) => {
    return await axios.post("/reset-password", { email, otp, password });
  },

  //Change password
  changePassword: async (password) => {
    return await axios.post("/change-password", { password });
  },

  //admin

  getAdminDashboardStats: async () => {
    return await axios.get("/admin/dashboard-stats");
  },

  getUsersByAdmin: async (role,page=1) => {
    return await axios.get(`/get-users?role=${role}&page=${page}`);
  },

  getPostsAdmin: async (page) => {
    return await axios.get(`/admin/posts/submitted?page=${page}`);
  },

  getEditorsAdmin: async (categoryId, page) => {
    return await axios.get(`/categories/${categoryId}/editors?page=${page}`);
  },

  postAssignEditor: async (post, editorId) => {
    return await axios.post(`/admin/posts/${post.id}/assign-editor`, {
      editor_id: editorId,
    });
  },
  getPostViewAdmin: async (postId) => {
    return await axios.get(`/admin/posts/${postId}`);
  },

  publishPostAdmin: async (postId) => {
    return await axios.post(`/posts/${postId}/publish`);
  },

  archievePostAdmin: async (postId) => {
    return await axios.post(`/posts/${postId}/archive`);
  },

  unarchivePostAdmin: async (postId) => {
    return await axios.post(`/posts/${postId}/un-archive`);
  },

  deletePostAdmin: async (postId) => {
    return await axios.delete(`/delete-post/${postId}`);
  },

  schedulePostAdmin: async (postId, scheduleDate) => {
    return await axios.post(`/posts/${postId}/schedule`, {
      schedule_at: scheduleDate,
    });
  },

  roleRequestsAdmin: async (page) => {
    return await axios.get(`/pending-requests?page=${page}`);
  },
  roleRequestsHistoryAdmin: async (page) => {
    return await axios.get(`/role-requests-history?page=${page}`);
  },

  getCategories: async () => {
    return await axios.get("/categories");
  },

  roleDecisionAdmin: async (id, action, category_id = null) => {
    return await axios.post(`/role-decision/${id}`, {
      action,
      ...(category_id ? { category_id } : {}),
    });
  },

  fetchPostAdmin: async (page) => {
    return await axios.get(`/admin/published-posts?page=${page}`);
  },

  fetchPendingPostAdmin: async (page) => {
    return await axios.get(`/posts/editor-approved?page=${page}`);
  },

  fetchArchievedPostAdmin: async (page) => {
    return await axios.get(`/admin/archieved-posts?page=${page}`);
  },
  fetchFeaturedPostAdmin: async (page) => {
    return await axios.get(`/admin/featured-posts?page=${page}`);
  },

  fetchScheduledPostAdmin: async (page) => {
    return await axios.get(`/admin/scheduled-posts?page=${page}`);
  },

  getCommentsAdim: async (id) => {
    return await axios.get(`/admin/posts/${id}/comments`);
  },
  deleteCommentsAdmin: async (commentId) => {
    return await axios.get(`admin/comments/${commentId}`);
  },
  toggleFeaturePostAdmin: async (id, data) => {
    return await axios.patch(`/posts/${id}/feature`, data);
  },

  fetchCategories: async (page) => {
    return await axios.get(`/categories?page=${page}`);
  },
  setCategories: async (name) => {
    return await axios.post("/add-categories", name);
  },
  editCategory: async (editCategoryId, name) => {
    return await axios.put(`/edit-category/${editCategoryId}`, name);
  },
  deleteCategory: async (id) => {
    return await axios.delete(`/delete-category/${id}`);
  },
  addTag: (categoryId, data) => {
    return axios.post(`/categories/${categoryId}/tags`, data);
  },

  fetchTags: (categoryId, page) => {
    return axios.get(`/categories/${categoryId}/tags?page=${page}`);
  },

  editTag: (tagId, data) => {
    return axios.put(`/tag/${tagId}`, data);
  },

  deleteTag: (tagId) => {
    return axios.delete(`/tag/${tagId}`);
  },

  //authors

  fetchPostsByAuthors: async () => {
    return await axios.get("/posts");
  },

  fetchSinglePostsByAuthors: async (id) => {
    return await axios.get(`/posts/${id}`);
  },

  deleteMedia: async (mediaId) => {
    return await axios.delete(`/media/${mediaId}`);
  },

  deletePostByAuthors: async (id) => {
    return await axios.delete(`/posts/${id}`);
  },

  getAvailableCategories: async () => {
    return await axios.get("/available-categories");
  },

  getAvailableTagsUnderACategories: async (id) => {
    return await axios.get(`/categories/${id}/available-tags`);
  },

  createPost: async (formData) => {
    return await axios.post("create-post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  EditSinglePost: async (id, formData) => {
    return await axios.post(`/update-post/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  handleDraftOrSubmit: async (id, post, status) => {
    return await axios.put(`update-post/${id}`, {
      title: post.title,
      content: post.content,
      category: post.category?.name,
      tags: post.tags?.map((t) => t.name),
      status,
    });
  },
  resubmitPost: async (id) => {
    return await axios.post(`/posts/${id}/resubmit`);
  },

  //editor

  getPostByEditors: async () => {
    return await axios.get("/editor/posts");
  },

  getReview: async (reviewId) => {
    return await axios.get(`/editor/reviews/${reviewId}`);
  },

  postReview: async (reviewId, status, feedback) => {
    return await axios.post(`/editor/reviews/${reviewId}`, {
      status,
      feedback,
    });
  },

  //guest

  getAuthorsByGuest: async () => {
    return await axios.get("/authors");
  },

  followAuthors: async (authorId) => {
    return await axios.post("/author/follow", { author_id: authorId });
  },
  subscribeAuthors: async (authorId) => {
    return await axios.post("/author/subscribe", { author_id: authorId });
  },

  getAuthorProfile: async (id) => {
    return await axios.get(`/authors/${id}/profile`);
  },

  getAuthorFollow: async (id) => {
    return await axios.get(`/authors/${id}/follow-toggle`);
  },

  getPostsByGuest: async () => {
    return await axios.get("/guest/posts");
  },

  getSinglePostsByGuest: async (id) => {
    return await axios.get(`/guest/post/${id}`);
  },

  getLikes: async (id) => {
    return await axios.get(`/post/${id}/likes`);
  },

  postLikes: async (id) => {
    return await axios.post("/like/toggle", { post_id: id });
  },

  getComments: async (id) => {
    return await axios.get(`/posts/${id}/comments`);
  },

  postComments: async (id, parentId, commentContent) => {
    return await axios.post("/comments", {
      post_id: id,
      parent_id: parentId,
      content: commentContent,
    });
  },

  deleteComment: async (commentId) => {
    return await axios.delete(`/comments/${commentId}`);
  },

  roleRequestStatus: async () => {
    return await axios.get("/requeststatus");
  },
  requestRoleChange: async (role) => {
    return await axios.post("/role-request", {
      requested_role: role,
    });
  },

  filterPosts: async (params) => {
    return await axios.get("/filter", { params });
  },

  searchPosts: async (params) => {
    return await axios.get("/search", { params });
  },
  fetchCategoriesByAuthor: async () => {
    return await axios.get("/get-available-categories");
  },
};

export default authService;
