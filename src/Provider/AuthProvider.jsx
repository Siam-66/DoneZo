
import {
    createContext,
    useEffect,
    useState
  } from "react";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
  } from "firebase/auth";
  import app from "../firebase/firebase.config";
  
  export const AuthContext = createContext();
  
  const auth = getAuth(app);
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // Google sign-in method
    const googleSignIn = async () => {
      setLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        setLoading(false);
        return result.user; 
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        setLoading(false);
        throw error;
      }
    };
  
    // Rest of your AuthProvider code remains the same
    const createNewUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
  
    const userLogin = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
  
    const logOut = () => {
      setLoading(true);
      return signOut(auth).then(() => {
        setUser(null);
        setLoading(false);
      });
    };
  
    const updateUserProfile = (updatedData) => {
      return updateProfile(auth.currentUser, updatedData).then(() => {
        setUser({ ...auth.currentUser, ...updatedData });
      });
    };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log("Auth state changed:", currentUser);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const authInfo = {
      user,
      setUser,
      createNewUser,
      userLogin,
      googleSignIn,
      logOut,
      loading,
      updateUserProfile
    };
  
    return (
      <AuthContext.Provider value={authInfo}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
