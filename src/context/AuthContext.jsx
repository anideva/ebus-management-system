import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext({
  user: null,
  role: null,
  token: null,
  loading: true,
  isDemoUser: false,
  refreshRole: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (firebaseUser) => {
    const email = (firebaseUser?.email || "").toLowerCase();
    const isKnownAdmin =
      email === "admin.demo@ebus.com" ||
      email.includes("admin@") ||
      email.startsWith("admin.");

    try {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const resolvedRole = data.role || (isKnownAdmin ? "admin" : "passenger");
        setRole(resolvedRole);
        return resolvedRole;
      } else {
        const fallbackRole = isKnownAdmin ? "admin" : "passenger";
        setRole(fallbackRole);
        return fallbackRole;
      }
    } catch (err) {
      console.warn("Could not fetch user role, using resilient role fallback:", err.message);
      const fallbackRole = isKnownAdmin ? "admin" : "passenger";
      setRole(fallbackRole);
      return fallbackRole;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchRole(currentUser);
      } else {
        setRole(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshRole = async () => {
    if (auth.currentUser) {
      return await fetchRole(auth.currentUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setToken(null);
  };

  const isDemoUser =
    user?.email === "admin.demo@ebus.com" ||
    user?.email === "passenger.demo@ebus.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isDemoUser,
        refreshRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
