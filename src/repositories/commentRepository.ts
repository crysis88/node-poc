import "reflect-metadata";
import { injectable } from "inversify";
import commentModel, { IComment } from "../models/comment.model";

export interface ICommentRepository<IComment> {
    findCommentById(id: String): Promise<IComment>;
    addComment(message: String, postId: String, author: String): Promise<IComment>;
    fetchComments(post: String): Promise<IComment[]>;
    deleteComment(id: String): Promise<IComment>;
}

@injectable()
export default class CommentRepository implements ICommentRepository<IComment>{
    findCommentById(id: String): Promise<IComment> {
        return commentModel.findById(id).populate('author').populate('post').exec();
    }

    fetchComments(post: String): Promise<IComment[]> {
        return commentModel.find({ post }).populate('author').populate('post').exec();
    }
    addComment(message: String, post: String, author: String): Promise<IComment> {
        return commentModel.create({ message, post, author });
    }
    deleteComment(id: String): Promise<IComment> {
        return commentModel.findByIdAndDelete(id).exec();
    }

}