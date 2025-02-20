import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../../Provider/AuthProvider";
import GoogleLoginButton from "./GoogleLoginButton";

const Signup = () => {
    const { createNewUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [photoURL, setPhotoURL] = useState("");
    const [uploadError, setUploadError] = useState("");

    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError("");

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(image_hosting_api, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const result = await response.json();
            setPhotoURL(result.data.display_url);
        } catch (error) {
            console.error("Image upload error:", error);
            setUploadError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const name = form.get("name");
        const email = form.get("email");
        const password = form.get("password");

        // Validation errors
        let newError = {};

        if (name.length < 5) {
            newError.name = "Name must be more than 5 characters long.";
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            newError.email = "Please enter a valid email address.";
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasMinLength = password.length >= 6;

        if (!hasUppercase) {
            newError.password = "Password must include at least one uppercase letter.";
        } else if (!hasLowercase) {
            newError.password = "Password must include at least one lowercase letter.";
        } else if (!hasMinLength) {
            newError.password = "Password must be more than 6 characters long.";
        }

        if (!photoURL) {
            newError.photo = "Please upload a profile photo.";
        }

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        setError({});

        createNewUser(email, password)
            .then((result) => {
                const user = result.user;
                console.log(user);
                return updateUserProfile({ displayName: name, photoURL: photoURL });
            })
            // .then(() => {
            //     const userData = { name, email, photo: photoURL, role: "tourist" };
            //     return fetch("https://assignment-12-deshventure-server.vercel.app/allUserData", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify(userData),
            //     });
            // })
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.error("Error creating user:", err);
            });
    };

    return (
        <div className="flex items-center justify-center my-16">
            <div className="card bg-base-200 w-full max-w-sm shrink-0 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input 
                            name="name" 
                            type="text" 
                            placeholder="Name" 
                            className="input input-bordered" 
                        />
                        {error.name && <label className="label text-red-600 text-sm">{error.name}</label>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Profile Photo</span>
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="file-input file-input-bordered w-full"
                            disabled={isUploading}
                        />
                        {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                        {uploadError && <label className="label text-red-600 text-sm">{uploadError}</label>}
                        {error.photo && <label className="label text-red-600 text-sm">{error.photo}</label>}
                        {photoURL && (
                            <div className="mt-2">
                                <img 
                                    src={photoURL} 
                                    alt="Profile preview" 
                                    className="w-20 h-20 object-cover rounded-full mx-auto"
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="Email" 
                            className="input input-bordered" 
                        />
                        {error.email && <label className="label text-red-600 text-sm">{error.email}</label>}
                    </div>

                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className="input input-bordered"
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-12 text-gray-500"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                        </button>
                        {error.password && <label className="label text-red-600 text-sm">{error.password}</label>}
                    </div>

                    <div className="form-control mt-6">
                        <button 
                            className="btn text-xl bg-gradient-to-r from-green-600 via-lime-500 to-emerald-300 text-white font-semibold"
                            disabled={isUploading}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <GoogleLoginButton />
            </div>
        </div>
    );
};

export default Signup;