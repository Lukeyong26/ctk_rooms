import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Login function
export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

// Signup function
export const createUser = async (email: string, password: string) => {

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing up:", errorCode, errorMessage);
    });
};

// Signup with Google function
// export const signupWithGoogle = async () => {
//     try {
//         const result = await signInWithPopup(auth, googleProvider);
//         //check if user already exists
//         if (await doesUserExist(result.user.uid)) {
//             console.log("User already exists, skipping new user creation.");
//             return result.user;
//         }
//         // If user does not exist, create a new user
//         if (result.user.email) {
//             newUser(result.user.uid, result.user.email);
//         } else {
//             newUser(result.user.uid, '');
//         }
//         return result.user;
//     } catch (error) {
//         throw error;
//     }
// };