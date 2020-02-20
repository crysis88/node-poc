import { ContextProvider } from "../context";
import { IPost } from "../models/post.model";
import { IComment } from "../models/comment.model";

export const Query = {
    getPostById: async (parent: any, args: any, context: ContextProvider) => {
       const post: IPost = await  context.postRepository.findPostByID(args.id);
        return post;
    },
    getPostByAuthor: async (parent: any, args: any, context: ContextProvider) => {
        const post: IPost = await context.postRepository.findPostByAuthor(args.author);
        return post;
    },
    comments: async (parent: any, args: any, context: ContextProvider) => {
     const comments : IComment[] = await context.commentRepository.fetchComments(args.post);
     return comments;
    }

}