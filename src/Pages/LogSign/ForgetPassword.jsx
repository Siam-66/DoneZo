
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location?.state?.email || ""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("A password reset email has been sent to your email address.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center my-16 relative">

      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter your email</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="email"
              className="input input-bordered "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mt-2">{success}</div>
          )}
          <div className="form-control mt-6">
            <button className="btn text-xl bg-gradient-to-r from-green-600 via-lime-500 to-emerald-300 text-white font-semibold">
              Send Reset Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
