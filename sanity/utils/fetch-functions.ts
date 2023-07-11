import { createClient, groq } from 'next-sanity';

type BlogSnippet = {
    _id: string,
    _createdAt: string,
    title: string,
    slug: string,
    image: string,
    description: string,
}


type Blog = {
    _id: string,
    _createdAt: string,
    title: string,
    slug: string,
    image: string,
    description: string,
    content: any,
}

const clientConfig = {
    projectId: "sqci92wr",
    dataset: "production",
    apiVersion: "2021-03-25",
    useCdn: true,
}

async function getAllBlogSnippets() {
    const client = createClient(clientConfig)

    return client.fetch(groq`*[_type == "blog"]{
    _id,
    _createdAt,
    title,
    slug,
    "image": image.asset->url,
    description,
  }`) as Promise<BlogSnippet[]>;
}

async function getBlogBySlug(slug: string) {
    const client = createClient(clientConfig)

    return client.fetch(groq`*[_type == "blog" && slug == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    "image": image.asset->url,
    description,
    "content": body,
    }`, { slug }) as Promise<Blog>;
}


export { clientConfig, getAllBlogSnippets, getBlogBySlug };