import { ContextProvider } from "../context";

export const Query = {
    postById: async (parent: any, args: any, context: ContextProvider) =>
        await context.postRepository.findPostByID(args.id)
    ,
    postByAuthor: async (parent: any, args: any, context: ContextProvider) => {
        const author: String = args.author ? args.author : (await context.getCurrentUser()).id;
        return await context.postRepository.findPostByAuthor(author);
    },

    comments: async (parent: any, args: any, context: ContextProvider) =>
        await context.commentRepository.fetchComments(args.post)

}