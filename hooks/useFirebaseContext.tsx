import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../src/constant/firebase.config";
import { supabase } from "../src/constant/supabase.config";
import { useStore } from "./useStore";

interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Watch auth state changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (!firebaseUser) {
            // Clear user session on logout
            useStore.getState().syncUserSession(null);
            return;
          }

          try {
            const { data: profileData, error: fetchError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", firebaseUser.uid)
              .single();
            
            let username = firebaseUser.email?.split("@")[0] || "NikeUser";
            let fullName = username;
            let phone = "";
            let address = "";

            if (fetchError || !profileData) {
              // Create profile in Supabase if it doesn't exist
              const { error: insertError } = await supabase
                .from("profiles")
                .insert([
                  {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    username,
                    full_name: fullName,
                    phone,
                    address,
                    updated_at: new Date().toISOString()
                  }
                ]);
              if (insertError) {
                console.error("Error creating profile in Supabase:", insertError);
              }
            } else {
              username = profileData.username || username;
              fullName = profileData.full_name || username;
              phone = profileData.phone || "";
              address = profileData.address || "";
            }

            // Sync user session (local storage partition key, email, username)
            useStore.getState().syncUserSession(firebaseUser.uid, firebaseUser.email || undefined, username);
            
            // Sync profile fields from Supabase into the Zustand store
            useStore.getState().updateProfile({
              fullName,
              phone,
              address,
            });
          } catch (err) {
            console.error("Supabase error:", err);
            // Fallback session sync using only Auth info
            useStore.getState().syncUserSession(firebaseUser.uid, firebaseUser.email || undefined);
          }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, username?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Supabase profiles table
      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: userCredential.user.uid,
            email,
            username: username || email.split("@")[0],
            full_name: username || email.split("@")[0],
            phone: "",
            address: "",
            updated_at: new Date().toISOString()
          });
        if (profileError) {
          console.error("Failed to save profile to Supabase:", profileError);
        }
      } catch (profErr) {
        console.error("Supabase profile save error:", profErr);
      }
      
      // Log activity to Supabase
      try {
        const activityId = `ACT-${crypto.randomUUID().slice(0, 12)}`;
        await supabase.from("activity_logs").insert([
          {
            id: activityId,
            email,
            uid: userCredential.user.uid,
            type: "Sign Up",
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (logErr) {
        console.error("Failed to log signup activity:", logErr);
      }
      
      setUser(userCredential.user);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already registered. Please log in.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email format.");
      }
      if (error.code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters.");
      }
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Log activity to Supabase
      try {
        const activityId = `ACT-${crypto.randomUUID().slice(0, 12)}`;
        await supabase.from("activity_logs").insert([
          {
            id: activityId,
            email,
            uid: userCredential.user.uid,
            type: "Sign In",
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (logErr) {
        console.error("Failed to log signin activity:", logErr);
      }

      setUser(userCredential.user);
    } catch (error: any) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        throw new Error("Incorrect email or password.");
      }
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email.");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email format.");
      }
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const currentUser = auth.currentUser;
      await signOut(auth);
      
      // Log activity to Supabase
      if (currentUser) {
        try {
          const activityId = `ACT-${crypto.randomUUID().slice(0, 12)}`;
          await supabase.from("activity_logs").insert([
            {
              id: activityId,
              email: currentUser.email,
              uid: currentUser.uid,
              type: "Sign Out",
              timestamp: new Date().toISOString()
            }
          ]);
        } catch (logErr) {
          console.error("Failed to log signout activity:", logErr);
        }
      }

      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within FirebaseProvider");
  }
  return context;
};

export const ADMIN_EMAILS = ["modykoka252@gmail.com", "modykoka272@gmail.com"];

export const isAdminUser = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};