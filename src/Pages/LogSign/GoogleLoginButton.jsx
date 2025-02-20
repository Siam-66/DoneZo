import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../Provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { googleSignIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      
      const userData = {
        name: result.displayName,
        email: result.email,
        photo: result.photoURL,
        role: "tourist"
      };

      console.log("Prepared user data:", userData);

      // const response = await fetch("https://assignment-12-deshventure-server.vercel.app/allUserData", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to save user data");
      }

      const data = await response.json();
      console.log("Database save successful:", data);

      const from = location?.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error) {
      console.error("Sign-in process failed:", error);
      alert("Sign-in failed. Please try again.");
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