import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movies/:imdbId" element={<MovieDetailsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
