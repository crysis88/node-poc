import { ContextProvider } from "../context";
import { isValidObjectId } from 'mongoose';
import {errorName}  from "../ErrorList";

export const Query = {
    postById: async (parent: any, args: any, context: ContextProvider) => {
        if (!isValidObjectId(args.postId)) {
            throw new Error(errorName.INVALID_POST_ID);
        }
        return context.postRepository.findPostById(args.id)
    },

    postByAuthor: async (parent: any, args: any, context: ContextProvider) => {
        const author: String = args.author ? args.author : (await context.getCurrentUser()).id;
        return context.postRepository.findPostByAuthor(author);
    },

    comments: async (parent: any, args: any, context: ContextProvider) => {
        if (!isValidObjectId(args.postId)) {
            throw new Error(errorName.INVALID_POST_ID);
        }
        return context.commentRepository.fetchComments(args.post);
    }
}