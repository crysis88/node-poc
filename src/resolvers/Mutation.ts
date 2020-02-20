import { ContextProvider } from "../context";
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IUser } from "../models/user.model";
export const Mutation = {
    createUser: (parent: any, args: any, context: ContextProvider) => {
        return context.userRepository.createUser(args.userInput.name, args.userInput.mail, args.userInput.password)
    },
    createPost: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.postRepository.createPost(args.postInput.title, args.postInput.content, user.id, args.postInput.published);
    },
    publishPost: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.postRepository.publishPost(args.postId);
    },
    createComment: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.getCurrentUser();
        return context.commentRepository.addComment(args.message, args.postId, user.id);
    },
    login: async (parent: any, args: any, context: ContextProvider) => {
        const user: IUser = await context.userRepository.findUserByEmail(args.mail);
        if (user == null) {
            throw new Error('User not found');
        }
        if (!(await bcryptjs.compare(args.password, user.password as string))) {
            throw new Error("Passwords don't match");
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'secret')
        }

    }

}