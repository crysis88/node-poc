import "reflect-metadata";
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import resolvers from '../resolvers';
import typeDefs from '../type-defs';
import { ApolloServer } from 'apollo-server';
import { Container } from 'inversify';
import { DIModule } from '../../inversify.config';
import { TYPES } from '../Types';

const constructTestServer = (mockAuth) => {
  const container = new Container();
  container.load(DIModule);

  const server = new ApolloServer({
    context: () => {
      const ctx = container.get(TYPES.ContextProvider);
      if (mockAuth) {
        ctx.getCurrentUser = jest.fn(() => { return { _id: '5e4e61a8dc4d7e6b9026c963' } });
      }
      return ctx
    },
    typeDefs,
    resolvers,
  });
  return { server, container };
};

// the mocked REST API data


const mockedSignupResponse =
{
  _id: "5e4e61a8dc4d7e6b9026c963",
  name: "sandeep6",
  mail: "s@123456678.com"
}

const mockedPostResponse = {
  _id: "5e4e8e6b3813b23298b32919",
  title: "Test Post",
  content: "This is a test post",
  published: false,
  author: {
    _id: "5e4e61a8dc4d7e6b9026c963",
    name: "sandeep6",
    mail: "s@123456678.com"
  }
}

const mockedCreatePostResponse =
{
  _id: "5e4e8e6b3813b23298b32919",
  title: "Test Post",
  content: "This is a test post",
  published: false
}

const mockedFindPostByIdResponse =
{
  _id: "5e4e8e6b3813b23298b32919",
  title: "Test Post",
  content: "This is a test post",
  published: false,
  author: {
    _id: "5e4e61a8dc4d7e6b9026c963",
    name: "sandeep6",
    mail: "s@123456678.com"
  }
}

const mockedPublishPostResponse =
{
  title: "Test Post",
  published: true
}

const mockedCommentResponse =
{
  _id: "5e4fa29275ce7e528086856a",
  message: "Test Message",
  author: {
    _id: "5e4e61a8dc4d7e6b9026c963",
    name: "sandeep6",
    mail: "s@123456678.com"
  }
}

const mockedCreateCommentResponse =
{
  _id: "5e4fa29275ce7e528086856a",
  message: "Test Message",
  author: {
    _id: "5e4e61a8dc4d7e6b9026c963",
    name: "sandeep6",
    mail: "s@123456678.com"
  }
}

const mockedDeleteCommentResponse =
{
  _id: "5e4fa29275ce7e528086856a",
  message: "Test Message"
}

const mockedDeletePostResponse =
{
  _id: "5e4e8e6b3813b23298b32919",
  title: "Test Post",
  content: "This is a test post",
  published: false
}


const SIGNUP = gql`
  mutation signUp($userInput: NewUserInput!) {
    signUp(userInput: $userInput) {
    _id
      name
      mail
  }
}
`;

const CREATE_POST = gql`
  mutation createPost($postInput: NewPostInput!) {
  createPost(postInput: $postInput) {
    _id
    title
    content
    published
  }
}
`;

const PUBLISH_POST = gql`
  mutation publishPost($postId: String!) {
    publishPost(postId: $postId) {
    title
    published
  }
}
`;

const FIND_POST_BY_ID = gql`
  query postById($id: String!) {
    postById(id: $id) {
      _id
    title
    published
  }
}
`;

const CREATE_COMMENT = gql`
  mutation createComment($message: String!, $postId: String!) {
    createComment(message: $message, postId: $postId) {
    _id
    message
  }
}
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(commentId: $commentId) {
    _id
    message
  }
}
`;

const DELETE_POST = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId) {
    _id
    title
    content
    published
  }
}
`;

describe('query', () => {
  it('post by id', async () => {
    const { server, container } = constructTestServer();
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.findPostById = jest.fn(() => mockedFindPostByIdResponse);
    const { query } = createTestClient(server);
    const res = await query({ query: FIND_POST_BY_ID, variables: { id: "5e4e8e6b3813b23298b32919" } });
    expect(res.data.postById._id).toBe("5e4e8e6b3813b23298b32919");
    expect(res.data.postById.title).toBe("Test Post");
  })

});

describe('mutations', () => {
  it('User signup', async () => {
    const { server, container } = constructTestServer();
    const userRepo = container.get(TYPES.UserRepository);
    userRepo.createUser = jest.fn(() => mockedSignupResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: SIGNUP, variables: { userInput: { name: "sandeep7", mail: "s@1234566789.com", password: "sandep" } } });
    expect(res.data.signUp._id).toBe("5e4e61a8dc4d7e6b9026c963");
  });

  it('create post', async () => {
    const { server, container } = constructTestServer(true);
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.createPost = jest.fn(() => mockedCreatePostResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: CREATE_POST, variables: { postInput: { title: "Test Post", content: "This is atest post", published: false } } });
    expect(res.data.createPost.title).toBe("Test Post");
  });

  it('Publish post', async () => {
    const { server, container } = constructTestServer(true);
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.publishPost = jest.fn(() => mockedPublishPostResponse);
    postRepo.findPostById = jest.fn(() => mockedFindPostByIdResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: PUBLISH_POST, variables: { postId: "5e4e8e6b3813b23298b32919" } });
    expect(res.data.publishPost.published).toBe(true);
  });

  it('Delete post', async () => {
    const { server, container } = constructTestServer(true);
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.deletePost = jest.fn(() => mockedDeletePostResponse);
    postRepo.findPostById = jest.fn(() => mockedFindPostByIdResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: DELETE_POST, variables: { postId: "5e4e8e6b3813b23298b32919" } });
    expect(res.data.deletePost._id).toBe("5e4e8e6b3813b23298b32919");
  });

  it('create comment', async () => {
    const { server, container } = constructTestServer(true);
    const commentRepo = container.get(TYPES.CommentRepository);
    commentRepo.addComment = jest.fn(() => mockedCreateCommentResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: CREATE_COMMENT, variables: { message: "Test Message", postId: "5e4e8e6b3813b23298b32919" } });
    expect(res.data.createComment.message).toBe("Test Message");
  });

  it('Delete comment', async () => {
    const { server, container } = constructTestServer(true);
    const commentRepo = container.get(TYPES.CommentRepository);
    commentRepo.deleteComment = jest.fn(() => mockedDeleteCommentResponse);
    commentRepo.findCommentById = jest.fn(() => mockedCommentResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: DELETE_COMMENT, variables: { commentId: "5e4fa29275ce7e528086856a" } });
    expect(res.data.deleteComment._id).toBe("5e4fa29275ce7e528086856a");
  });


});
