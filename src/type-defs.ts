import { gql } from 'apollo-server';

export default gql`

type User{
    _id: String!,
    name: String!,
    mail: String!,
    password: String!
}

type AuthPayload{
    user: User,
    token: String   
}

type Post {
    _id: String!,
    title: String!,
    content: String!,
    author: User!,
    published: Boolean
}

type Comment {
    _id: String,
    message: String!,
    author: User!,
    post: [Post]
}

type Query{
    getPostById(id: String!): Post,
    getPostByAuthor(author: String!): Post,
    comments(post: String!): Comment

}

type Mutation{
createUser(userInput: NewUserInput!): User,
createPost(postInput: NewPostInput!): Post,
publishPost(postId: String!): Post,
createComment(message: String!, postId: String!): Comment
login(mail: String!, password: String!): AuthPayload
}

input NewUserInput{
    name: String!,
    mail: String!,
    password: String!
}

input NewPostInput{
    title: String!,
    content: String!,
    published: Boolean
}

`;