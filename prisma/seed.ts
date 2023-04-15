import { prisma } from "~/server/db";

async function main() {
  const sessionToken = "a961d605-c8fe-4dc9-a8d9-da0f81957053";

  await prisma.user.upsert({
    where: {
      email: "account@e2e.net",
    },
    create: {
      name: "E2E Account",
      email: "account@e2e.net",
      sessions: {
        create: {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          sessionToken,
        },
      },
      accounts: {
        create: {
          type: "oauth",
          provider: "github",
          providerAccountId: "2222222",
          access_token: "ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt",
          token_type: "bearer",
          scope: "read:org,read:user,repo,user:email",
        },
      },
    },
    update: {},
  });
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
