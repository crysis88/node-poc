import "reflect-metadata";
import { Container } from 'inversify';
import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import resolvers from './src/resolvers';
import typeDefs from './src/type-defs';
import { connect, set } from 'mongoose';
import { TYPES } from './src/Types';
import { DIModule } from './inversify.config';
import { IContextProvider } from "./src/context";
import { errorDetails } from "./src/ErrorList";

//Initialize DI container
const container = new Container();
container.load(DIModule);

//Initialize Apollo server
const server = new ApolloServer({
    context: ({ req }) => {
        let authToken = req.headers[process.env.AUTH_HEADER];
        let contextP: IContextProvider = container.get<IContextProvider>(TYPES.ContextProvider);
        if (authToken) {
            authToken = authToken.split(' ')[1];
            contextP.setAuthToken(authToken);
        }
        return contextP;
    }, typeDefs, resolvers, formatError: (err) => {
        const message: string = errorDetails[err.message] ? errorDetails[err.message].message : err.message;
        const statusCode: string = errorDetails[err.message]? errorDetails[err.message].statusCode: 400;
        return ({ message, statusCode });
    }
});
const app = express();
server.applyMiddleware({ app });
app.listen({ port: process.env.SERVER_PORT }, () => {
    //Connect to Monogo db
    connect(process.env.DB_URL, { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDb'))
    set('debug', process.env.MONGOOSE_DEBUG);
    console.log(`:rocket: Server ready at http://localhost:4000${server.graphqlPath}`)
}
);