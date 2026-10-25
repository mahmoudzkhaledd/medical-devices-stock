import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redis } from "./redis";
import { redisStorage } from "@better-auth/redis-storage";

import { username } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

import prisma from "@/prisma";

const ac = createAccessControl(defaultStatements);
const superAdmin = ac.newRole({
  session: adminAc.statements.session,
  user: ["impersonate-admins", ...adminAc.statements.user],
});

export const auth = betterAuth({
  appName: "MedTrack",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    username({
      minUsernameLength: 5,
    }),
    admin({
      defaultRole: "USER",
      roles: {
        ADMIN: superAdmin,
      },
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 100,
  },

  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "better-auth:",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "USER",
      },
    },
  },
});

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session;
  } catch (ex) {
    return null;
  }
};
