import "reflect-metadata";
import { Container } from 'inversify';
import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import resolvers from './src/resolvers';
import typeDefs from './src/type-defs';
import {connect,set} from 'mongoose';
import { TYPES } from './src/Types';
import { DIModule } from './inversify.config';
import { IContextProvider } from "./src/context";

//Initialize DI container
const container = new Container();
container.load(DIModule);

//Initialize Apollo server
const server = new ApolloServer({
    context: ({ req }) => {
        let authToken = req.headers['authorization'];
        let contextP: IContextProvider = container.get<IContextProvider>(TYPES.ContextProvider);
        if (authToken) {
            authToken = authToken.split(' ')[1];
            contextP.setAuthToken(authToken);
        }
        return contextP;

    }, typeDefs, resolvers
});
const app = express();
server.applyMiddleware({ app });
app.listen({ port : process.env.SERVER_PORT}, () => {
    //Conet to Monogo db
    connect(process.env.DB_URL)
        .then(() => console.log('Connected to MongoDb'))
    set('debug', true);
    console.log(`:rocket: Server ready at http://localhost:4000${server.graphqlPath}`)
}
);