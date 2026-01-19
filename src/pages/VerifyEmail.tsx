import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verificando...");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("Token inválido ou não encontrado.");
      return;
    }

    async function verify() {
      try {
        await api.post("/auth/verify", { token });
        setStatus("Email verificado com sucesso! Redirecionando...");

        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        setStatus("Falha na verificação. O link pode ter expirado.");
      }
    }

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Verificação de Conta</h2>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}
