import { FaUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { useState, type FormEvent } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextLogo } from "../components/TextLogo";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      await login({ username, password });
      setLoading(false);
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      try {
        setErrorMsg(error?.response?.data?.message || "Error during login.");
      } catch {
        setErrorMsg("Error during login. Contact website Administrator");
      }

      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-gray-700 flex-col flex items-center gap-3 rounded-xl shadow-2xl shadow-blue-500/20">
        <TextLogo />
        <p className="text-xs md:text-sm text-gray-500 text-center">
          Dont have an account?{" "}
          <span
            className="text-white cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3">
            <FaUser />
            <input
              type="email"
              placeholder="Email or username"
              className="w-full bg-transparent border-0 
                md:text-base text-sm outline-none text-white"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3 relative">
            <TbLockPassword />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border-0 
                md:text-base text-sm outline-none text-white"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            {showPassword ? (
              <BsFillEyeFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer"
              />
            ) : (
              <BsEyeSlashFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 cursor-pointer"
              />
            )}
          </div>
        </div>

        <button
          className={
            !loading
              ? "w-full bg-amber-500 md:text-base hover:bg-amber-400 text-black font-semibold py-2 rounded-2xl transition-colors"
              : "w-full bg-gray-500 md:text-base text-black font-semibold py-2 rounded-2xl transition-colors"
          }
          onClick={loading ? undefined : (e) => handleSubmit(e)}
        >
          {!loading ? "Login" : "Signing in..."}
        </button>

        <p className="text-red-500 text-sm mt-2">{errorMsg}</p>

        <p className="text 3x1 pt-5 text-gray-400 cursor-pointer">
          Forgot password?
        </p>

        <div className="w-full flex items-center justify-center pt-3">
          <div className="w-1/2 h-0.5 bg-gray-600"></div>
          <span className="px-2 text-gray-500">OR</span>
          <div className="w-1/2 h-0.5 bg-gray-600"></div>
        </div>

        {/* <div className="relative w-70 pt-5 flex items-center justify-between py-3">
          <div className="p-2 md:px10 bg-slate-600 cursor-pointer rounded-2xl hover:bg-slate-800">
            <FaGoogle className="text-lg md:text-4xl" />
          </div>
          <div className="p-2 md:px10 bg-slate-600 cursor-pointer rounded-2xl hover:bg-slate-800">
            <FaFacebook className="text-lg md:text-4xl" />
          </div>
          <div className="p-2 md:px10 bg-slate-600 cursor-pointer rounded-2xl hover:bg-slate-800">
            <FaGithub className="text-lg md:text-4xl" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
