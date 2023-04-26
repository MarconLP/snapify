import Footer from "~/components/Footer";
import Header from "~/components/Header";

interface Props {
  name: string;
  children: string | JSX.Element | JSX.Element[];
}

export default function Legal({ name, children }: Props) {
  return (
    <>
      <Header />

      <div className="mb-[30px] sm:mb-0">
        <div className="flex justify-center">
          <p className="my-[100px] text-[10vw] font-extrabold sm:text-[72px]">
            {name}
          </p>
        </div>
        <div className="flex justify-center border-b border-[#cbcdd1] bg-[#FAFAFA]">
          <div className="w-[900px]">{children}</div>
        </div>
      </div>

      <Footer />
    </>
  );
}
