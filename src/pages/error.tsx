import { useState, createContext, useContext, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useError() {
  const handleError = (error: unknown) => {
    const navigate = useNavigate();
    const errorMessage = error instanceof Error ? error.message : String(error);
    navigate("/error", { state: { message: errorMessage } });
    window.location.href = "/error";
  };

  return { handleError };
}

export function ErrorPage() {
  const location = useLocation();

  const message = location.state?.message || "Unknown error...";
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-[90%] max-w-md p-5 bg-gray-700 flex flex-col items-center gap-3 rounded-xl shadow-2xl shadow-blue-500/20">
        <h1 className="text-3xl text-red-500 font-bold">Error occurred.</h1>
        <p className="text-xl text-white text-center">{message}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
