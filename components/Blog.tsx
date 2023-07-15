"use client"
import React from 'react'
import Authenticator from "./Authenticator"
import { PortableText } from "@portabletext/react";
import { createClient } from 'next-sanity';
import { useNextSanityImage } from 'next-sanity-image'
import { clientConfig } from '@/sanity/utils/fetch-functions';
import styles from '../app/blogs/[blog]/page.module.css'
import { useRouter } from 'next/navigation';

const customPortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            const imageProps: any = useNextSanityImage(createClient(clientConfig), value.asset);
            return (<img src={imageProps.src} alt={value.alt} />);
        },

        code: ({ value }: any) => {
            return (
                <pre>
                    <code>{value.code}</code>
                </pre>
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
        </div>
    )
}

export default Blog