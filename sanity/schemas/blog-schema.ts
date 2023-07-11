const blog = {
    name: 'blog',
    title: 'Blogs',
    type: 'document',
    fields: [

        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },

        {
            name: 'slug',
            title: 'Slug',
            type: 'string',
            options: { source: 'title' },
        },

        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotSpot: true },
        },

        {
            name: 'description',
            title: 'Description',
            type: 'string',
        },

        {
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [{ type: 'block' }, { type: 'image' } ],
        }
    ],
}
  
export default blog;