import { useContext, useState, useEffect, createContext, ReactNode } from "react";
import {signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { addUser } from "@/lib/firebase/database.js";


const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
                signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    addUser(user);
                })
            } catch (error) {
                console.log(error);
            }
    }

    const logOut = async () => {
        signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, [user]);


    return (
        <AuthContext.Provider value={{user, googleSignIn, logOut}}>{children}</AuthContext.Provider>
    );
}


export const useAuth = () => {
    return useContext(AuthContext);
}