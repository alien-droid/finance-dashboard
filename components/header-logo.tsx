import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
  return (
    <Link href={"/"}>
      <div className="items-center lg:flex hidden">
        <Image src="/logo.svg" alt="Logo" width={28} height={28} />
        <p className="font-semibold text-white text-2xl ml-2.5">X-Finance</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
