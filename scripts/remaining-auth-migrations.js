/**
 * Auto-migration helper for remaining API routes
 * This script documents the remaining routes that need updating
 */

const PATTERN_OLD = {
  import: `import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";`,

  auth: `const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = (session.user as any).id;`,

  userLookup: `const user = await prisma.user.findUnique({
  where: { email: session.user.email! },
});`,

  userConnect: `connect: { email: session.user.email! }`,
};

const PATTERN_NEW = {
  import: `import { createClient } from "@/lib/supabase/server";`,

  auth: `const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = user.id;`,

  userLookup: `const dbUser = await prisma.user.findUnique({
  where: { id: user.id },
});`,

  userConnect: `connect: { id: user.id }`,
};

// Remaining files to update (8 total):
const REMAINING_FILES = [
  "src/app/api/posts/[id]/route.ts",
  "src/app/api/posts/[id]/comments/route.ts",
  "src/app/api/discussions/[id]/route.ts",
  "src/app/api/discussions/[id]/replies/route.ts",
  "src/app/api/family/nodes/route.ts",
  "src/app/api/family/relationships/route.ts",
  "src/app/api/family/relationships/[id]/route.ts",
  "src/app/api/conversations/[id]/route.ts",
  "src/app/api/conversations/[id]/messages/route.ts",
  "src/app/api/notifications/[id]/route.ts",
];

console.log(`${REMAINING_FILES.length} files remaining to update`);
