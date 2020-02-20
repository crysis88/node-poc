import * as mongoose from 'mongoose';
import * as bcryptjs from 'bcryptjs';

export interface IUser extends mongoose.Document {
    name: String,
    mail: String,
    password: String
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true }

}, { timestamps: true })
    .pre<IUser>('save', async function (next) {
        let user = this;
        if (!user.isModified('password')) { return next() };
        await bcryptjs.hash(this.password as string, 10).then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        });
    });


export default mongoose.model<IUser>('User', UserSchema);
