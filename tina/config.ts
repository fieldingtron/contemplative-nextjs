import { defineConfig } from "tinacms";
import { TinaCMS, Form } from 'tinacms'


// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "article",
        label: "Articles",
        path: "content/articles",
        format: "mdx",

        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
          },
           
           
          {
            type: 'image',
            label: 'Featured Image',
            name: 'featuredImage',
            required: true,

          },

          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          }
          ,
          {
            type: "string",
            name: "slug",
            label: "Slug",
          }
        ],
        ui: {
          beforeSubmit: async ({
            form,
            cms,
            values,
          }: {
            form: Form
            cms: TinaCMS
            values: Record<string, any>
          }) => {
            return {
              ...values,
              slug: values.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, ''),
            }
          },
        }
        // ui: {
        //   // This is an DEMO router. You can remove this to fit your site
        //   router: ({ document }) => `/article/${document._sys.filename}`,
        // },
      },
      {
        name: "direction",
        label: "Direction",
        path: "content/direction",
        format: "mdx",

        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
          },
           
           
          {
            type: 'image',
            label: 'Featured Image',
            name: 'featuredImage',
            required: true,

          },

          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          }
          ,
          {
            type: "string",
            name: "slug",
            label: "Slug",
          }
        ],
        ui: {
          beforeSubmit: async ({
            form,
            cms,
            values,
          }: {
            form: Form
            cms: TinaCMS
            values: Record<string, any>
          }) => {
            return {
              ...values,
              slug: values.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, ''),
            }
          },
        }
        // ui: {
        //   // This is an DEMO router. You can remove this to fit your site
        //   router: ({ document }) => `/article/${document._sys.filename}`,
        // },
      },
      {
        name: "events",
        label: "Events",
        path: "content/events",
        format: "mdx",

        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "SubTitle",
            required: false,
          },{
            type: "string",
            name: "subtitle2",
            label: "SubTitle2",
            required: false,
          },{
            type: "string",
            name: "subtitle3",
            label: "SubTitle3",
            required: false,
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: false,
          },
          {
            type: "string",
            name: "presenter",
            label: "Presenter",
            required: false,
          },
          {
            type: "string",
            name: "registerurl",
            label: "Register URL",
            required: false,
          }, 
          {
            type: 'image',
            label: 'Featured Image',
            name: 'featuredImage',
            required: true,

          },

          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        // ui: {
        //   // This is an DEMO router. You can remove this to fit your site
        //   router: ({ document }) => `/article/${document._sys.filename}`,
        // },
      }
    ],
  },
});
