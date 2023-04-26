export default function Footer() {
  return (
    <div className="mx-16 flex items-center justify-center">
      <footer className="mb-4 mt-4 flex h-full w-[1048px] flex-col-reverse items-center justify-between text-sm md:flex-row">
        <div className="mx-8 my-[50px] text-sm text-[#666] md:my-0">
          © 2023 Snapify
        </div>
        <div className="mx-8 flex w-full flex-col px-[50px] md:w-auto md:flex-row md:px-0">
          <a
            className="flex h-[42px] cursor-pointer items-center border-b border-[#eee] text-sm text-[#666] hover:text-black md:ml-8 md:border-none"
            href="/legal/privacy-policy"
          >
            Privacy Policy
          </a>
          <a
            className="flex h-[42px] cursor-pointer items-center border-b border-[#eee] text-sm text-[#666] hover:text-black md:ml-8 md:border-none"
            href="/legal/terms"
          >
            Terms and Conditions
          </a>
          <a
            className="flex h-[42px] cursor-pointer items-center border-b border-[#eee] text-sm text-[#666] hover:text-black md:ml-8 md:border-none"
            href="/legal/impressum"
          >
            Impressum
          </a>
          <a
            className="flex h-[42px] cursor-pointer items-center border-b border-[#eee] text-sm text-[#666] hover:text-black md:ml-8 md:border-none"
            href="https://status.snapify.it"
          >
            Status
          </a>
        </div>
      </footer>
    </div>
  );
}
