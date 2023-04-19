import type { User } from 'firebase/auth';

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { writable } from "svelte/store";

const firebaseConfig = {
    apiKey: "AIzaSyA2j104JDsdBgbeZjyXXr12mcqM1bGzIb8",
    authDomain: "saw-test-9a91a.firebaseapp.com",
    projectId: "saw-test-9a91a",
    storageBucket: "saw-test-9a91a.appspot.com",
    messagingSenderId: "72426172756",
    appId: "1:72426172756:web:7c4a8bfb5dcc456148d8c1",
    measurementId: "G-KCWBBEV77R",
};
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


function createUserStore() {
    const { subscribe, set, update } = writable<User>();

    async function login(email: string, pwd: string) {
        try {
            await signInWithEmailAndPassword(auth, email, pwd)
        } catch (err) {
            console.error('ERROR signin with email and password:', err);
        }
    }

    function googleLogin() {
        signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // signed in
            userStore.set(user);
        } else {
            // signed out
            userStore.set(undefined);
        }
    });

    return {
        subscribe, set, update, login, googleLogin, logout,
    };
}

export const userStore = createUserStore(); 