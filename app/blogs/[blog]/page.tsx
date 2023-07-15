
import { clientConfig, getBlogBySlug } from "@/sanity/utils/fetch-functions";
import styles from './page.module.css'
import Blog from '../../../components/Blog'

type Props = {
    params: {
        blog: string
    }
}



export default async function BlogPage({ params }: Props) {

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
        <Blog blog={blog} />
    )
}
