
import { clientConfig, getBlogBySlug } from "@/sanity/utils/fetch-functions";
import { PortableText } from "@portabletext/react";
import { createClient } from 'next-sanity';
import { useNextSanityImage } from 'next-sanity-image'
import styles from './page.module.css'

type Props = {
    params: {
        blog: string
    }
}

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



export default async function Blog({ params }: Props) {

    let slug = params.blog;
    let blog = await getBlogBySlug(slug);


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
        <div className={styles.blogPage}>
            <div className={styles.nav}>
                <a href="/">Home</a>
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
