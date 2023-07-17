"use client"
import { getBlogBySlug } from "@/sanity/utils/fetch-functions";
import styles from './page.module.css'
import Blog from '../../../components/Blog'
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
export const revalidate = 60;

type Props = {
    params: {
        blog: string
    }
}


export default function BlogPage({ params }: Props) {

    let slug = params.blog;
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async () => {
        setLoading(true);
        let fetchedBlog = await getBlogBySlug(slug);
        setBlog(fetchedBlog);
        setLoading(false);
    }

    useEffect(() => {
        if(!slug || slug == "") return;
        fetchBlog();
    }, [slug])

    
    if (loading) {
        return (
            <Loading />
        )
    }

    if (!blog) {
        return (
            <div className={styles.error}>
                <h1>
                    404, Blog Not Found . . .
                </h1>
            </div>
        )
    }

    return (
        <Blog blog={blog} />
    )
}
