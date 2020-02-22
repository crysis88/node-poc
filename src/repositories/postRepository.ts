import "reflect-metadata";
import { injectable } from "inversify";
import postModel, { IPost } from "../models/post.model";

export interface IPostRepository<IPost> {
    createPost(title: String, content: String, author: String, published: Boolean): Promise<IPost>;
    findPostByAuthor(author: String): Promise<IPost[]>;
    findPostById(id: String): Promise<IPost>;
    publishPost(postId: String): Promise<IPost>;
    deletePost(postId: String): Promise<IPost>;
}

@injectable()
export default class PostRepository implements IPostRepository<IPost>{
    findPostByAuthor(author: String): Promise<IPost[]> {
        return postModel.find({ author }).populate('author').exec();
    }
    findPostById(id: String): Promise<IPost> {
        return postModel.findById(id).populate('author').exec();
    }
    publishPost(id: String): Promise<IPost> {
        return postModel.findByIdAndUpdate(id, { published: true }, { new: true }).exec();
    }
    createPost(title: String, content: String, author: String, published: Boolean): Promise<IPost> {
        return postModel.create({ title, content, author, published });
    }
    deletePost(postId: String): Promise<IPost> {
        return postModel.findById(postId, (err, post) => {
            return post.remove((err) => {
                if (err) {
                    throw new Error(`Error while deleting post with id: ${post.id}`);
                }
            });
        }).exec();
    }
}