import { faker } from "@faker-js/faker";
import {
  category,
  dealType,
  product,
  ProductNew,
  user,
  UserNew,
} from "../common/db/schema";
import { db, queryClient } from "../src/db/db";

async function main() {
  await db.transaction(async (tx) => {
    const u = await tx.query.user.findFirst();

    if (u) {
      console.log("There is a user in database, seeding skipped...");
      return;
    }

    const initUser: UserNew = {
      email: "admin@notnulldev.com",
      name: "NotNullDev",
      image: "",
    };

    const insertedInitUser = await tx.insert(user).values(initUser);

    const dummyUsers: UserNew[] = [...Array(5)].map((idx) => {
      const userEmail = faker.internet.email();
      const userName = faker.name.fullName();

      const userToBeCreated: UserNew = {
        email: userEmail,
        name: userName,
      };

      return userToBeCreated;
    });

    const createdUsers = await tx
      .insert(user)
      .values(dummyUsers)
      .onConflictDoUpdate({
        target: user.email,
        set: user,
      })
      .returning({ id: user.id });

    const createdUsersIds = createdUsers.map((u) => u.id);

    console.log(`created users with ids ${createdUsersIds.join(",")}`);

    // const productsAmount = 200_000;
    const productsAmount = 65534; // max amount for one query

    console.log(
      `Creating ${productsAmount} fake products. It may take a while...`
    );

    for (let i = 0; i < productsAmount; i++) {
      const id = faker.datatype.uuid();
      const title = faker.commerce.productName();
      const price = Number(faker.commerce.price(10, 1500, 2, ""));
      const description = faker.commerce.productDescription();
      const categories = faker.helpers.arrayElements(category.enumValues);
      const stock = faker.datatype.number({
        min: 1,
        max: 120,
      });
      const selectedDealType = faker.helpers.arrayElement(dealType.enumValues);
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

      const rating = faker.datatype.number({
        min: 1,
        max: 5,
      });

      // get random user from created users
      const randomUserId = faker.helpers.arrayElement(createdUsersIds);

      const productToBeCreated: ProductNew = {
        id,
        categories,
        dealType: selectedDealType,
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
        userId: randomUserId,
        images,
        rating,
      };

      await tx.insert(product).values(productToBeCreated).onConflictDoNothing();
    }

    console.log(`created ${productsAmount} products.`);
  });
}

main().finally(() => {
  queryClient.end();
});
