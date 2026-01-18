// Batch update script for remaining API routes
// This will help complete the final 9 routes

const fs = require("fs");
const path = require("path");

const routes = [
  "src/app/api/posts/[id]/route.ts",
  "src/app/api/posts/[id]/comments/route.ts",
  "src/app/api/discussions/[id]/route.ts",
  "src/app/api/discussions/[id]/replies/route.ts",
  "src/app/api/family/relationships/route.ts",
  "src/app/api/family/relationships/[id]/route.ts",
  "src/app/api/conversations/[id]/route.ts",
  "src/app/api/conversations/[id]/messages/route.ts",
  "src/app/api/notifications/[id]/route.ts",
];

const replacements = [
  {
    find: 'import { getServerSession } from "next-auth/next";',
    replace: "",
  },
  {
    find: 'import { getServerSession } from "next-auth";',
    replace: "",
  },
  {
    find: 'import { authOptions } from "@/lib/auth";',
    replace: 'import { createClient } from "@/lib/supabase/server";',
  },
  {
    find: /const session = await getServerSession\(authOptions\);[\s\S]*?if \(!session\?\.\user\) \{[\s\S]*?\}[\s\S]*?const userId = \(session\.user as any\)\.id;/g,
    replace: `const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = user.id;`,
  },
];

console.log(`Script ready to update ${routes.length} files`);
