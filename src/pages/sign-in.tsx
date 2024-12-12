import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";

import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Link from "next/link";
import getIcon from "~/utils/getIcon";
import Image from "next/image";


const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Sign in to Snapify</title>
        <meta
          name="description"
          content="Share high-quality videos asynchronously and collaborate on your own schedule"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb]">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="animate-fade-in flex flex-col justify-center text-center">
            {/* <span className="text-sm font-medium text-gray-700">
              Sign in with
            </span> */}
            <div className="mt-3 flex flex-col gap-3">
              {Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  className="relative inline-flex items-center justify-center gap-3 rounded-md border border-gray-400 bg-white px-6 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100"
                  type="button"
                  onClick={() =>
                    void signIn(provider.id, {
                      callbackUrl: provider.callbackUrl,
                    })
                  }
                >
                  <div>
                    <Image
                      src={getIcon(provider.name)}
                      alt="button_icon"
                      width={22}
                      height={22}
                    />
                  </div>
                  <span className="flex flex-row">
                    <span>Sign in with {provider.name}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="prose prose-sm mx-auto mt-6 max-w-[18rem] text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/legal/terms">Terms of Service</Link> and{" "}
              <Link href="/legal/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/videos" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
