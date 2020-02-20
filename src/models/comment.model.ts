import * as mongoose from 'mongoose';
import { IUser } from './user.model';
import { IPost } from './post.model';

export interface IComment extends mongoose.Document {
    message: String,
    author: IUser,
    post: IPost
}

const CommentSchema: mongoose.Schema = new mongoose.Schema({
    message: { type: String, required: true },
    createdAt: { type: Date },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }

});

export default mongoose.model<IComment>('Comment', CommentSchema);