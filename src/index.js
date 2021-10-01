const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');

// a new list with dummy data 
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// the actual implementation of schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // args carries arguments (url, description) for the operation, not for 'feed' & 'info' resolvers
    post: (parent, args) => {
    // generate unique IDs for Link elements      
    let idCount = links.length
    // create a link object, add it to links list and return the new link
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    }
    },
}

// parent (input argument) is the result of previous resolver execution level, here can be omitted 
//   Link: {
//     id: (parent) => parent.id,
//     description: (parent) => parent.description,
//     url: (parent) => parent.url,

// bundle the schema and resolvers and pass to ApolloServer
// typeDefs can be provided either directly as a string or by referencing a file that contains schema definition
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
