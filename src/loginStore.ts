import type { User } from 'firebase/auth';

import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { writable } from "svelte/store";
import { app } from './firebaseConf';

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