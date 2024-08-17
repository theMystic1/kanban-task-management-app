import { signOutAction } from "@/app/services/supabase/actions";
import Button from "../ui/Button";

function SignOut() {
  return (
    <form action={signOutAction}>
      <Button type="primary">LOGOUT</Button>
    </form>
  );
}

export default SignOut;
