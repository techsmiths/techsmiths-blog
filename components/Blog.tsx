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

type BlogT = {
    title: string,
    image: string,
    content: any
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
    const { user } = useFirebase();
    const [liked, setLiked] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);


    function copyCurrentUrlToClipBord() {
        navigator.clipboard.writeText(window.location.href);
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
            </div>
                {
                    <div className={styles.reactionBar}>
                        {

                            // if logged in
                            user ?
                                (
                                    <div className={styles.reactions}>
                                        <div className={styles.button} onClick={() => setLiked(!liked)}>
                                            <p>1</p>
                                            <div>
                                                <img src={liked ? "/liked.png" : "/unliked.png"} alt="like icon" />
                                            </div>
                                        </div>
                                        <div className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                            <p>31</p>
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
                                        <div className={styles.button}>
                                            <p>1</p>
                                            <div>
                                                <img src="/unliked.png" alt="like icon" />
                                            </div>
                                        </div>
                                        <div className={styles.button} onClick={() => setIsCommentsOpen(true)}>
                                            <p>31</p>
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
        </div>
    )
}

export default Blog