// Script to help batch update API routes from NextAuth to Supabase
// Pattern to find and replace

const oldPattern = `import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
if (!session || !session.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = (session.user as any).id;`;

const newPattern = `import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = user.id;`;

// Files to update:
// - posts/route.ts
// - posts/[id]/route.ts
// - posts/[id]/comments/route.ts
// - discussions/route.ts
// - discussions/[id]/route.ts
// - discussions/[id]/replies/route.ts
// - family/nodes/route.ts
// - family/relationships/route.ts
// - family/relationships/[id]/route.ts
// - conversations/route.ts
// - conversations/[id]/route.ts
// - conversations/[id]/messages/route.ts
// - notifications/route.ts
// - notifications/[id]/route.ts
