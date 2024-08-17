import Home from "./_components/home/Home";
import { auth } from "./services/auth";
import { getUser } from "./services/supabase/actions";

async function page() {
  // type curUserProp = {
  //   user_id: string;
  //   email: string;
  //   name: string;
  // };
  // const session = await auth();
  // const curSession =
  //   session != null ? session : ({} as { user?: { email?: string } });

  // const curUser: curUserProp = await getUser(curSession.user?.email);
  return <Home />;
}

export default page;
