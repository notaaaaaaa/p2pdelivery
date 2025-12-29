import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { getUserDocument } from "../../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user data from your backend
          const userDoc = await getUserDocument(firebaseUser.uid);

          setUser({
            ...firebaseUser,
            ...userDoc, // Merge Firebase user with additional user data
            id: userDoc.id,
            uid: firebaseUser.uid, // Ensure uid is set from Firebase
          });
          setUserLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user document:", error);
          setUser(firebaseUser); // Fallback to just Firebase user if fetch fails
          setUserLoggedIn(true);
        }
      } else {
        setUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getIdToken = async () => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken(true);
      } catch (error) {
        console.error("Error getting ID token:", error);
        return null;
      }
    }
    return null;
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <AuthContext.Provider value={{ user, setUser, userLoggedIn, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
