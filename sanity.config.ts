import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import blog from "./sanity/schemas/blog-schema";


const config = defineConfig({
    projectId: "sqci92wr",
    dataset: "production",
    title: "Odyssey Studio",
    apiVersion: "2023-05-14",
    basePath: "/admin",

    plugins: [deskTool(), codeInput()],

    schema: { types: [blog]}
});
    
export default config;