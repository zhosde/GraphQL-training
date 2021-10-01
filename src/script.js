// import PrismaClient 
const { PrismaClient } = require("@prisma/client");

// instantiate PrismaClient
const prisma = new PrismaClient();

// an async function to send queries to database
async function main() {
  const newLink = await prisma.link.create({
      data: {
          description: 'Fullstack tutorial for GraphQL',
          url: 'www.howtographql.com'
      },
  })
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

// call the function
main()
  .catch((e) => {
    throw e;
  })
  // close the datasbase connections when script terminates
  .finally(async () => {
    await prisma.$disconnect();
  });
