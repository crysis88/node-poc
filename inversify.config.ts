import { ContainerModule } from 'inversify';
import UserRepository, { IUserRepository } from './src/repositories/userRepository';
import { IUser } from './src/models/user.model';
import { TYPES } from './src/Types';
import { IContextProvider, ContextProvider } from './src/context';
import CommentRepository, { ICommentRepository } from './src/repositories/commentRepository';
import { IComment } from './src/models/comment.model';
import PostRepository, { IPostRepository } from './src/repositories/postRepository';
import { IPost } from './src/models/post.model';

export const DIModule = new ContainerModule((bind) => {
    bind<IUserRepository<IUser>>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
    bind<ICommentRepository<IComment>>(TYPES.CommentRepository).to(CommentRepository).inSingletonScope();
    bind<IPostRepository<IPost>>(TYPES.PostRepository).to(PostRepository).inSingletonScope();
    bind<IContextProvider>(TYPES.ContextProvider).to(ContextProvider).inRequestScope();

})