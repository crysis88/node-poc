import {Schema, Document, model} from 'mongoose';
import { IUser } from './user.model';
import commentModel from './comment.model';

export interface IPost extends Document {
    title: String,
    content: String,
    published: Boolean,
    author: IUser
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date },
    published: { type: Boolean },
    author: { type: Schema.Types.ObjectId, ref: 'User' }

}).pre<IPost>('remove',  function (next) {
    console.log("tryin to remove comments");
     commentModel.deleteMany({post: this.id}).exec();
    next();
})

export default model<IPost>('Post', PostSchema);