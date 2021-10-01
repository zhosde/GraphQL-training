const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

// => a new list with dummy data, when there's no database available
// let links = [
//   {
//     id: "link-0",
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
// ];

// the actual implementation of schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // access the prisma object via 'context' argument, allow to access database through Prisma Client API
    feed: async (parent, args, context) => {
        return context.prisma.link.findMany()
    },
  },
  Mutation: {
    // args carries arguments (url, description) for the operation, not for 'feed' & 'info' resolvers
    post: (parent, args, context, info) => {
    // => generate unique IDs for Link elements, when there's no database available   
    // let idCount = links.length
    // => create a link object, add it to links list and return the new link
    //    const link = {
    //     id: `link-${idCount++}`,
    //     description: args.description,
    //     url: args.url,
    //   }
    //   links.push(link)
    //   return link
        const newLink = context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description,
            },
        })
        return newLink
    },
    },
}

// => parent (input argument) is the result of previous resolver execution level, here can be omitted 
//   Link: {
//     id: (parent) => parent.id,
//     description: (parent) => parent.description,
//     url: (parent) => parent.url,

// bundle the schema and resolvers and pass to ApolloServer
// typeDefs can be provided either directly as a string or by referencing a file that contains schema definition
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    // attach the instance to the context when initializing the server
    // then access it from inside the resolvers via the context argument (for resolvers to communicate)
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
