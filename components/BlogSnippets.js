"use client"
import styles from "../app/page.module.css"

import { useState } from "react"
import Link from "next/link"

const BlogSnippets = ({ blogs }) => {


    // set up pagination
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 1;

    // get current blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // change page (make sure the page number is within the range of the number of blogs)
    const paginate = (pageNumber) => {
        if (pageNumber < 1) {
            setCurrentPage(1);
        } else if (pageNumber > Math.ceil(blogs.length / blogsPerPage)) {
            setCurrentPage(Math.ceil(blogs.length / blogsPerPage));
        } else {
            setCurrentPage(pageNumber);
        }
    }

    const renderNumberedButtons = () => {

        // calculate the number of pages
        const totalPages = Math.ceil(blogs.length / blogsPerPage);

        // a range of buttons to display
        let startPage;
        let endPage;

        // if there are less than 5 pages, display all of them
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {

            // if the current page is less than 3, display the first 5 pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            }
            // if the current page is greater than the last 3 pages, display the last 5 pages
            else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else 
            // otherwise, display the 2 pages before and after the current page
            {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        const buttons = [];
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`${styles.paginationButton} ${i === currentPage ? styles.activeButton : ''}`}
                    onClick={() => paginate(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };




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
                <p className={styles.paginationText}>Page {currentPage} of {Math.ceil(blogs.length / blogsPerPage)}</p>
                <div className={styles.paginationButtons}>
                    <button className={styles.paginationButton} onClick={() => paginate(currentPage - 1)}>
                        Previous
                    </button>
                    {renderNumberedButtons()}
                    <button className={styles.paginationButton} onClick={() => paginate(currentPage + 1)}>
                        Next
                    </button>

                </div>
            </div>
        </div>

    )
}

export default BlogSnippets