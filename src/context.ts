import "reflect-metadata";
import { inject, injectable } from "inversify";
import { TYPES } from "./Types";
import { IUserRepository } from "./repositories/userRepository";
import { IUser } from "./models/user.model";
import { ICommentRepository } from "./repositories/commentRepository";
import { IComment } from "./models/comment.model";
import { IPost } from "./models/post.model";
import { IPostRepository } from "./repositories/postRepository";
import * as jwt from 'jsonwebtoken';

export interface IContextProvider {
    userRepository: IUserRepository<IUser>;
    postRepository: IPostRepository<IPost>;
    commentRepository: ICommentRepository<IComment>;
    authToken: String;
    currentUser: IUser;
    setAuthToken(token: String): void;
    getCurrentUser(): Promise<IUser>;
}

@injectable()
export class ContextProvider implements IContextProvider {
    authToken: String;
    currentUser: IUser;
    @inject(TYPES.PostRepository)
    postRepository: IPostRepository<IPost>;
    @inject(TYPES.CommentRepository)
    commentRepository: ICommentRepository<IComment>;
    @inject(TYPES.UserRepository)
    userRepository: IUserRepository<IUser>;
    setAuthToken(token: String): void {
        this.authToken = token;
    }

    async getCurrentUser(): Promise<IUser> {
        if (!this.authToken) {
            throw new Error('Authentication required')
        }
        const decoded: Object = jwt.verify(this.authToken as string, 'secret');
        const user: IUser = await this.userRepository.findUserById(decoded['userId']);
        if (!user) {
            throw new Error("No matching user found !!!");
        }
        return user;
    }

}