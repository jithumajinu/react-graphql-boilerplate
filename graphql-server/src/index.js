import express from "express";
import { ApolloServer, gql } from "apollo-server-express"
import cors from "cors";
import resolvers from "./services/task";
import dotenv  from "dotenv";

dotenv.config();
const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    createTodo(text: String!):String
    removeTodo(id: String!):String
    updateTodo(id: String!):String
  }
`;

const server = new ApolloServer({
  typeDefs,
  subscriptions: false,
  resolvers
});

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: process.env.PORT }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);