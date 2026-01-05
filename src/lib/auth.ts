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
      if (user) {
        token.id = user.id;
        token.village = (user as any).village;
        token.ageGrade = (user as any).ageGrade;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }

      // Handle session updates (e.g., after onboarding completion)
      if (trigger === "update" && session) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (updatedUser) {
          token.village = updatedUser.village;
          token.ageGrade = updatedUser.ageGrade;
          token.onboardingCompleted = updatedUser.onboardingCompleted;
          token.name = updatedUser.name;
          token.picture = updatedUser.profileImage;
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
      }
      return session;
    },
  },
  pages: {
    signIn: "/register",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
