import {Schema, Document, model} from 'mongoose';
import {hash} from 'bcryptjs';

export interface IUser extends Document {
    name: String,
    mail: String,
    password: String
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true }

}, { timestamps: true })
    .pre<IUser>('save', async function (next) {
        let user = this;
        if (!user.isModified('password')) { return next() };
        await hash(this.password as string, 10).then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        });
    });


export default model<IUser>('User', UserSchema);
