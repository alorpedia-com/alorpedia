import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImage,
          village: user.village,
          ageGrade: user.ageGrade,
          onboardingCompleted: user.onboardingCompleted,
          onboardingStep: user.onboardingStep,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user with Google OAuth
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              profileImage: user.image,
              provider: "google",
              onboardingCompleted: false,
              onboardingStep: 2, // Skip auth method selection
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // 1. Initial Sign In - Populate token with initial data
      if (user) {
        token.id = user.id;
        token.village = (user as any).village;
        token.ageGrade = (user as any).ageGrade;
        token.onboardingCompleted = (user as any).onboardingCompleted;
        token.onboardingStep = (user as any).onboardingStep;
        token.userType = (user as any).userType;
      }

      // 2. Ensure we have the correct Database CUID
      // For OAuth users, user.id might be the Provider ID, not our database CUID.
      // We always sync with the database based on email or current ID.
      if (
        !token.id ||
        trigger === "update" ||
        (user && account?.provider === "google")
      ) {
        const dbUser = await prisma.user.findUnique({
          where: token.email
            ? { email: token.email }
            : { id: token.id as string },
        });

        if (dbUser) {
          token.id = dbUser.id; // Corrects Google ID to database CUID
          token.village = dbUser.village;
          token.ageGrade = dbUser.ageGrade;
          token.onboardingCompleted = dbUser.onboardingCompleted;
          token.onboardingStep = dbUser.onboardingStep;
          token.userType = dbUser.userType;
          token.name = dbUser.name;
          token.picture = dbUser.profileImage;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).village = token.village;
        (session.user as any).ageGrade = token.ageGrade;
        (session.user as any).onboardingCompleted = token.onboardingCompleted;
        (session.user as any).onboardingStep = token.onboardingStep;
        (session.user as any).userType = token.userType;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
