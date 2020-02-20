import "reflect-metadata";
import { injectable } from "inversify";
import userModel, { IUser } from "../models/user.model";


export interface IUserRepository<IUser> {
    createUser(name: String, mail: String, password: String): Promise<IUser>;
    findUserByEmail(mail: String): Promise<IUser>;
    findUserById(userId: String): Promise<IUser>
}

@injectable()
export default class UserRepository implements IUserRepository<IUser>{
    findUserById(userId: String): Promise<IUser> {
        return userModel.findById(userId).exec();
    }
    findUserByEmail(mail: String): Promise<IUser> {
        return userModel.findOne({ mail }).exec();
    }
    createUser(name: String, mail: String, password: String): Promise<IUser> {
        console.log(name);
        return userModel.create({ name, mail, password: password });
    }

}