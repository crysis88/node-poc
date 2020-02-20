import * as mongoose from 'mongoose';
import { IUser } from './user.model';
import { IComment } from './comment.model';

export interface IPost extends mongoose.Document {
    title: String,
    content: String,
    published: Boolean,
    author: IUser
}

const PostSchema: mongoose.Schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date },
    published: { type: Boolean },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

});

export default mongoose.model<IPost>('Post', PostSchema);