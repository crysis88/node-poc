import { ContextProvider } from "../context";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUser } from "../models/user.model";
import { IComment } from "../models/comment.model";
import { IPost } from "../models/post.model";
import { isValidObjectId } from 'mongoose';
import {errorName}  from "../ErrorList";


export const Mutation = {
    signUp: (parent: any, args: any, context: ContextProvider) =>
        context.userRepository.createUser(args.userInput.name, args.userInput.mail, args.userInput.password),

    createPost: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.postRepository.createPost(args.postInput.title, args.postInput.content, user.id, args.postInput.published);
    },
    publishPost: async (parent: any, args: any, context: ContextProvider) => {
        const currentUser: IUser = await context.getCurrentUser();
        if (!isValidObjectId(args.postId)) {
            throw new Error(errorName.INVALID_POST_ID);
        }
        let post: IPost;
        try {
            post = await context.postRepository.findPostById(args.postId);
        } catch (error) {
            throw new Error(errorName.POST_NOT_FOUND);
        }
        if (post) {
            if (post.author._id.toString() == currentUser._id.toString()) {
                return context.postRepository.publishPost(args.postId);
            }
            else {
                throw new Error(errorName.POST_DELETE_NOT_ALLOWED);
            }
        } else {
            throw new Error(errorName.POST_NOT_FOUND);
        }
    },
    deletePost: async (parent: any, args: any, context: ContextProvider) => {
        const currentUser: IUser = await context.getCurrentUser();
        if (!isValidObjectId(args.postId)) {
            throw new Error(errorName.INVALID_POST_ID);
        }
        let post: IPost;
        try {
            post = await context.postRepository.findPostById(args.postId);
        } catch (error) {
            throw new Error(errorName.POST_NOT_FOUND);
        }
        if (post) {
            if (post.author._id.toString() == currentUser._id.toString()) {
                return context.postRepository.deletePost(args.postId);
            }
            else {
                throw new Error(errorName.POST_DELETE_NOT_ALLOWED);
            }
        } else {
            throw new Error(errorName.POST_NOT_FOUND);
        }
    },
    createComment: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.commentRepository.addComment(args.message, args.postId, user.id);
    },
    deleteComment: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        if (!isValidObjectId(args.commentId)) {
            throw new Error(errorName.INVALID_COMMENT_ID);
        }
        let comment: IComment;
        try {
            comment = await context.commentRepository.findCommentById(args.commentId);
        } catch (error) {
            throw new Error(errorName.COMMENT_NOT_FOUND);
        }
        if (comment) {
            if (user._id.toString() == comment.author._id.toString()) {
                return context.commentRepository.deleteComment(args.commentId);

            } else {
                throw new Error(errorName.COMMENT_DELETE_NOT_ALLOWED);
            }
        } else {
            throw new Error(errorName.COMMENT_NOT_FOUND);
        }

    },
    login: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.userRepository.findUserByEmail(args.mail);
        if (user == null) {
            throw new Error(errorName.INVALID_USER);
        }
        if (!(await compare(args.password, user.password as string))) {
            throw new Error(errorName.INVALID_PASSWORD);
        }
        return {
            user,
            token: sign({ userId: user.id }, process.env.TOKEN_SECRET, { expiresIn: "5m" })
        }
    }
}