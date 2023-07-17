"use client"
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { app } from '../database/firebase'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot, doc } from 'firebase/firestore';

const database = getFirestore(app);



const auth = getAuth(app);


const useFirebase = (slug) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [likesCount, setLikesCount] = useState(0);
    const [isLikedByUser, setIsLikedByUser] = useState(false);

    // side effects for authentication

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // side effects for comments

    useEffect(() => {

        if (!user) return;
        if (!slug || slug === "") return;

        // use the reference to the collection of comments to listen to changes in the database
        const reference = collection(database, "comments");
        const unsubscribe = onSnapshot(reference, {
            next: (snapshot) => {



                const fetchedComments = [];
                // only keep the comments for the current post
                console.log(fetchedComments);
                snapshot.forEach((doc) => {
                    if (doc.data().slug === slug) {
                        fetchedComments.push({ ...doc.data(), id: doc.id });
                    }
                });
                setComments(fetchedComments);
            },
            error: (error) => {
                console.error('Error:', error);
            },
            complete: () => {
                console.log('Listener completed');
            }
        });

        return () => unsubscribe();

    }, [user, slug]);


    // side effects for likes

    useEffect(() => {
        if (!slug || slug === "") return;

        // use the reference to the collection of likes to listen to changes in the database
        const reference = collection(database, "likes");
        const unsubscribe = onSnapshot(reference, {
            next: (snapshot) => {
                const fetchedLikes = [];
                // only keep the likes for the current post
                snapshot.forEach((doc) => {
                    if (doc.data().slug === slug) {
                        fetchedLikes.push({ ...doc.data(), id: doc.id });
                    }
                });
                setLikesCount(fetchedLikes.length);
                if (user) {
                    const isLiked = fetchedLikes.some((like) => like.user.uid === user?.uid);
                    setIsLikedByUser(isLiked);
                }
            },
            error: (error) => {
                console.error('Error:', error);
            },
            complete: () => {
                console.log('Listener completed');
            }
        });

        return () => unsubscribe();
    }, [slug, user]);









    // functions
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

    const addCommentToDatabase = async (content, repliedTo) => {

        if (!user) return;
        if (!content || content === "") return;
        if (!slug || slug === "") return;

        try {
            const docRef = await addDoc(collection(database, "comments"), {
                content,
                slug,
                repliedTo,
                createdAt: new Date(),
                user: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
            });
            return docRef.id;
        }
        catch (error) {
            console.log(error.message);
        }
    }



    const toggleLikeOfPost = async () => {
        const q = query(collection(database, "likes"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        const likes = [];
        querySnapshot.forEach((doc) => {
            likes.push({ ...doc.data(), id: doc.id });
        });
        const like = likes.find((like) => like.user.uid === user.uid);
        if (like) {
            console.log("deleting like", like.id);
            // let docRef = doc(database, "likes", like.id);
            await deleteDoc(doc(database, "likes", like.id));
        } else {
            await addDoc(collection(database, "likes"), {
                slug,
                createdAt: new Date(),
                user: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
            });
        }
    }


    return {
        user,
        isLoading,
        error,

        comments,
        likesCount,
        isLikedByUser,

        signInWithGoogle,
        signOut,
        addCommentToDatabase,
        toggleLikeOfPost,
    }


}

export default useFirebase