import { auth } from "@/lib/auth";

async function seed() {
  const data = await auth.api.signUpEmail({
    body: {
      email: "admin@admin.com",
      name: "Master User",
      password: "123123123",
      username: "admin",
      displayUsername: "Admin",
    },
  });
  process.exit(0);
}

seed();
