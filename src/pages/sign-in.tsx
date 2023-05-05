import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";

import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Link from "next/link";

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
            <span className="text-sm font-medium text-gray-700">
              Sign in with
            </span>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  className="relative inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-lg text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  type="button"
                  onClick={() =>
                    void signIn(provider.id, {
                      callbackUrl: provider.callbackUrl,
                    })
                  }
                >
                  <span className="flex flex-row">
                    <span>{provider.name}</span>
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
