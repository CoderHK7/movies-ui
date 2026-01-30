import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import AuthPage from "./pages/AuthPage";
import MyReviewsPage from "./pages/MyReviewsPage";
import TopRatedPage from "./pages/TopRatedPage";
import LatestPage from "./pages/LatestPage";
import SearchPage from "./pages/SearchPage";
import { getToken } from "./auth/token";

function ProtectedRoute({ children }) {
  const loggedIn = !!getToken();
  return loggedIn ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/top-rated" element={<TopRatedPage />} />
        <Route path="/latest" element={<LatestPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/movies/:imdbId" element={<MovieDetailsPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
