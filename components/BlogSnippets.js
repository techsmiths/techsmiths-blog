"use client"
import styles from "../app/page.module.css"

import { useState } from "react"
import Link from "next/link"

const BlogSnippets = ({ blogs }) => {

    const [blogList, setBlogList] = useState(blogs);

    // set up pagination
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 3;

    // get current blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogList.slice(indexOfFirstBlog, indexOfLastBlog);

    // change page (make sure the page number is within the range of the number of blogs)
    const paginate = (pageNumber) =>  {
        if (pageNumber < 1) {
            setCurrentPage(1);
        } else if (pageNumber > Math.ceil(blogList.length / blogsPerPage)) {
            setCurrentPage(Math.ceil(blogList.length / blogsPerPage));
        } else {
            setCurrentPage(pageNumber);
        }
    }


    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <img src="/favicon.ico" alt="Techsmiths logo" className={styles.logo} />
                <h1 className={styles.heading}>Techsmiths@blog</h1>
            </div>
            <div className={styles.blogGrid}>
                {currentBlogs.map((blog) => (
                    <div key={blog._id} className={styles.blogCard}>
                        <h3 className={styles.blogTitle}>{blog.title}</h3>
                        <img src={blog.image} alt={blog.title} className={styles.blogImage} />
                        <p className={styles.blogSummary}>{blog.description}</p>
                        <Link href={`/blogs/${blog.slug}`} className={styles.readMore}>
                            Read Article
                        </Link>
                    </div>
                ))}
            </div>
            <div className={styles.paginationBar}>
                <p className={styles.paginationText}>Page {currentPage} of {Math.ceil(blogList.length / blogsPerPage)}</p>
                <div className={styles.paginationButtons}>
                    <button className={styles.paginationButton} onClick={() => paginate(currentPage - 1)}>
                        Previous
                    </button>
                    <button className={styles.paginationButton} onClick={() => paginate(currentPage + 1)}>
                        Next
                    </button>

                </div>
            </div>
        </div>

    )
}

export default BlogSnippets