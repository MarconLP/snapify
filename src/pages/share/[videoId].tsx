import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { getTime } from "~/utils/getTime";
import { ShareModal } from "~/components/ShareModal";
import { useSession } from "next-auth/react";
import VideoMoreMenu from "~/components/VideoMoreMenu";
import ProfileMenu from "~/components/ProfileMenu";
import { usePostHog } from "posthog-js/react";
import { useAtom } from "jotai";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import VideoRecordModal from "~/components/VideoRecordModal";
import defaultProfileIcon from "~/assets/default profile icon.jpg";

const VideoList: NextPage = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { videoId } = router.query as { videoId: string };
  const posthog = usePostHog();
  const [, setRecordOpen] = useAtom(recordVideoModalOpen);

  const { data: video, isLoading } = api.video.get.useQuery(
    { videoId },
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.data?.code === "FORBIDDEN") return false;
        else return failureCount < 2;
      },
      onError: (err) => {
        if (err?.data?.code === "FORBIDDEN") {
          posthog?.capture("video page: FORBIDDEN");
        } else if (err?.data?.code === "NOT_FOUND") {
          posthog?.capture("video page: NOT_FOUND");
        }
      },
    }
  );

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
      cta: "shared video",
    });
  };

  if (!isLoading && !video) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <span className="max-w-[80%] text-center text-2xl font-medium">
          This recording is currently unavailable
        </span>
        <span className="mt-3 max-w-[80%] text-center text-sm">
          To create your own public recordings,{" "}
          <Link
            onClick={() =>
              posthog?.capture("click sign-up from video error page")
            }
            href="/sign-in"
            className="pointer text-[#4169e1] underline"
          >
            create an account
          </Link>{" "}
          for free!
        </span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {video?.title ?? "Snapify | The Open Source Loom Alternative"}
        </title>
        <meta property="og:image" content={video?.thumbnailUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta
          name="description"
          content="Share high-quality videos asynchronously and collaborate on your own schedule"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex min-h-[62px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <Link href="/">
            <span>Snapify</span>
          </Link>
          <div className="flex items-center justify-center">
            {video && video.userId === session?.user.id ? (
              <>
                <VideoMoreMenu video={video} />
                <ShareModal video={video} />
              </>
            ) : null}
            {status === "authenticated" ? (
              <>
                <Link href="/videos">
                  <span className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]">
                    My Library
                  </span>
                </Link>
                <div className="ml-4 flex items-center justify-center">
                  <ProfileMenu />
                </div>
              </>
            ) : (
              <button
                onClick={openRecordModal}
                className="inline-flex max-h-[35px] items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Record a video
              </button>
            )}
          </div>
        </div>
        <div className="flex h-full w-full grow flex-col items-center justify-start overflow-auto bg-[#fbfbfb]">
          <div className="flex aspect-video max-h-[calc(100vh_-_169px)] w-full justify-center bg-black 2xl:max-h-[1160px]">
            {video?.video_url && (
              <>
                <video
                  controls
                  onPlay={() =>
                    posthog?.capture("play video", {
                      videoId: video.id,
                      videoCreatedAt: video.createdAt,
                      videoUpdatedAt: video.updatedAt,
                      videoUser: video.user.id,
                      videoSharing: video.sharing,
                      videoDeleteAfterLinkExpires:
                        video.delete_after_link_expires,
                      videoShareLinkExpiresAt: video.shareLinkExpiresAt,
                    })
                  }
                  onPause={() =>
                    posthog?.capture("pause video", {
                      videoId: video.id,
                      videoCreatedAt: video.createdAt,
                      videoUpdatedAt: video.updatedAt,
                      videoUser: video.user.id,
                      videoSharing: video.sharing,
                      videoDeleteAfterLinkExpires:
                        video.delete_after_link_expires,
                      videoShareLinkExpiresAt: video.shareLinkExpiresAt,
                    })
                  }
                  className="h-full w-full"
                >
                  <source src={video.video_url} />
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </div>
          <div className="mb-10 mt-4 w-full max-w-[1800px] pl-[24px]">
            <div>
              {video?.title ? (
                <div className="mb-4 flex flex-col">
                  <span className="text-[18px] text-lg font-medium">
                    {video.title}
                  </span>
                  <span className="text-[18px] text-sm text-gray-800">
                    {getTime(video.createdAt)}
                  </span>
                </div>
              ) : (
                <div className="mb-4 flex flex-col">
                  <div className="h-5 w-[300px] animate-pulse rounded bg-slate-200"></div>
                  <div className="mt-2 h-4 w-[50px] animate-pulse rounded bg-slate-200"></div>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-row items-center">
              {!isLoading ? (
                <>
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={video.user.image ?? defaultProfileIcon}
                      alt="profile icon"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                  <span className="ml-3 font-medium">{video.user.name}</span>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 animate-pulse overflow-hidden rounded-full bg-slate-200"></div>
                  <div className="ml-3 h-4 w-[100px] animate-pulse rounded bg-slate-200 font-medium"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <VideoRecordModal />
    </>
  );
};

export default VideoList;
