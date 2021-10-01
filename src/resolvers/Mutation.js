const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // encrypt password
  const password = await bcrypt.hash(args.password, 10);

  // store new User in database
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // generate a JSON Web Token (jwt) that signed with APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // return an obj that adheres to the shape of AuthPayload obj from GraphQL schema
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // retrieve existing User by email address
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // compare provided passward with the one stored in database
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// args carries arguments (url, description) for the operation, not for the other resolvers
async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  })
  context.pubsub.publish("NEW_LINK", newLink)
  return newLink
}

async function vote(parent, args, context, info) {
  // validate the incoming JWT with the getUserId helper function
  const userId = context.userId;

  // check whether vote already existing
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // create a new Vote that connected to the User and the Link
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

/*
post: (parent, args, context, info) => {
=> generate unique IDs for Link elements, when there's no database available   
let idCount = links.length
=> create a link object, add it to links list and return the new link
const link = {
id: `link-${idCount++}`,
description: args.description,
url: args.url,
}
links.push(link)
return link
*/

module.exports = {
  signup,
  login,
  post,
  vote,
};
