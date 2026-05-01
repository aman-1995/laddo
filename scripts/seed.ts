import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Earbuds",
        price: 299900,
        category: "Electronics",
        inventory: 50,
      },
      {
        name: "Leather Wallet",
        price: 89900,
        category: "Accessories",
        inventory: 100,
      },
      {
        name: "Running Shoes",
        price: 449900,
        category: "Footwear",
        inventory: 30,
      },
      {
        name: "Yoga Mat",
        price: 159900,
        category: "Fitness",
        inventory: 75,
      },
      {
        name: "Coffee Mug",
        price: 49900,
        category: "Kitchen",
        inventory: 200,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded 5 sample products.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
