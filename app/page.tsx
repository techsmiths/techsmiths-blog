import styles from './page.module.css';
import { getAllBlogSnippets } from '@/sanity/utils/fetch-functions';
import Link from 'next/link';



export default async function Home() {

  const blogs = await getAllBlogSnippets();

  return (
    <div className={styles.homepage}>
      <div className={styles.header}>
        <img src="/favicon.ico" alt="Techsmiths logo" className={styles.logo} />
        <h1 className={styles.heading}>Techsmiths@blog</h1>
      </div>
      <div className={styles.blogGrid}>
        {blogs.map((blog) => (
          <div key={blog._id} className={styles.blogCard}>
            <h3 className={styles.blogTitle}>{blog.title}</h3>
            <img src={blog.image} alt={blog.title} className={styles.blogImage} />
            <p className={styles.blogSummary}>{blog.description}</p>
            <Link href={`/blogs/${blog.slug}`} className={styles.readMore}>
              Read more &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>

  )
}
