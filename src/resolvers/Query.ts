import { ContextProvider } from "../context";
import { isValidObjectId } from 'mongoose';

export const Query = {
    postById: async (parent: any, args: any, context: ContextProvider) => {
        if (!isValidObjectId(args.postId)) {
            throw new Error('Post Id is invalid');
        }
        return context.postRepository.findPostById(args.id)
    },

    postByAuthor: async (parent: any, args: any, context: ContextProvider) => {
        const author: String = args.author ? args.author : (await context.getCurrentUser()).id;
        return context.postRepository.findPostByAuthor(author);
    },

    comments: async (parent: any, args: any, context: ContextProvider) => {
        if (!isValidObjectId(args.postId)) {
            throw new Error('Post Id is invalid');
        }
        return context.commentRepository.fetchComments(args.post);
    }
}