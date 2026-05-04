import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── helpers ────────────────────────────────────────────────────────────────

function paise(rupees: number) {
  return Math.round(rupees * 100);
}

interface VariantInput {
  name: string;
  sku: string;
  price: number; // rupees
  mrp: number; // rupees
  weight: number; // grams
}

interface ReviewInput {
  userId: string;
  rating: number;
  title: string;
  body: string;
}

interface ProductInput {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  vendorId: string;
  image: string;
  caloriesPer100g: number;
  variants: VariantInput[];
  reviews: ReviewInput[];
}

async function createProduct(data: ProductInput) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      categoryId: data.categoryId,
      vendorId: data.vendorId,
      images: {
        create: {
          url: data.image,
          altText: data.name,
          isPrimary: true,
          sortOrder: 0,
        },
      },
    },
  });

  for (const v of data.variants) {
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: v.name,
        sku: v.sku,
        price: paise(v.price),
        mrp: paise(v.mrp),
        weight: v.weight,
        attributes: {
          create: [{ key: "calories_per_100g", value: String(data.caloriesPer100g) }],
        },
        inventory: {
          create: {
            quantity: 60,
            reserved: 0,
            lowStockThreshold: 5,
            status: "IN_STOCK",
            vendorId: data.vendorId,
          },
        },
      },
    });
  }

  for (const r of data.reviews) {
    await prisma.productReview.create({
      data: {
        productId: product.id,
        userId: r.userId,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isVerifiedPurchase: true,
      },
    });
  }

  return product;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🗑  Clearing existing data...");

  await prisma.inventoryLog.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.vendorReview.deleteMany();
  await prisma.variantAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.account.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // ── Categories ──────────────────────────────────────────────────────────

  console.log("📁 Seeding categories...");

  const [
    catLaddos,
    catBarfi,
    catHalwa,
    catPedha,
    catModak,
    catChikki,
    catCashew,
    catSugarFree,
  ] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Laddos",
        slug: "laddos",
        description: "Round, ghee-roasted sweets made from besan, rava, or motichur",
        image: "https://picsum.photos/seed/laddos11/600/400",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Barfi",
        slug: "barfi",
        description: "Dense milk-based fudge cut into diamond or square shapes",
        image: "https://picsum.photos/seed/barfi22/600/400",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "Halwa",
        slug: "halwa",
        description: "Slow-cooked, aromatic confections from lentils, semolina or vegetables",
        image: "https://picsum.photos/seed/halwa33/600/400",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "Pedha",
        slug: "pedha",
        description: "Soft milk-solid discs flavoured with cardamom and saffron",
        image: "https://picsum.photos/seed/pedha44/600/400",
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "Modak",
        slug: "modak",
        description: "Lord Ganesha's favourite — steamed rice-flour dumplings with sweet coconut filling",
        image: "https://picsum.photos/seed/modak55/600/400",
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "Chikki",
        slug: "chikki",
        description: "Crispy, nutty brittle made from peanuts or mixed nuts and jaggery",
        image: "https://picsum.photos/seed/chikki66/600/400",
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: "Cashew Delights",
        slug: "cashew-delights",
        description: "Premium kaju-based sweets — the go-to gifting choice for celebrations",
        image: "https://picsum.photos/seed/cashew77/600/400",
        sortOrder: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: "Sugar-Free",
        slug: "sugar-free",
        description: "Guilt-free sweets sweetened with stevia or dates — all the flavour, less sugar",
        image: "https://picsum.photos/seed/sugarfree88/600/400",
        sortOrder: 8,
      },
    }),
  ]);

  // ── Vendors ──────────────────────────────────────────────────────────────

  console.log("🏪 Seeding vendors...");

  const [vendorUser1, vendorUser2, vendorUser3] = await Promise.all([
    prisma.user.create({
      data: { email: "priya@mithaibypriya.com", name: "Priya Sharma", role: "VENDOR" },
    }),
    prisma.user.create({
      data: { email: "ramesh@ramsweets.com", name: "Ramesh Agarwal", role: "VENDOR" },
    }),
    prisma.user.create({
      data: { email: "gokul@gokulsweets.com", name: "Gokul Patel", role: "VENDOR" },
    }),
  ]);

  const [vendor1, vendor2, vendor3] = await Promise.all([
    prisma.vendor.create({
      data: {
        userId: vendorUser1.id,
        shopName: "Mithai by Priya",
        description: "Handcrafted traditional sweets straight from Rajasthan kitchens",
        status: "APPROVED",
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUser2.id,
        shopName: "Ram Sweets",
        description: "Serving authentic North-Indian mithai since 1978",
        status: "APPROVED",
      },
    }),
    prisma.vendor.create({
      data: {
        userId: vendorUser3.id,
        shopName: "Gokul Mithai House",
        description: "Gujarat's finest mithai makers — loved for kaju katli and modak",
        status: "APPROVED",
      },
    }),
  ]);

  // ── Review customers ─────────────────────────────────────────────────────

  console.log("👥 Seeding customers...");

  const [c1, c2, c3, c4, c5] = await Promise.all([
    prisma.user.create({ data: { email: "ravi.kumar@example.com", name: "Ravi Kumar", role: "CUSTOMER" } }),
    prisma.user.create({ data: { email: "sunita.verma@example.com", name: "Sunita Verma", role: "CUSTOMER" } }),
    prisma.user.create({ data: { email: "ankit.joshi@example.com", name: "Ankit Joshi", role: "CUSTOMER" } }),
    prisma.user.create({ data: { email: "meena.pillai@example.com", name: "Meena Pillai", role: "CUSTOMER" } }),
    prisma.user.create({ data: { email: "deepak.shah@example.com", name: "Deepak Shah", role: "CUSTOMER" } }),
  ]);

  // ── Products ─────────────────────────────────────────────────────────────

  console.log("🍬 Seeding products...");

  // — Laddos —

  await createProduct({
    name: "Besan Ladoo",
    slug: "besan-ladoo",
    description:
      "Classic chickpea-flour ladoos slow-roasted in pure desi ghee with green cardamom and slivered cashews. Made fresh every morning.",
    categoryId: catLaddos.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/besanladoo/400/400",
    caloriesPer100g: 452,
    variants: [
      { name: "250g Box", sku: "BL-250", price: 199, mrp: 220, weight: 250 },
      { name: "500g Box", sku: "BL-500", price: 379, mrp: 420, weight: 500 },
      { name: "1kg Box", sku: "BL-1000", price: 729, mrp: 800, weight: 1000 },
    ],
    reviews: [
      { userId: c1.id, rating: 5, title: "Exactly like Nani's recipe!", body: "These taste just like homemade — the ghee is fragrant and the ladoos melt in your mouth." },
      { userId: c2.id, rating: 4, title: "Great quality", body: "Arrived fresh, packaging was good. Will order again for Diwali." },
      { userId: c3.id, rating: 5, title: "Best besan ladoo online", body: "Ordered 3 times now. Consistent quality every time." },
    ],
  });

  await createProduct({
    name: "Motichur Ladoo",
    slug: "motichur-ladoo",
    description:
      "Tiny saffron-hued boondi pearls bound together with sugar syrup, garnished with pistachios. The quintessential celebration sweet.",
    categoryId: catLaddos.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/motichurladoo/400/400",
    caloriesPer100g: 391,
    variants: [
      { name: "250g Box", sku: "ML-250", price: 220, mrp: 250, weight: 250 },
      { name: "500g Box", sku: "ML-500", price: 420, mrp: 470, weight: 500 },
      { name: "1kg Box", sku: "ML-1000", price: 799, mrp: 890, weight: 1000 },
    ],
    reviews: [
      { userId: c1.id, rating: 4, title: "Soft and fresh", body: "Good motichur. Not too sweet — just right." },
      { userId: c4.id, rating: 5, title: "Wedding quality!", body: "Ordered for my brother's wedding. Guests loved them." },
    ],
  });

  await createProduct({
    name: "Til Ladoo",
    slug: "til-ladoo",
    description:
      "Toasted sesame seeds and jaggery pressed into golden ladoos — a Makar Sankranti staple packed with iron and energy.",
    categoryId: catLaddos.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/tilladoo/400/400",
    caloriesPer100g: 481,
    variants: [
      { name: "250g Box", sku: "TL-250", price: 175, mrp: 200, weight: 250 },
      { name: "500g Box", sku: "TL-500", price: 339, mrp: 380, weight: 500 },
    ],
    reviews: [
      { userId: c2.id, rating: 5, title: "Earthy and authentic", body: "Love the jaggery flavour — not overly sweet. Perfect with chai." },
      { userId: c5.id, rating: 4, title: "Good for winter", body: "Bought for Sankranti. Traditional taste, well packaged." },
    ],
  });

  await createProduct({
    name: "Rava Ladoo",
    slug: "rava-ladoo",
    description:
      "Semolina roasted in ghee with coconut flakes, cardamom, and raisins — a South-Indian classic that's light yet satisfying.",
    categoryId: catLaddos.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/ravaladoo/400/400",
    caloriesPer100g: 412,
    variants: [
      { name: "250g Box", sku: "RL-250", price: 165, mrp: 185, weight: 250 },
      { name: "500g Box", sku: "RL-500", price: 315, mrp: 355, weight: 500 },
    ],
    reviews: [
      { userId: c3.id, rating: 4, title: "Light and delicious", body: "Not as heavy as besan ladoo but just as tasty. The coconut adds great texture." },
      { userId: c1.id, rating: 5, title: "My favourite!", body: "Addictive! The ghee aroma is lovely." },
    ],
  });

  // — Barfi —

  await createProduct({
    name: "Kaju Barfi",
    slug: "kaju-barfi",
    description:
      "Smooth cashew paste cooked with sugar to a perfect fudge consistency, draped in edible silver vark. A timeless classic.",
    categoryId: catBarfi.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/kajubarfi/400/400",
    caloriesPer100g: 476,
    variants: [
      { name: "250g Box", sku: "KB-250", price: 349, mrp: 390, weight: 250 },
      { name: "500g Box", sku: "KB-500", price: 679, mrp: 750, weight: 500 },
    ],
    reviews: [
      { userId: c4.id, rating: 5, title: "Premium quality!", body: "The vark is real and the kaju is very fresh. Rich taste." },
      { userId: c5.id, rating: 4, title: "Gift-worthy", body: "Bought as a Diwali gift. Beautifully packed and delicious." },
      { userId: c2.id, rating: 5, title: "Best kaju barfi", body: "Melts in the mouth. No sugar crystals — very smooth." },
    ],
  });

  await createProduct({
    name: "Coconut Barfi",
    slug: "coconut-barfi",
    description:
      "Fresh grated coconut slow-cooked with sugar and milk solids, laced with cardamom — a simple, fragrant barfi from coastal kitchens.",
    categoryId: catBarfi.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/coconutbarfi/400/400",
    caloriesPer100g: 395,
    variants: [
      { name: "250g Box", sku: "CB-250", price: 219, mrp: 245, weight: 250 },
      { name: "500g Box", sku: "CB-500", price: 419, mrp: 469, weight: 500 },
    ],
    reviews: [
      { userId: c1.id, rating: 4, title: "Fresh coconut flavour", body: "Love how you can taste the real coconut. Not overly sweet." },
      { userId: c3.id, rating: 4, title: "Nicely done", body: "Good texture — firm but not crumbly." },
    ],
  });

  await createProduct({
    name: "Chocolate Barfi",
    slug: "chocolate-barfi",
    description:
      "Belgian dark chocolate swirled into classic khoya barfi for a modern twist on a traditional favourite. Kids go crazy for these.",
    categoryId: catBarfi.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/chocolatebarfi/400/400",
    caloriesPer100g: 421,
    variants: [
      { name: "200g Box", sku: "CHB-200", price: 269, mrp: 299, weight: 200 },
      { name: "400g Box", sku: "CHB-400", price: 519, mrp: 579, weight: 400 },
    ],
    reviews: [
      { userId: c2.id, rating: 5, title: "Brilliant fusion!", body: "Kids loved it. The Belgian chocolate really elevates the barfi." },
      { userId: c4.id, rating: 4, title: "Unusual but tasty", body: "Not traditional but very good. Perfect for gifting to younger folks." },
    ],
  });

  // — Halwa —

  await createProduct({
    name: "Gajar Ka Halwa",
    slug: "gajar-ka-halwa",
    description:
      "Winter red carrots slow-cooked in whole milk, ghee and sugar with khoya and nuts — the king of Indian winter desserts.",
    categoryId: catHalwa.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/gajarhalwa/400/400",
    caloriesPer100g: 328,
    variants: [
      { name: "250g Pack", sku: "GH-250", price: 189, mrp: 215, weight: 250 },
      { name: "500g Pack", sku: "GH-500", price: 359, mrp: 410, weight: 500 },
    ],
    reviews: [
      { userId: c5.id, rating: 5, title: "Exactly like my mother made", body: "The colour is deep red — made with real Delhi carrots. Rich and fragrant." },
      { userId: c1.id, rating: 5, title: "Best halwa I've had!", body: "Generous with the dry fruits. I could eat this every day." },
      { userId: c3.id, rating: 4, title: "Very authentic", body: "Arrived warm and fresh. Packaging keeps it at the right temperature." },
    ],
  });

  await createProduct({
    name: "Moong Dal Halwa",
    slug: "moong-dal-halwa",
    description:
      "Split yellow lentils slow-roasted for hours in ghee until golden, then cooked with sugar and milk — rich, dense, and deeply satisfying.",
    categoryId: catHalwa.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/moongdalhalwa/400/400",
    caloriesPer100g: 362,
    variants: [
      { name: "250g Pack", sku: "MDH-250", price: 209, mrp: 235, weight: 250 },
      { name: "500g Pack", sku: "MDH-500", price: 399, mrp: 449, weight: 500 },
    ],
    reviews: [
      { userId: c2.id, rating: 4, title: "Labour of love", body: "You can tell this halwa has been made with patience. The ghee smell is wonderful." },
      { userId: c4.id, rating: 5, title: "Royal taste", body: "This is proper Rajasthani moong dal halwa. Worth every rupee." },
    ],
  });

  // — Pedha —

  await createProduct({
    name: "Mathura Pedha",
    slug: "mathura-pedha",
    description:
      "Authentic Mathura-style pedha made from khoya with a hint of cardamom and a characteristic golden-brown crust from the slow-cooking process.",
    categoryId: catPedha.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/mathpedha/400/400",
    caloriesPer100g: 357,
    variants: [
      { name: "250g Box", sku: "MP-250", price: 229, mrp: 260, weight: 250 },
      { name: "500g Box", sku: "MP-500", price: 439, mrp: 499, weight: 500 },
    ],
    reviews: [
      { userId: c3.id, rating: 5, title: "Reminds me of Mathura!", body: "This is as close as it gets without travelling there. Authentic caramelised notes." },
      { userId: c5.id, rating: 4, title: "Good pedha", body: "Slightly crumbly, which is how it should be. Nice flavour." },
    ],
  });

  await createProduct({
    name: "Kesar Pedha",
    slug: "kesar-pedha",
    description:
      "Milk-solid pedha infused with pure Kashmiri saffron and garnished with pistachios. The golden colour comes only from real kesar — no food colouring.",
    categoryId: catPedha.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/kesarpedha/400/400",
    caloriesPer100g: 371,
    variants: [
      { name: "250g Box", sku: "KP-250", price: 279, mrp: 315, weight: 250 },
      { name: "500g Box", sku: "KP-500", price: 539, mrp: 610, weight: 500 },
    ],
    reviews: [
      { userId: c1.id, rating: 5, title: "Gorgeous saffron colour!", body: "The kesar fragrance hits you when you open the box. Beautiful and delicious." },
      { userId: c2.id, rating: 4, title: "Premium feel", body: "Rich flavour. The pistachios on top are a nice touch." },
      { userId: c4.id, rating: 5, title: "Gift-worthy", body: "Sent these to relatives in the US. They were thrilled!" },
    ],
  });

  // — Modak —

  await createProduct({
    name: "Ukadiche Modak",
    slug: "ukadiche-modak",
    description:
      "Traditional Maharashtrian steamed modak — delicate rice-flour shell with a warm coconut-jaggery-cardamom filling. Ganesh Chaturthi's most beloved offering.",
    categoryId: catModak.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/ukmodak/400/400",
    caloriesPer100g: 243,
    variants: [
      { name: "6-piece Box", sku: "UM-6", price: 149, mrp: 169, weight: 180 },
      { name: "12-piece Box", sku: "UM-12", price: 279, mrp: 319, weight: 360 },
    ],
    reviews: [
      { userId: c3.id, rating: 5, title: "Authentic Maharashtrian modak", body: "The rice-flour shell is perfectly thin and the filling has real fresh coconut. Excellent." },
      { userId: c5.id, rating: 4, title: "Fresh and tasty", body: "Arrived while still warm. Beautiful pleated shape." },
    ],
  });

  await createProduct({
    name: "Chocolate Modak",
    slug: "chocolate-modak",
    description:
      "Boondi Ladoo's cooler cousin — dark chocolate ganache filling inside a cocoa-dusted rice-flour shell. A festive fusion favourite.",
    categoryId: catModak.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/chocmodak/400/400",
    caloriesPer100g: 317,
    variants: [
      { name: "6-piece Box", sku: "CHM-6", price: 199, mrp: 229, weight: 180 },
      { name: "12-piece Box", sku: "CHM-12", price: 379, mrp: 429, weight: 360 },
    ],
    reviews: [
      { userId: c1.id, rating: 4, title: "Kids favourite!", body: "My children don't usually eat traditional sweets but they loved these. Good innovation." },
      { userId: c2.id, rating: 4, title: "Fun twist", body: "Creative and tasty. The dark chocolate isn't too bitter." },
    ],
  });

  // — Chikki —

  await createProduct({
    name: "Peanut Chikki",
    slug: "peanut-chikki",
    description:
      "Roasted peanuts bound together with pure jaggery — a crispy, caramel-like brittle that's the original Indian energy bar.",
    categoryId: catChikki.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/peanutchikki/400/400",
    caloriesPer100g: 488,
    variants: [
      { name: "200g Pack", sku: "PC-200", price: 99, mrp: 119, weight: 200 },
      { name: "500g Pack", sku: "PC-500", price: 229, mrp: 269, weight: 500 },
    ],
    reviews: [
      { userId: c4.id, rating: 5, title: "Old-school goodness", body: "Exactly what chikki should taste like. Crunchy and not too sweet." },
      { userId: c3.id, rating: 4, title: "Great snack", body: "Good with chai. Peanuts are well roasted." },
    ],
  });

  await createProduct({
    name: "Mixed Nuts Chikki",
    slug: "mixed-nuts-chikki",
    description:
      "A premium blend of cashews, almonds, and pistachios set in dark jaggery brittle — a festive upgrade on the classic chikki.",
    categoryId: catChikki.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/mixednutchikki/400/400",
    caloriesPer100g: 512,
    variants: [
      { name: "200g Pack", sku: "MNC-200", price: 199, mrp: 229, weight: 200 },
      { name: "400g Pack", sku: "MNC-400", price: 379, mrp: 429, weight: 400 },
    ],
    reviews: [
      { userId: c5.id, rating: 5, title: "Luxury chikki!", body: "The mix of cashews and pistachios makes this feel really premium. Great gifting option." },
      { userId: c1.id, rating: 4, title: "Worth the price", body: "More expensive than peanut chikki but the quality shows." },
    ],
  });

  // — Cashew Delights —

  await createProduct({
    name: "Kaju Katli",
    slug: "kaju-katli",
    description:
      "Thin, melt-in-mouth diamond-shaped cashew fudge — the undisputed king of mithai for festivals and gifting across India.",
    categoryId: catCashew.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/kajukatli/400/400",
    caloriesPer100g: 489,
    variants: [
      { name: "250g Box", sku: "KK-250", price: 399, mrp: 449, weight: 250 },
      { name: "500g Box", sku: "KK-500", price: 779, mrp: 869, weight: 500 },
      { name: "1kg Box", sku: "KK-1000", price: 1499, mrp: 1699, weight: 1000 },
    ],
    reviews: [
      { userId: c2.id, rating: 5, title: "Paper-thin and perfect", body: "These are made with real kaju. You can feel it in the price and the taste." },
      { userId: c4.id, rating: 5, title: "Festival staple", body: "Order every Diwali without fail. Never disappoints." },
      { userId: c5.id, rating: 4, title: "Excellent quality", body: "The silver vark is real. Very premium packaging." },
    ],
  });

  await createProduct({
    name: "Kaju Roll",
    slug: "kaju-roll",
    description:
      "Cashew fudge rolled around a pistachio-rose filling — a bi-coloured, aromatic sweet that looks as stunning as it tastes.",
    categoryId: catCashew.id,
    vendorId: vendor2.id,
    image: "https://picsum.photos/seed/kajuroll/400/400",
    caloriesPer100g: 471,
    variants: [
      { name: "250g Box", sku: "KR-250", price: 369, mrp: 419, weight: 250 },
      { name: "500g Box", sku: "KR-500", price: 719, mrp: 809, weight: 500 },
    ],
    reviews: [
      { userId: c3.id, rating: 5, title: "Beautiful and tasty", body: "The green and white contrast is gorgeous. The rose filling is subtle and fragrant." },
      { userId: c1.id, rating: 4, title: "Eye-catching gift", body: "Everyone asks where I bought these from. Impressive presentation." },
    ],
  });

  // — Sugar-Free —

  await createProduct({
    name: "Sugar-Free Besan Ladoo",
    slug: "sugar-free-besan-ladoo",
    description:
      "All the ghee-roasted chickpea-flour goodness of classic besan ladoos but sweetened with stevia — perfect for diabetics and fitness enthusiasts.",
    categoryId: catSugarFree.id,
    vendorId: vendor3.id,
    image: "https://picsum.photos/seed/sfbesanladoo/400/400",
    caloriesPer100g: 318,
    variants: [
      { name: "250g Box", sku: "SFBL-250", price: 239, mrp: 269, weight: 250 },
      { name: "500g Box", sku: "SFBL-500", price: 459, mrp: 519, weight: 500 },
    ],
    reviews: [
      { userId: c4.id, rating: 4, title: "Great for diabetics", body: "My father is diabetic and he can finally enjoy ladoos. Tastes surprisingly good." },
      { userId: c2.id, rating: 4, title: "Healthier option", body: "Not identical to the original but very close. Good quality stevia." },
    ],
  });

  await createProduct({
    name: "Sugar-Free Kaju Barfi",
    slug: "sugar-free-kaju-barfi",
    description:
      "Premium cashew barfi sweetened with erythritol — same creamy texture and rich cashew flavour with significantly fewer calories.",
    categoryId: catSugarFree.id,
    vendorId: vendor1.id,
    image: "https://picsum.photos/seed/sfkajubarfi/400/400",
    caloriesPer100g: 341,
    variants: [
      { name: "250g Box", sku: "SFKB-250", price: 419, mrp: 469, weight: 250 },
      { name: "500g Box", sku: "SFKB-500", price: 809, mrp: 909, weight: 500 },
    ],
    reviews: [
      { userId: c5.id, rating: 5, title: "Healthy luxury!", body: "Gifted this to a health-conscious friend. She loved it and asked where to buy more." },
      { userId: c3.id, rating: 4, title: "Impressive", body: "You really can't tell it's sugar-free. Excellent cashew quality." },
    ],
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
