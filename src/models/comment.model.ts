import {Schema, Document, model} from 'mongoose';
import { IUser } from './user.model';
import { IPost } from './post.model';

export interface IComment extends Document {
    message: String,
    author: IUser,
    post: IPost
}

const CommentSchema: Schema = new Schema({
    message: { type: String, required: true },
    createdAt: { type: Date },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' }

});

export default model<IComment>('Comment', CommentSchema);