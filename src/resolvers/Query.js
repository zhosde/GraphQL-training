// access the prisma object via 'context' argument, allow to access database through Prisma Client API
function feed(parent, args, context, info) {
  return context.prisma.link.findMany();
}

module.exports = {
  feed,
};
