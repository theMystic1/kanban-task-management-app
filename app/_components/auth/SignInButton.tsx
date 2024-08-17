function SignInButton() {
  return (
    <form className="w-full h-full flex items-center justify-center">
      <button className="flex items-center gap-6 text-lg border border-purpple-600 px-10 py-4 font-medium">
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
