"use client"
import React, { useRef, useState } from 'react'
import Authenticator from "./Authenticator"
import { PortableText } from "@portabletext/react";
import { createClient } from 'next-sanity';
import { useNextSanityImage } from 'next-sanity-image'
import { clientConfig } from '@/sanity/utils/fetch-functions';
import styles from '../app/blogs/[blog]/page.module.css'
import { useRouter } from 'next/navigation';
import useFirebase from '@/hooks/useFirebase';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type BlogT = {
    title: string,
    image: string,
    slug: string,
    content: any,
    _createdAt: string,
}

const customPortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            const imageProps: any = useNextSanityImage(createClient(clientConfig), value.asset);
            return (<img src={imageProps.src} alt={value.alt} />);
        },
        code: ({ value }: any) => {
            return (
                <SyntaxHighlighter language={value.language && value.language.toLowerCase()} style={a11yDark}>
                    {value.code}
                </SyntaxHighlighter>
            )
        }

    },
};



function Blog({ blog }: { blog: BlogT }) {

    const router = useRouter();
    const { user, comments, likesCount, addCommentToDatabase, toggleLikeOfPost, isLikedByUser: liked } = useFirebase(blog.slug);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const divRef = useRef(null);

    const handleScroll = () => {
        if (!divRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = divRef.current;
        const scrollableHeight = scrollHeight - clientHeight;
        const percentage = (scrollTop / scrollableHeight) * 100;
        setScrollPercentage(percentage);
    };

    function notify(message: string) {
        toast(message);
    }
    function copyCurrentUrlToClipBord() {
        navigator.clipboard.writeText(window.location.href);
        notify("the article's url has been copied to your clipboard!");
    }

    if (isCommentsOpen) {
        return (
            <div className={styles.blogPage}>
                <div className={styles.header}>
                    <div className={styles.logoContainer}>
                        <img src="/logo.png" alt="Techsmiths logo" className={styles.logo} onClick={() => router.push('/')} />
                    </div>
                    <Authenticator />
                </div>
                <div className={styles.blog}>
                    <div className={styles.comments}>
                        <div className={styles.commentsClose}>
                            <button className={styles.button} onClick={() => { setIsCommentsOpen(false) }}>
                                Close
                            </button>
                        </div>


                        <div className={styles.commentsContainer}>
                            {
                                comments?.map((comment: any) => {
                                    return (
                                        <div className={styles.comment} key={comment.id}>
                                            <div className={styles.commentHeader}>
                                                <div className={styles.userOfComment}>
                                                    <img
                                                        src={comment.user.photoURL}
                                                        referrerPolicy="no-referrer"
                                                        alt="user profile"
                                                    />
                                                    <p>{comment.user.displayName}</p>
                                                </div>
                                                <div>
                                                    <p className={styles.date}>
                                                        {
                                                            // from milliseconds to date
                                                            new Date(comment.createdAt.seconds * 1000).toLocaleDateString()

                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <p>{comment.content}</p>
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>

                        <div className={styles.commentInput}>
                            <input type="text" placeholder="Write a comment..." onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addCommentToDatabase(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <div className={styles.blogPage}>
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <img src="/logo.png" alt="Techsmiths logo" className={styles.logo} onClick={() => router.push('/')} />
                </div>
                <Authenticator />
            </div>
            <div className={styles.blog} ref={divRef} onScroll={handleScroll}>
                <h1 className={styles.title}>{blog.title} </h1>
                <img src={blog.image} alt={blog.title} />
                <p style={{ color: "gray" }}>
                    published on : {new Date(blog._createdAt).toLocaleDateString()}
                </p>
                <div>
                    <PortableText value={blog.content}
                        components={customPortableTextComponents}
                    />
                </div>
            </div>
            {
                <div className={styles.reactionBar}>
                    <div className={styles.progressBar} style={{ width: `${scrollPercentage}%`, height: "2px" }}></div>
                    {

                        // if logged in
                        user ?
                            (
                                <div className={styles.reactions}>
                                    <div className={styles.button} onClick={toggleLikeOfPost}>
                                        <p>{likesCount}</p>
                                        <div>
                                            <img src={liked ? "/liked.png" : "/unliked.png"} alt="like icon" />
                                        </div>
                                    </div>
                                    <div className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                        <p>
                                            {comments?.length}
                                        </p>
                                        <div>
                                            <img src="/comment.png" alt="comment icon" />
                                        </div>
                                    </div>
                                    <div className={styles.button} onClick={copyCurrentUrlToClipBord}>
                                        <p>
                                            Share
                                        </p>
                                        <div>
                                            <img src="/share.png" alt="share icon" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.reactions}>
                                    <div className={styles.button} onClick={() => notify("You need to sign in to like an article!")}>
                                        <p>{likesCount}</p>
                                        <div>
                                            <img src="/unliked.png" alt="like icon" />
                                        </div>
                                    </div>
                                    <div className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                        <p>
                                            {comments?.length}
                                        </p>
                                        <div>
                                            <img src="/comment.png" alt="comment icon" />
                                        </div>
                                    </div>
                                    <div className={styles.button} onClick={copyCurrentUrlToClipBord}>
                                        <p>
                                            Share
                                        </p>
                                        <div>
                                            <img src="/share.png" alt="share logo" />
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </div>
            }
            <ToastContainer
                position="top-right"
                autoClose={2000}
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    )
}

export default Blog