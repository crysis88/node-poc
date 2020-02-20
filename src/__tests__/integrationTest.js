import "reflect-metadata";
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import nock from 'nock';
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
        ctx.getCurrentUser = jest.fn(() => { return { _id: 'abc' } });
      }
      return ctx
    },
    typeDefs,
    resolvers,
  });
  return { server, container };
};

// the mocked REST API data


const mockedCreateUserResponse =
{
  _id: "5e4e61a8dc4d7e6b9026c963",
  name: "sandeep6",
  mail: "s@123456678.com"
}

const mockedCreatePostResponse =
{
  _id: "5e4e8e6b3813b23298b32919",
  title: "Test Post",
  content: "This is atest post",
  published: false
}

const mockedPublishPostResponse =
{
  title: "Test Post",
  published: false
}



const CREATE_USER = gql`
  mutation createUser($userInput: NewUserInput!) {
  createUser(userInput: $userInput) {
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

describe('mutations', () => {
  it('create user', async () => {
    const { server, container } = constructTestServer();
    const userRepo = container.get(TYPES.UserRepository);
    userRepo.createUser = jest.fn(() => mockedCreateUserResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: CREATE_USER, variables: { userInput: { name: "sandeep7", mail: "s@1234566789.com", password: "sandep" } } });
    expect(res).toMatchSnapshot();
  });

  it('create post', async () => {
    const { server, container } = constructTestServer(true);
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.createPost = jest.fn(() => mockedCreatePostResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: CREATE_POST, variables: { postInput: { title: "Test Post", content: "This is atest post", published: false } } });
    expect(res).toMatchSnapshot();
  });

  it('Publish post', async () => {
    const { server, container } = constructTestServer(true);
    const postRepo = container.get(TYPES.PostRepository);
    postRepo.publishPost = jest.fn(() => mockedPublishPostResponse);
    const { mutate } = createTestClient(server);
    const res = await mutate({ mutation: PUBLISH_POST, variables: { postId: "5e4e8e6b3813b23298b32919" } });
    expect(res).toMatchSnapshot();
  });

});
