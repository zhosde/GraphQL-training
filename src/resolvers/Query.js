// access the prisma object via 'context' argument, allow to access database through Prisma Client API
async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {}; // if no filter string provided then empty obj

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = await context.prisma.link.count({ where })

  return {
      links,
      count,
  };
}

module.exports = {
  feed,
};
