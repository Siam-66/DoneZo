import React, { useContext, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const { googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    
    try {
      const userResult = await googleSignIn();
      
      if (!userResult) {
        throw new Error("Google sign-in failed");
      }

      const userData = {
        name: userResult.displayName,
        email: userResult.email,
        photo: userResult.photoURL,
        role: "tourist"
      };

      const response = await fetch("http://localhost:5000/allUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User data saved successfully:", data);
        navigate(from);
      } else {
        throw new Error(data.message || "Failed to save user data");
      }

    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <p className="text-center">Or</p>
      <div className="px-20 mt-7 mb-6">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center rounded-2xl border border-yellow-900 py-1 w-full px-2"
        >
          <FcGoogle className="mr-2 size-9" /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginButton;