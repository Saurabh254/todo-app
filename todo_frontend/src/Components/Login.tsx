import { useState, useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { login } from "../api";
import { LoginResponse } from "../type";
import { log } from "./Logger";
import Alert from "./Alert";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
   const [phoneFocused, setPhoneFocused] = useState(false);
   const [otpFocused, setOtpFocused] = useState(false);

    useEffect(() => {
      if (location.state?.logoutSuccess) {
        setShowLogoutAlert(true);
        setTimeout(() => setShowLogoutAlert(false), 3000);
      }
    }, [location]);
   useEffect(() => {
     const validatePhone = () => {
       if (!phoneFocused) return false;
       if (phone.length !== 10) {
         setPhoneError("Enter a 10 digit phone number.");
         return false;
       }
       setPhoneError("");
       return true;
     };

     const validateOTP = () => {
       if (!otpFocused) return false;
       if (otp.length !== 6) {
         setOtpError("Please enter a 6-digit OTP.");
         return false;
       } else if (otp !== phone.slice(phone.length - 6)) {
         setOtpError("Invalid OTP.");
         return false;
       }
       setOtpError("");
       return true;
     };

     setIsValid(validatePhone() && validateOTP());
   }, [phone, otp, phoneFocused, otpFocused]); 

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    try {
      const responseData: LoginResponse = await login(phone, otp);
      log("info", "Login successful:", responseData);
      localStorage.setItem("accessToken", responseData.accessToken);
      navigate("/listOfTasks", {
        state: { message: "Login Successfull", showAlert: true, type: "login" },
      });

    } catch (error) {
      log("error", "There was a problem with the login operation:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#f3f1f1]">
      {showLogoutAlert && <Alert message="Logged out Successfull " type="logout" />}
      <div className="text-4xl font-semibold text-gray-700 flex items-center justify-center pt-5">
        <div>
          <h1 className="text-2xl text-gray-700 font-bold pl-16">Welcome</h1>
          <p className="text-sm text-gray-700 font-semibold">
            Please Login, To The Task Management
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center mt-20">
        <div className="border shadow p-3 bg-white rounded pl-16 pr-16 pt-8 pb-8">
          <div className="">
            <h2 className="text-xl font-semibold text-gray-700">Login</h2>
          </div>
          <form className="flex flex-col" onSubmit={handleLogin}>
            <label className="text-gray-800 font-medium py-2 text-sm">
              Enter Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="p-1 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setPhoneFocused(true)}
            />

            <div className="text-red-500 text-xs h-4 pt-1">
              {phoneFocused && phoneError}
            </div>

            <label className="text-gray-800 font-medium  text-sm py-2">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              className="p-1 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onFocus={() => setOtpFocused(true)}
            />

            <div className="text-red-500 text-xs h-4 pt-1" >
              {otpFocused && otpError}
            </div>

            <button
              className={`text-xs w-16 mt-3 py-1.5 text-white rounded ${
                isValid ? "bg-green-500" : "bg-gray-500"
              }`}
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
