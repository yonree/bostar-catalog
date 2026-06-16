import { PrismaClient } from '@prisma/client';
import {
  articleCategories,
  articles,
  downloads,
  faqs,
  productCategories,
  products,
  siteSeed,
  solutions,
  videos,
} from './seed-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.brandSetting.upsert({
    where: { id: 'brand-setting' },
    update: siteSeed,
    create: { id: 'brand-setting', ...siteSeed },
  });

  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const category of articleCategories) {
    await prisma.articleCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.productCategory.findUniqueOrThrow({
      where: { slug: product.categorySlug },
    });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product.data, categoryId: category.id },
      create: { ...product.data, categoryId: category.id },
    });
  }

  for (const article of articles) {
    const category = await prisma.articleCategory.findUniqueOrThrow({
      where: { slug: article.categorySlug },
    });
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { ...article.data, categoryId: category.id },
      create: { ...article.data, categoryId: category.id },
    });
  }

  await prisma.fAQ.deleteMany();
  await prisma.fAQ.createMany({ data: faqs });

  for (const solution of solutions) {
    await prisma.solution.upsert({
      where: { slug: solution.slug },
      update: solution,
      create: solution,
    });
  }

  for (const download of downloads) {
    await prisma.download.upsert({
      where: { slug: download.slug },
      update: download,
      create: download,
    });
  }

  for (const video of videos) {
    await prisma.video.upsert({ where: { slug: video.slug }, update: video, create: video });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
