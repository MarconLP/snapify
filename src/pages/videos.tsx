import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getTime } from "~/utils/getTime";
import ProfileMenu from "~/components/ProfileMenu";
import NewVideoMenu from "~/components/NewVideoMenu";
import VideoRecordModal from "~/components/VideoRecordModal";
import VideoUploadModal from "~/components/VideoUploadModal";
import { useAtom } from "jotai";
import uploadVideoModalOpen from "~/atoms/uploadVideoModalOpen";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import Paywall from "~/components/Paywall";
import paywallAtom from "~/atoms/paywallAtom";
import { usePostHog } from "posthog-js/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

const VideoList: NextPage = () => {
  const [, setRecordOpen] = useAtom(recordVideoModalOpen);
  const [, setUploadOpen] = useAtom(uploadVideoModalOpen);
  const [, setPaywallOpen] = useAtom(paywallAtom);
  const router = useRouter();
  const { status, data: session } = useSession();
  const { data: videos, isLoading } = api.video.getAll.useQuery();
  const posthog = usePostHog();
  const searchParams = useSearchParams();
  const [closeWindow, setCloseWindow] = useState<boolean>(false);

  if (status === "unauthenticated") {
    void router.replace("/sign-in");
  }

  const checkoutCanceledQueryParam = searchParams.get("checkoutCanceled");
  const closeQueryParam = searchParams.get("close");

  const openRecordModal = () => {
    if (
      !navigator?.mediaDevices?.getDisplayMedia &&
      !navigator?.mediaDevices?.getDisplayMedia
    ) {
      return alert("Your browser is currently NOT supported.");
    }
    setRecordOpen(true);

    posthog?.capture("open record video modal", {
      stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
      cta: "empty video list page",
    });
  };

  const openUploadModal = () => {
    if (
      session?.user.stripeSubscriptionStatus === "active" ||
      !env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ) {
      setUploadOpen(true);

      posthog?.capture("open upload video modal", {
        stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
        cta: "empty video list page",
      });
    } else {
      setPaywallOpen(true);

      posthog?.capture("hit video upload paywall", {
        stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
        cta: "empty video list page",
      });
    }
  };

  useEffect(() => {
    const closeWindow =
      (window.innerWidth === 500 &&
        (window.innerHeight === 499 || window.innerHeight === 500)) ||
      closeQueryParam === "true";
    setCloseWindow(closeWindow);
  }, [closeQueryParam]);

  useEffect(() => {
    if (checkoutCanceledQueryParam && closeQueryParam === "false") {
      setTimeout(() => {
        void router.push("/videos").then(() => router.reload());
      }, 5000);
    }
  }, [checkoutCanceledQueryParam, closeQueryParam]);

  return (
    <>
      <Head>
        <title>Library | Snapify</title>
        <meta
          name="description"
          content="Share high-quality videos asynchronously and collaborate on your own schedule"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex min-h-[62px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <Link href="/">
            <span>Snapify</span>
          </Link>
          <div className="flex flex-row items-center justify-center">
            <VideoRecordModal />
            <VideoUploadModal />
            <Paywall />

            {videos?.length &&
            session?.user?.stripeSubscriptionStatus !== "active" &&
            1 + 1 === 3 ? (
              <div className="mr-4 flex max-h-[35px] flex-col items-center justify-center rounded px-2 py-2 text-sm text-[#6c6685]">
                <span>{videos.length}/10 videos</span>
                <div className="mt-1 h-[3px] w-full rounded-full bg-gray-200">
                  <div
                    className={`h-[3px] w-[45%] rounded-full ${
                      videos.length >= 7 ? "bg-red-600" : "bg-blue-600"
                    }`}
                    style={{
                      width: videos.length.toString() + "0%",
                    }}
                  ></div>
                </div>
              </div>
            ) : null}
            <NewVideoMenu />
            {status === "authenticated" && (
              <div className="ml-4 flex items-center justify-center">
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>
        <div
          className="flex w-full grow items-start justify-center overflow-auto bg-[#fbfbfb] pt-14"
          suppressHydrationWarning={true}
        >
          {closeWindow || checkoutCanceledQueryParam ? (
            <>
              {checkoutCanceledQueryParam === "false" ? (
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-zinc-700">
                    Successfully upgraded
                  </span>
                  {closeQueryParam === "true" ? (
                    <span className="mt-1 text-base text-zinc-500">
                      You can now close this window and try to upload the video
                      again!
                    </span>
                  ) : (
                    <span className="mt-1 text-base text-zinc-500">
                      You will be redirected shortly
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  {checkoutCanceledQueryParam === "true" ? (
                    <>
                      <span className="text-lg font-semibold text-zinc-700">
                        Purchase cancelled
                      </span>
                      {closeQueryParam === "true" ? (
                        <span className="mt-1 text-base text-zinc-500">
                          You can now close this window
                        </span>
                      ) : (
                        <span className="mt-1 text-base text-zinc-500">
                          You will be redirected shortly
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-semibold text-zinc-700">
                        Successfully logged in
                      </span>
                      <span className="mt-1 text-base text-zinc-500">
                        You can now close this window and try to upload the
                        video again!
                      </span>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {videos && videos?.length <= 0 ? (
                <div className="flex items-center justify-center px-8">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-zinc-700">
                      No videos found
                    </span>
                    <span className="mt-1 text-base text-zinc-500">
                      Videos you record will show up here. Already got videos?
                      Upload them!
                    </span>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button
                        onClick={openRecordModal}
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Record a video
                      </button>
                      <button
                        onClick={openUploadModal}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Upload a video
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-start grid w-full max-w-[1300px] grid-cols-[repeat(auto-fill,250px)] flex-row flex-wrap items-center justify-center gap-14 px-4 pb-16">
                  {videos &&
                    videos.map(({ title, id, createdAt, thumbnailUrl }) => (
                      <VideoCard
                        title={title}
                        id={id}
                        createdAt={createdAt}
                        thumbnailUrl={thumbnailUrl}
                        key={id}
                      />
                    ))}

                  {isLoading ? (
                    <>
                      <VideoCardSkeleton />
                      <VideoCardSkeleton />
                      <VideoCardSkeleton />
                      <VideoCardSkeleton />
                    </>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

interface VideoCardProps {
  title: string;
  id: string;
  thumbnailUrl: string;
  createdAt: Date;
}

const VideoCardSkeleton = () => {
  return (
    <div className="h-[240px] w-[250px] animate-pulse overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
      <figure className="relative aspect-video w-full bg-slate-200"></figure>
      <div className="m-4 flex flex-col">
        <span className="h-4 rounded bg-slate-200"></span>
        <span className="mt-4 h-4 rounded bg-slate-200"></span>
      </div>
    </div>
  );
};

const VideoCard = ({ title, id, createdAt, thumbnailUrl }: VideoCardProps) => {
  return (
    <Link href={`/share/${id}`}>
      <div className="h-[240px] w-[250px] cursor-pointer overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
        <figure>
          <Image
            src={thumbnailUrl}
            className="max-h-[139.5px] max-w-[248px]"
            alt="video thumbnail"
            width={248}
            height={139.5}
            unoptimized
          />
        </figure>
        <div className="m-4 flex flex-col">
          <span className="line-clamp-2 font-bold text-[0f0f0f]">{title}</span>
          <span className="mt-2 text-[#606060]">{getTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoList;
