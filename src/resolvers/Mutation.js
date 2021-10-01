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

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
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
};
