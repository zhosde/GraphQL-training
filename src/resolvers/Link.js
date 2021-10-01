// resolver for postedBy in Link
function postedBy(parent, args, context) {
    // fetch the Link from database
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .postedBy();
}

function votes(parent, args, context) {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
}

module.exports = {
  postedBy,
  votes,
};
