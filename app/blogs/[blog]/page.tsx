
import { clientConfig, getBlogBySlug } from "@/sanity/utils/fetch-functions";
import { PortableText } from "@portabletext/react";
import { createClient } from 'next-sanity';
import { useNextSanityImage } from 'next-sanity-image'

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
    },
};



export default async function Blog({ params }: Props) {

    let slug = params.blog;
    let blog = await getBlogBySlug(slug);

    
    if (!blog) {
        return <div>404</div>
    }


    return (
        <div>
            <h1>{blog.title}</h1>
            <img src={blog.image} alt={blog.title} />
            <div>
                <PortableText value={blog.content}
                    components={customPortableTextComponents}
                />
            </div>
        </div>
    )
}
