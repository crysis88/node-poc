import "reflect-metadata";
import { injectable } from "inversify";
import postModel, { IPost } from "../models/post.model";

export interface IPostRepository<IComment> {
    createPost(title: String, content: String, author: String, published: Boolean): Promise<IPost>;
    findPostByAuthor(author: String): Promise<IPost>;
    findPostByID(id: String): Promise<IPost>;
    publishPost(postId: String): Promise<IPost>;
}

@injectable()
export default class PostRepository implements IPostRepository<IPost>{
    findPostByAuthor(author: String): Promise<IPost> {
        return postModel.findOne({ author }).populate('comments').exec();
    }
    findPostByID(id: String): Promise<IPost> {
        return postModel.findById(id).populate('author').exec();
    }
    async publishPost(id: String): Promise<IPost> {
        return postModel.findByIdAndUpdate(id, { published: true }, {new: true});
    }
    async createPost(title: String, content: String, author: String, published: Boolean): Promise<IPost> {
        return postModel.create({ title, content, author, published });
    }
}