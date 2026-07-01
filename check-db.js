const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== NEWS ===");
  const news = await prisma.news.findMany();
  console.log(JSON.stringify(news, null, 2));

  console.log("=== STUDY ARTICLES ===");
  const studies = await prisma.studyArticle.findMany();
  console.log(JSON.stringify(studies, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
