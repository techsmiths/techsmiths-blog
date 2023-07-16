"use client"
import React, { useState } from 'react'
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


type BlogT = {
    title: string,
    image: string,
    content: any
}



function Blog({ blog }: { blog: BlogT }) {

    const router = useRouter();
    const { user } = useFirebase();

    const [liked, setLiked] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);


    function copyCurrentUrlToClipBord() {

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
                        <button className={styles.button} onClick={() => { setIsCommentsOpen(false) }}>
                            Close
                        </button>
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
            <div className={styles.blog}>
                <h1 className={styles.title}>{blog.title}</h1>
                <img src={blog.image} alt={blog.title} />
                <div>
                    <PortableText value={blog.content}
                        components={customPortableTextComponents}
                    />
                </div>
                {
                    <div className={styles.reactionBar}>
                        {!user && <p>Sign in to like, comment and share</p>}
                        {

                            // if logged in
                            user ?
                                (
                                    <div className={styles.reactions}>
                                        <button className={styles.button}>
                                            <p>1</p>
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                        <button className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                            <p>31</p>
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                        <button className={styles.button}>
                                            Share
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.reactions}>
                                        <button className={styles.button}>
                                            <p>1</p>
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                        <button className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                            <p>31</p>
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                        <button className={styles.button}>
                                            Share
                                            <img src="/logo.png" alt="Techsmiths logo" />
                                        </button>
                                    </div>
                                )
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Blog