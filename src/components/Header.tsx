import Link from "next/link";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import logo from "~/assets/logo.png";
import Image from "next/image";

const navigation = [
  { name: "Overview", href: "/" },
  { name: "Pricing", href: "/pricing" },
  { name: "Github", href: "https://github.com/MarconLP/snapify" },
];

export default function Header() {
  const [attop, setAtTop] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const router = useRouter();

  const closeNav = () => {
    setNavbarOpen(false);
  };
  useEffect(() => {
    document.addEventListener("scroll", () => {
      setAtTop(window.scrollY <= 1);
    });
  }, []);

  return (
    <div
      style={{ borderColor: attop ? "transparent" : "#E5E5E5" }}
      className="header sticky top-0 z-10 flex h-[64px] border-b bg-white bg-opacity-40 backdrop-blur-sm backdrop-saturate-200"
    >
      <div className="m-auto flex w-[1048px] items-center justify-between px-[24px]">
        <Link href="/">
          <Image
            className="cursor-pointer p-2"
            src={logo}
            alt="logo"
            width={42}
            height={42}
            unoptimized
          />
        </Link>

        <div className="hidden md:block">
          {navigation.map(({ href, name }) => (
            <Link key={name} href={href}>
              <span
                className={`mx-[6px] cursor-pointer rounded-full p-2 text-sm text-[#666] hover:text-black ${
                  router.asPath === href ? "bg-[#00000014]" : ""
                }`}
              >
                {name}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/sign-in"
          className="hidden text-sm font-semibold leading-6 text-gray-900 md:block"
        >
          Log in <span aria-hidden="true">&rarr;</span>
        </Link>

        <div className="flex flex-row items-center md:hidden">
          <Link
            href="/sign-in"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
          <div
            className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <Bars3Icon className="h-6 w-6" />
          </div>
        </div>

        <div
          style={{
            transition: "all 0.2s cubic-bezier(.17,.27,0,.99)",
            height: navbarOpen ? "calc(100vh - 64px)" : "calc(100vh - 80px)",
            opacity: 0,
          }}
          className={`absolute left-0 right-0 bg-white px-6 pt-6 opacity-0 ${
            navbarOpen
              ? "visible top-[64px] block !opacity-100"
              : "invisible top-[80px]"
          }`}
        >
          {navigation.map(({ href, name }) => (
            <Link key={name} href={href} onClick={closeNav}>
              <div className="flex h-[48px] cursor-pointer items-center border-b border-[#EAEAEA] text-[16px] hover:bg-[#FAFAFA]">
                {name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
