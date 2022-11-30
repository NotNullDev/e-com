import { faker } from "@faker-js/faker";
import type { Product, User } from "@prisma/client";
import { DealType, PrismaClient } from "@prisma/client";
import { getAllCategoriesAsString } from "../src/utils/enumParser";
("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("hi!");

  const initUser = {
    email: "admin@notnulldev.com",
    roles: ["ADMIN"],
    name: "NotNullDev",
  } as User;

  const insertedInitUser = await prisma.user.upsert({
    where: { email: initUser.email ?? "" },
    create: initUser,
    update: initUser,
  });

  console.log(`created user with id ${insertedInitUser.id}`);

  const products = [...Array(100)].map((idx) => {
    const id = faker.datatype.uuid();
    const title = faker.commerce.productName();
    const price = Number(faker.commerce.price(10, 1500, 2, ""));
    const description = faker.commerce.productDescription();
    const categories = faker.helpers.arrayElements([
      ...getAllCategoriesAsString().map((c) => c.replaceAll(" ", "_")),
    ]);
    const stock = faker.datatype.number({
      min: 1,
      max: 120,
    });
    const dealType = faker.helpers.arrayElement([
      ...Object.keys(DealType).filter((d) => isNaN(Number(d))),
    ]);
    const previewImageUrl = faker.image.abstract(undefined, undefined, true);
    const boughtCount = faker.datatype.bigInt({
      min: 0,
      max: 60000,
    });

    const shippingTime = faker.datatype.number({
      min: 0,
      max: 4,
    });

    const views = faker.datatype.bigInt({
      min: 0,
      max: 5000000,
    });

    const images = [...Array(10)].map(() =>
      faker.image.abstract(1920, 1080, true)
    );
    console.log("adding " + images.length + " images.");

    const product = {
      id,
      categories,
      dealType,
      description,
      previewImageUrl,
      price,
      stock,
      title,
      boughtCount,
      shippingTime,
      lastBoughtAt: new Date(),
      createdAt: new Date(),
      views,
      userId: insertedInitUser.id,
      images,
    } as Product;

    return product;
  });
  const createdProducts = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
  console.log(`created ${createdProducts.count} products.`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
