import Image from "next/image";
import Logo from "../ui/Logo";
import { signInAction } from "@/app/services/supabase/actions";

function SignInButton() {
  return (
    <form
      className="w-full h-full flex items-center flex-col gap-6 justify-center"
      action={signInAction}
    >
      <Logo type="logoDark" />
      <h1 className="text-grayy-200">Task Management simplified</h1>
      <button className="flex items-center gap-6 text-lg border border-purpple-600 px-10 py-4 font-medium">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span className="text-grayy-200">Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
