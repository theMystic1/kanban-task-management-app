import logoLight from "@/public/assets/logo-light.svg";
import logoDark from "@/public/assets/logo-dark.svg";

import logoMobile from "@/public/assets/logo-mobile.svg";
import Image from "next/image";
import Link from "next/link";

type logoProps = {
  type?: string;
  className?: string;
};
function Logo({ type = "", className = "" }: logoProps) {
  return (
    <Link href="/">
      <div
        className={`relative ${
          type === "moble" ? "h-8 w-8" : " h-6 w-32"
        } ${className}`}
      >
        <Image
          src={
            type === "logolight"
              ? logoLight
              : type === "logoDark"
              ? logoDark
              : logoMobile
          }
          fill
          alt={type}
        />
      </div>
    </Link>
  );
}

export default Logo;
