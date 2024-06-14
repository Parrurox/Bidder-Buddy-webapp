import { auth } from "@/auth";
import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { database } from "@/db/database";
import { items } from "@/db/schema";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const allItems = await database.query.items.findMany();
  const session = await auth();
  if (!session) return null;
  const user = session.user;
  if (!user) return null;

  return (
    <main className="container mx-auto py-12">
      {session ? <SignOut /> : <SignIn />}
      {session?.user?.name}

      <form
        action={async (formData: FormData) => {
          "use server";

          await database.insert(items).values({
            name: formData.get("name") as string,
            userId: session?.user?.id!,
          });
          revalidatePath("/");
        }}
      >
        <Input type="text" placeholder="name your item" name="name" />
        <Button type="submit">Post Item !</Button>
      </form>
      {allItems.map((Item) => (
        <div key={Item.id}>{Item.name}</div>
      ))}
    </main>
  );
}
