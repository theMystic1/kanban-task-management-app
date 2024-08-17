import { auth } from "@/app/services/auth";
import Main from "./Main";
import { cookies } from "next/headers";

type curUserProp = {
  user_id: string;
  email: string;
  name: string;
};

async function MainServer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const curSession =
  //   session != null ? session : ({} as { user?: { email?: string } });

  // let curUser: curUserProp;

  // try {
  //   curUser = await getUser(curSession.user?.email);
  // } catch (error) {
  //   console.error("Failed to retrieve user:", error);
  //   // Handle the error as needed, maybe redirect or show a message
  //   throw error; // or return a fallback UI
  // }

  const ownerId = cookies().get("curuser");


  return <Main userId={ownerId?.value}>{children}</Main>;
}

export default MainServer;
