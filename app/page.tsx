import Home from "./_components/home/Home";
import { getBoards } from "./services/supabase/actions";

async function page() {
  await getBoards();
  return <Home />;
}

export default page;
