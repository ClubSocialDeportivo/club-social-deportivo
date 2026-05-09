import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

const API_URL = "http://localhost:8000/api";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
        <div className="bg-[#14171c] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Enlace inválido</h2>
          <p className="text-gray-400">
            El enlace de creación de contraseña no es válido o ha expirado.
            Solicita un nuevo registro en el club.
          </p>
        </div>
      </div>
    );
  }

  const passwordsMatch = password === confirmPassword && password.length >= 8 && confirmPassword.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/confirmar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo establecer la contraseña.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
        <div className="bg-[#14171c] border border-emerald-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">¡Contraseña creada!</h2>
          <p className="text-gray-400">
            Tu contraseña ha sido establecida correctamente. Ya puedes acceder a la plataforma del club.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
      <div className="bg-[#14171c] border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Crear mi contraseña</h1>
          <p className="text-gray-400 text-sm mt-2">Establece tu contraseña de acceso al club</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-[#0f131a] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white focus:border-yellow-400 outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full bg-[#0f131a] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white focus:border-yellow-400 outline-none transition"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && confirmPassword.length >= 8 && (
              <p className="text-red-400 text-xs mt-2">Las contraseñas no coinciden</p>
            )}
            {passwordsMatch && (
              <p className="text-emerald-400 text-xs mt-2">Las contraseñas coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!passwordsMatch || loading}
            className="w-full font-bold text-lg py-4 rounded-xl text-black bg-yellow-400 hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Crear contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
