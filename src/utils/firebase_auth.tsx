import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth, doesUserExist, newUser } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Login function
export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// Signup function
export const signup = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        newUser(userCredential.user.uid, email);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

// Signup with Google function
export const signupWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        //check if user already exists
        if (await doesUserExist(result.user.uid)) {
            console.log("User already exists, skipping new user creation.");
            return result.user;
        }
        // If user does not exist, create a new user
        if (result.user.email) {
            newUser(result.user.uid, result.user.email);
        } else {
            newUser(result.user.uid, '');
        }
        return result.user;
    } catch (error) {
        throw error;
    }
};