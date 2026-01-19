import { FaUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { BsEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import type { FormEvent } from "react";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TextLogo } from "../components/TextLogo";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { register } = useAuth();

  function checkForm(toCheck: string): void {
    let v = checkFormValidity(false, toCheck);
    if (v != "Pass") {
      setErrorMsg(v);
    } else {
      setErrorMsg("");
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = checkFormValidity(true);
    if (validation != "Pass") {
      setErrorMsg(validation);
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
      return;
    }
    try {
      setLoading(true);
      await register({ username, email, password });
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErrorMsg(error.response.data.message || "Error during registration.");
      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);
    }
  }

  function checkFormValidity(submit: boolean, toCheck?: string): string {
    if (submit) {
      if (!username.trim()) return "Username is required.";
      if (!email.trim()) return "Email is required.";
      if (!password.trim()) return "Password is required.";
      if (!confirmPassword.trim()) return "Confirm Password is required.";
    }

    if (
      username.length < 4 &&
      (toCheck === "username" || submit) &&
      username.length > 0
    ) {
      return "Username must be at least 4 characters.";
    }

    const invalidCharRegex = /[^a-zA-Z0-9]/;
    if (invalidCharRegex.test(username) && (toCheck === "username" || submit)) {
      return "Username cannot contain spaces or special characters.";
    }

    if (
      (!email.includes("@") || !email.includes(".") || email.includes(" ")) &&
      (toCheck === "email" || submit) &&
      email.length > 0
    ) {
      return "Please enter a valid email address.";
    }

    if (
      password.length < 8 &&
      (toCheck === "password" || submit) &&
      password.length > 0
    ) {
      return "Password must be at least 8 characters.";
    }

    if (
      password != confirmPassword &&
      (((toCheck === "password" || toCheck === "confirmPassword") &&
        password.length > 0 &&
        confirmPassword.length > 0) ||
        submit)
    ) {
      return "Passwords do not match.";
    }

    return "Pass";
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-gray-700 flex-col flex items-center gap-3 rounded-xl shadow-2xl shadow-blue-500/20">
        <TextLogo />
        <p className="text-xs md:text-sm text-gray-500 text-center select-none">
          Already have an account?{" "}
          <span
            className="text-white cursor-pointer select-none"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3">
            <FaUser />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border-0 
                  md:text-base text-sm outline-none text-white"
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMsg(null);
              }}
              onBlur={() => checkForm("username")}
            />
          </div>

          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3">
            <MdEmail />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-0 
                  md:text-base text-sm outline-none text-white"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg(null);
              }}
              onBlur={() => checkForm("email")}
            />
          </div>

          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3 relative">
            <TbLockPassword />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border-0 
                  md:text-base text-sm outline-none text-white"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg(null);
              }}
              onBlur={() => checkForm("password")}
            />
          </div>

          <div className="w-full flex items-center bg-gray-900 p-2 rounded-2xl gap-3 relative">
            <TbLockPassword />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-transparent border-0 
                  md:text-base text-sm outline-none text-white"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg(null);
              }}
              onBlur={() => checkForm("confirmPassword")}
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
          onClick={handleSubmit}
        >
          Sign Up
        </button>

        <div>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center select-none">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="w-full flex items-center justify-center pt-3">
          <div className="w-1/2 h-0.5 bg-gray-600"></div>
          <span className="px-2 text-gray-500 select-none">OR</span>
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
        <h1 className="text-red-500">disabled temporarily</h1>
      </div>
    </div>
  );
}
