import { ContextProvider } from "../context";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUser } from "../models/user.model";
export const Mutation = {
    signUp: (parent: any, args: any, context: ContextProvider) => {
        return context.userRepository.createUser(args.userInput.name, args.userInput.mail, args.userInput.password)
    },
    createPost: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.postRepository.createPost(args.postInput.title, args.postInput.content, user.id, args.postInput.published);
    },
    publishPost: async (parent: any, args: any, context: ContextProvider) => {
        await context.getCurrentUser();
        return context.postRepository.publishPost(args.postId);
    },
    deletePost: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.postRepository.deletePost(args.postId);
    },
    createComment: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.commentRepository.addComment(args.message, args.postId, user.id);
    },
    deleteComment: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.commentRepository.deleteComment(args.commentId);
    },
    login: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.userRepository.findUserByEmail(args.mail);
        if (user == null) {
            throw new Error('User not found');
        }
        if (!(await compare(args.password, user.password as string))) {
            throw new Error("Passwords don't match");
        }
        return {
            user,
            token: sign({ userId: user.id }, process.env.TOKEN_SECRET, { expiresIn: "5m" })
        }
    }
}