const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils')
const { PrismaClient } = require('@prisma/client')
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const prisma = new PrismaClient();

// the actual implementation of schema
const resolvers = {
  Query,
  Mutation,
  User,
  Link
}

// bundle the schema and resolvers and pass to ApolloServer
// typeDefs can be provided either directly as a string or by referencing a file that contains schema definition
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  // to access the 'request' obj
  context: ({ req }) => {
    // attach the instance to the context when initializing the server
    // then access it from inside the resolvers via the context argument (for resolvers to communicate)
    // attach the HTTP request that carries the incoming GraphQL query (or mutation) to the context
    // allow resolvers to read the Authorization header and validate user
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  }
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

/*
=> a new list with dummy data, when there's no database available
let links = [
   {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
   },
];
=> parent (input argument) is the result of previous resolver execution level, here can be omitted 
   Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
*/