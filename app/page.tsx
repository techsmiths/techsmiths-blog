import styles from './page.module.css';
import { getAllBlogSnippets } from '@/sanity/utils/fetch-functions';
import BlogSnippets from '@/components/BlogSnippets';
export default async function Home() {

  const blogs = await getAllBlogSnippets();
  return (
    <BlogSnippets blogs={blogs} />
  )
}
