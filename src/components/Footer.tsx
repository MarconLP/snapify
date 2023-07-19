import Link from "next/link";

export default function Footer() {
  return (
    <div className="mx-16 flex items-center justify-center">
      <footer className="mb-4 mt-4 flex h-full w-[1048px] flex-col-reverse items-center justify-between text-sm md:flex-row">
        <div className="my-[50px] ml-8 text-sm text-[#666] md:my-0">
          © 2023 Snapify by{" "}
          <Link
            target="_blank"
            className="underline"
            href="https://marcushof.vercel.app/"
          >
            Marcus Hof
          </Link>
        </div>
        <div className="mr-8 flex w-full flex-col sm:px-[50px] md:w-auto md:flex-row md:gap-8 md:px-0">
          {[
            { name: "Privacy Policy", link: "/legal/privacy-policy" },
            { name: "Terms and Conditions", link: "/legal/terms" },
          ].map(({ name, link }) => (
            <Link
              key={name}
              className="flex h-[42px] cursor-pointer items-center border-b border-[#eee] text-sm text-[#666] hover:text-black md:border-none"
              href={link}
            >
              {name}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
