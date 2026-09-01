import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Axios request interceptor to attach JWT token to all outgoing API calls
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- AUTHENTICATION ENDPOINTS ---

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // Expected response: { token, user: { id, name, email } }
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data; // Expected response: { message, userId }
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data; // Expected response: { _id, name, email }
};

// --- INTERVIEW ENDPOINTS ---

export const startInterview = async (
  file: File,
  jdText: string,
  difficulty: string
) => {
  const formData = new FormData();
  formData.append("cv", file);
  formData.append("jd", jdText);
  formData.append("difficulty", difficulty);

  const res = await api.post("/interview/start", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data; // Expected response: { interviewId, firstQuestion, totalQuestions, matchScore, skills, candidateName }
};

export const submitAnswer = async (interviewId: string, answer: string) => {
  const res = await api.post(`/interview/${interviewId}/answer`, { answer });
  return res.data; // Expected response: { feedback, score, currentIndex, completed, nextQuestion, overallScore }
};

export const getHistory = async () => {
  const res = await api.get("/interview/history");
  return res.data; // Expected response: Array of interview summaries
};

export const getInterviewDetails = async (interviewId: string) => {
  const res = await api.get(`/interview/${interviewId}`);
  return res.data; // Expected response: Full Interview document with conversations
};

export default api;