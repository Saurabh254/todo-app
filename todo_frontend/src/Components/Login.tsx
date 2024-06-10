  import  { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { login } from "../api";
  import { LoginResponse } from "../type";
  import { log } from "./Logger";

  function Login() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [otpError, setOtpError] = useState("");
    const navigate = useNavigate();

    const validateInputs = () => {
      let isValid = true;
      if (phone.length !== 10) {
        setPhoneError("Please enter a 10-digit phone number.");
        isValid = false;
      } else {
        setPhoneError("");
      }

      if (otp.length !== 6) {
        setOtpError("Please enter a 6-digit OTP.");
        isValid = false;
      } else if (otp !== phone.slice(phone.length - 6)) {
        setOtpError(
          "Please enter the valid OTP."
        );
        isValid = false;
      } else {
        setOtpError("");
      }

      return isValid;
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!validateInputs()) {
        return;
      }

      try {
        const responseData: LoginResponse = await login(phone, otp);
        log("info", "Login successful:", responseData);
        localStorage.setItem("accessToken", responseData.accessToken);
        navigate("/listOfTasks");
      } catch (error) {
        log("error", "There was a problem with the login operation:", error);
      }
    };

    return (
      <div className="w-screen h-screen bg-white">
        <div className="text-4xl font-bold text-gray-800 flex items-center justify-center pt-5">
          <button>Login</button>
        </div>
        <div className="flex items-center justify-center mt-12">
          <div className="border shadow p-3 bg-white rounded pl-20 pr-20">
            <div className="py-2">
              <h2 className="text-3xl font-semibold text-gray-800">Login</h2>
            </div>
            <form className="flex flex-col" onSubmit={handleLogin}>
              <label className="text-gray-800 font-medium py-2">
                Enter Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && (
                <div className="text-red-500 text-sm">{phoneError}</div>
              )}

              <label className="text-gray-800 font-medium py-2">Enter OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="OTP"
                className="p-2 border-gray-800 border rounded w-full max-w-xs bg-white text-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {otpError && <div className="text-red-500 text-sm">{otpError}</div>}

              <button
                className="btn-sm w-20 mt-5 bg-blue-500 text-white rounded"
                type="submit"
                disabled={
                  !!(
                    phoneError ||
                    otpError ||
                    phone.length === 0 ||
                    otp.length === 0
                  )
                }
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default Login;
