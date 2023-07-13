"use client"
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { app } from '../database/firebase'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'



const auth = getAuth(app);

const useFirebase = () => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const googleAuthProvide = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const { user } = await signInWithPopup(auth, googleAuthProvide);
            setUser(user);
            setIsLoading(false);
            setError(null);
        }
        catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }

    const signOut = async () => {
        try {
            setIsLoading(true);
            await auth.signOut();
            setUser(null);
            setIsLoading(false);
            setError(null);
        }
        catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }


    return {
        user,
        isLoading,
        signInWithGoogle,
        error,
        signOut
    }


}

export default useFirebase