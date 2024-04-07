import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useFeatureFlagEnabled, usePostHog } from "posthog-js/react";
import { useAtom } from "jotai";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import VideoRecordModal from "~/components/VideoRecordModal";
import { ShareIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Image from "next/image";
import CTA from "~/components/CTA";
import engineeringUsecase from "~/assets/engineering usecase.png";
import supportUsecase from "~/assets/support usecase.png";
import logo from "~/assets/logo.png";
import { useRouter } from "next/router";
import { useEffect } from "react";
import StarIcon from "~/assets/StarIcon";
import Paywall from "~/components/Paywall";

const Home: NextPage = () => {
  const [recordModalOpen, setRecordOpen] = useAtom(recordVideoModalOpen);
  const posthog = usePostHog();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated" && !recordModalOpen) {
      void router.push("/videos");
    }
  }, [session, router]);

  const openRecordModal = () => {
    if (
      !navigator?.mediaDevices?.getDisplayMedia &&
      !navigator?.mediaDevices?.getDisplayMedia
    ) {
      return alert("Your browser is currently NOT supported.");
    }
    setRecordOpen(true);

    posthog?.capture("open record video modal", {
      cta: "landing page",
    });
  };

  return (
    <>
      <Head>
        <title>Snapify | The Open Source Loom Alternative</title>
        <meta
          name="description"
          content="Share high-quality videos asynchronously and collaborate on your own schedule"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white">
        <Header />

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-7xl py-32 sm:py-48 lg:py-56">
            {/*<div className="hidden sm:mb-8 sm:flex sm:justify-center">*/}
            {/*  <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">*/}
            {/*    Announcing our next round of funding.{" "}*/}
            {/*    <Link href="/blog" className="font-semibold text-indigo-600">*/}
            {/*      <span className="absolute inset-0" aria-hidden="true" />*/}
            {/*      Read more <span aria-hidden="true">&rarr;</span>*/}
            {/*    </Link>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The open source Loom alternative.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Self-hosted or hosted by us. You are in control of your own
                data.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-6">
                <button
                  onClick={openRecordModal}
                  className="inline-flex h-[70px] flex-col items-center justify-between rounded-md border border-transparent bg-red-600 px-8 py-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <span>Record a video</span>
                  <span className="text-xs">(no account required)</span>
                </button>
                <div className="flex flex-col gap-6 sm:flex-row">
                  <a
                    onClick={() =>
                      posthog?.capture("clicked watch recorded demo demo")
                    }
                    target="_blank"
                    href="https://snapify.it/share/clk3mpgnu0003mj0f042964wg"
                    className="text-sm font-semibold leading-6"
                  >
                    Watch recorded demo <span aria-hidden="true">→</span>
                  </a>
                  <a
                    onClick={() => posthog?.capture("clicked schedule demo")}
                    target="_blank"
                    href="https://cal.com/marcon/snapify-demo"
                    className="text-sm font-semibold leading-6"
                  >
                    Schedule personalized demo <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex w-full items-center justify-center border-t pt-6 flex`}
          >
            <div className="flex max-w-2xl flex-1 flex-col items-center justify-between gap-y-10 py-4 lg:h-[140px] lg:flex-row">
              {[
                {
                  name: "Peer Richelsen",
                  role: "CEO @ Cal.com",
                  text: "snapify.it is mega",
                  profilePicture:
                    "/peer-profile.jpeg",
                },
                {
                  name: "Mish Ushakov",
                  role: "CTO @ StepCI",
                  text: "A godsend",
                  profilePicture:
                    "/mish-profile.jpeg",
                },
              ].map(({ name, role, text, profilePicture }) => (
                <div key={name} className="gap-2 text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="flex flex-row gap-1 fill-[#fbbf24]">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                    </div>
                  </div>
                  <div className="quote mb-2 break-words text-center text-base leading-snug">
                    <span className="font-bold opacity-50">“</span>
                    <span className="quote-text">{text}</span>
                    <span className="font-bold opacity-50">”</span>
                  </div>
                  <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                    <div className="flex-none">
                      <div>
                        <img
                          src={profilePicture}
                          alt="testimonial avatar"
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>
                    </div>
                    <div className="flex max-w-[200px] flex-none flex-col overflow-hidden text-left">
                      <div className="text-sm font-medium opacity-90">
                        {name}
                      </div>
                      <div className="block text-xs font-medium opacity-50">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/*<div className="h-[54px] min-w-[250px] overflow-hidden">*/}
              {/*  <a href={"https://producthunt.com/"} target="_blank">*/}
              {/*    <Image*/}
              {/*      src={*/}
              {/*        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjU0IiB2aWV3Qm94PSIwIDAgMjUwIDU0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzMC4wMDAwMDAsIC03My4wMDAwMDApIj4KICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMwLjAwMDAwMCwgNzMuMDAwMDAwKSI+CiAgICAgICAgPHJlY3Qgc3Ryb2tlPSIjRkY2MTU0IiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9IiNGRkZGRkYiIHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iMjQ5IiBoZWlnaHQ9IjUzIiByeD0iMTAiPjwvcmVjdD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iSGVsdmV0aWNhLUJvbGQsIEhlbHZldGljYSIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGNjE1NCI+CiAgICAgICAgICA8dHNwYW4geD0iNTMiIHk9IjIwIj5QUk9EVUNUIEhVTlQ8L3RzcGFuPgogICAgICAgIDwvdGV4dD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iSGVsdmV0aWNhLUJvbGQsIEhlbHZldGljYSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRjYxNTQiPgogICAgICAgICAgPHRzcGFuIHg9IjUyIiB5PSI0MCI+IzIgUHJvZHVjdCBvZiB0aGUgRGF5PC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICAgICAgCiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMDAwMDAwLCAxMy4wMDAwMDApIj48cGF0aCBkPSJNNC4zMywxNi4zNjQgTDAuMzI4LDI0LjkgQzAuMjAyLDI1LjE1OCAwLjMzNSwyNS4zMiAwLjc1NSwyNS4yNCBMNC4wMTMsMjQuNTMyIEM0LjA3NzU1MjM0LDI0LjUwOTQxNzMgNC4xNDg2MTg5NiwyNC41MTQ5NjE3IDQuMjA4ODg3ODksMjQuNTQ3MjgyNiBDNC4yNjkxNTY4MywyNC41Nzk2MDM1IDQuMzEzMDk1MzcsMjQuNjM1NzMzNyA0LjMzLDI0LjcwMiBMNS43OTcsMjcuNzA5IEM1LjkzNywyOC4wMzMgNi4wOTksMjguMDk5IDYuMjI1LDI3Ljg0MiBMMTAuNDg1LDE4LjkwOCBMNC4zMywxNi4zNjQgWiBNMTYuNjcsMTYuMzY0IEwyMC42NzIsMjQuOSBDMjAuODA1LDI1LjE1OCAyMC42NjUsMjUuMzIgMjAuMjQ1LDI1LjI0IEwxNi45ODcsMjQuNTMyIEMxNi45MjI0MzUzLDI0LjUxMDA1MDYgMTYuODUxNjU2MiwyNC41MTU4ODY5IDE2Ljc5MTU1ODksMjQuNTQ4MTE1NyBDMTYuNzMxNDYxNiwyNC41ODAzNDQ1IDE2LjY4NzQzOSwyNC42MzYwNzM4IDE2LjY3LDI0LjcwMiBMMTUuMjAzLDI3LjcwOSBDMTUuMDYzLDI4LjAzMyAxNC45MDgsMjguMDk5IDE0Ljc3NSwyNy44NDIgTDEwLjUxNSwxOC45MDggTDE2LjY3LDE2LjM2NCBaIiBmaWxsPSIjREU3ODE4IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48cGF0aCBkPSJNOS4yOTgsMjEuMzkyIEM5LjI5OCwyMS4zOTkgOS4yODQsMjEuMzkyIDkuMjY5LDIxLjM5MiBDNy4wMzU3ODA0OSwyMS4xNDQyNTI4IDQuOTQyMDgwMjYsMjAuMTgyNjIzNyAzLjI5OSwxOC42NSBDMy4yOTEsMTguNjQyIDMuMjY5LDE4LjYzNSAzLjI3NiwxOC42MjcgTDMuNDYsMTguMjM3IEMzLjQ2OCwxOC4yMjIgMy40ODIsMTguMjU5IDMuNDksMTguMjY3IEM1LjA2NywxOS43MzMgNy4yNTcsMjAuNjU1IDkuNDk3LDIwLjkyNyBDOS41MDUsMjAuOTI3IDkuNTIsMjAuOTI3IDkuNTIsMjAuOTM1IEw5LjI5OCwyMS4zOTIgWiIgZmlsbD0iI0IzNTQ1NCI+PC9wYXRoPjxjaXJjbGUgZmlsbD0iIzlCOUI5QiIgY3g9IjEwLjUiIGN5PSIxMC40ODkiIHI9IjEwLjQ4OSI+PC9jaXJjbGU+PGNpcmNsZSBmaWxsPSIjOTQ5NDk0IiBjeD0iMTAuNSIgY3k9IjEwLjQ4OSIgcj0iOS4wNDUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0iI0I2QjZCNiIgY3g9IjEwLjc1IiBjeT0iMTAuNzUiIHI9IjguNzUiPjwvY2lyY2xlPjxwYXRoIGQ9Ik03LjE5LDkuMDE4IEw3LjE5LDkuMDU0IEw5LjE1OSw5LjA1NCBMOS4xNTksOS4wMTMgQzkuMTU5LDguMzE1IDkuNjYzLDcuODIzIDEwLjM4OSw3LjgyMyBDMTEuMDg2LDcuODIzIDExLjU0NCw4LjIzOSAxMS41NDQsOC44NiBDMTEuNTQ0LDkuMzU4IDExLjIyNyw5Ljc4NiA5Ljk4NCwxMC45MzQgTDcuMzE0LDEzLjQ0OCBMNy4zMTQsMTQuODg0IEwxMy43NDEsMTQuODg0IEwxMy43NDEsMTMuMjA4IEwxMC4xNzgsMTMuMjA4IEwxMC4xNzgsMTMuMDk3IEwxMS41NzMsMTEuODEzIEMxMy4wNzMsMTAuNDc3IDEzLjYyMyw5LjY0NSAxMy42MjMsOC43MDggQzEzLjYyMyw3LjIxNCAxMi4zNTgsNi4yIDEwLjQ2NSw2LjIgQzguNTAzLDYuMiA3LjE5LDcuMzM3IDcuMTksOS4wMTggWiIgZmlsbD0iI0VGRUZFRiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMi45NywzLjA4OSBDMTYuMzI2MDc0NSwzLjg5MTEzMzYzIDE4LjcyMTMxODYsNi44NTI1MTMyNyAxOC44MDQxNjczLDEwLjMwMjEyMDUgQzE4Ljg4NzAxNjEsMTMuNzUxNzI3OCAxNi42MzY2OTc4LDE2LjgyNDY3OTMgMTMuMzIzLDE3Ljc4NyBDMTUuMzU4LDE2LjIzMiAxNi43MDcsMTMuNTc4IDE2LjcwNywxMC41NjMgQzE2LjcwNyw3LjM3OSAxNS4yMDMsNC42IDEyLjk2OSwzLjA4OSBMMTIuOTcsMy4wODkgWiIgZmlsbC1vcGFjaXR5PSIwLjIiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD48cGF0aCBkPSJNMTEuNzAyLDIxLjM5MiBDMTEuNzA5LDIxLjM5OSAxMS43MjQsMjEuMzkyIDExLjczMSwyMS4zOTIgQzE0LjAyNCwyMS4xMDQgMTYuMTMxLDIwLjE4MiAxNy43MTcsMTguNjY0IEMxNy43MjQsMTguNjU3IDE3Ljc0NiwxOC42NSAxNy43MzksMTguNjQyIEwxNy41NTQsMTguMjUyIEMxNy41NDcsMTguMjM3IDE3LjUzMiwxOC4yNzQgMTcuNTI0LDE4LjI4MSBDMTUuOTQ3LDE5Ljc0OCAxMy43NTEsMjAuNjU1IDExLjUwMywyMC45MjcgQzExLjQ5NSwyMC45MjcgMTEuNDgsMjAuOTI3IDExLjQ4LDIwLjkzNSBMMTEuNzAyLDIxLjM5MiBaIiBmaWxsPSIjQjM1NDU0Ij48L3BhdGg+PC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"*/}
              {/*      }*/}
              {/*      alt={"producthunt"}*/}
              {/*      className="h-[54px] w-[250px]"*/}
              {/*      width="250"*/}
              {/*      height="54"*/}
              {/*    />*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
          </div>

          <div className="mx-auto hidden max-w-7xl py-6 sm:py-6 lg:py-6">
            <div className="text-center">
              <p className="mt-6 text-xl font-semibold leading-8 text-gray-600">
                TRUSTED BY THE BEST BRANDS
              </p>
              <div className="relative flex overflow-x-hidden before:absolute before:left-0 before:z-10 before:h-full before:w-[15vw] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:h-full after:w-[15vw] after:bg-gradient-to-r after:from-transparent after:to-white">
                {[1, 2].map((x) => (
                  <div
                    key={x}
                    className={`flex flex-row whitespace-nowrap py-12 ${
                      x === 1
                        ? "animate-marquee"
                        : "absolute top-0 animate-marquee2"
                    }`}
                  >
                    {[
                      {
                        url: "https://producthunt.com/",
                        image:
                          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjU0IiB2aWV3Qm94PSIwIDAgMjUwIDU0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzMC4wMDAwMDAsIC03My4wMDAwMDApIj4KICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMwLjAwMDAwMCwgNzMuMDAwMDAwKSI+CiAgICAgICAgPHJlY3Qgc3Ryb2tlPSIjRkY2MTU0IiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9IiNGRkZGRkYiIHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iMjQ5IiBoZWlnaHQ9IjUzIiByeD0iMTAiPjwvcmVjdD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iSGVsdmV0aWNhLUJvbGQsIEhlbHZldGljYSIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGNjE1NCI+CiAgICAgICAgICA8dHNwYW4geD0iNTMiIHk9IjIwIj5QUk9EVUNUIEhVTlQ8L3RzcGFuPgogICAgICAgIDwvdGV4dD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iSGVsdmV0aWNhLUJvbGQsIEhlbHZldGljYSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRjYxNTQiPgogICAgICAgICAgPHRzcGFuIHg9IjUyIiB5PSI0MCI+IzIgUHJvZHVjdCBvZiB0aGUgRGF5PC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICAgICAgCiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuMDAwMDAwLCAxMy4wMDAwMDApIj48cGF0aCBkPSJNNC4zMywxNi4zNjQgTDAuMzI4LDI0LjkgQzAuMjAyLDI1LjE1OCAwLjMzNSwyNS4zMiAwLjc1NSwyNS4yNCBMNC4wMTMsMjQuNTMyIEM0LjA3NzU1MjM0LDI0LjUwOTQxNzMgNC4xNDg2MTg5NiwyNC41MTQ5NjE3IDQuMjA4ODg3ODksMjQuNTQ3MjgyNiBDNC4yNjkxNTY4MywyNC41Nzk2MDM1IDQuMzEzMDk1MzcsMjQuNjM1NzMzNyA0LjMzLDI0LjcwMiBMNS43OTcsMjcuNzA5IEM1LjkzNywyOC4wMzMgNi4wOTksMjguMDk5IDYuMjI1LDI3Ljg0MiBMMTAuNDg1LDE4LjkwOCBMNC4zMywxNi4zNjQgWiBNMTYuNjcsMTYuMzY0IEwyMC42NzIsMjQuOSBDMjAuODA1LDI1LjE1OCAyMC42NjUsMjUuMzIgMjAuMjQ1LDI1LjI0IEwxNi45ODcsMjQuNTMyIEMxNi45MjI0MzUzLDI0LjUxMDA1MDYgMTYuODUxNjU2MiwyNC41MTU4ODY5IDE2Ljc5MTU1ODksMjQuNTQ4MTE1NyBDMTYuNzMxNDYxNiwyNC41ODAzNDQ1IDE2LjY4NzQzOSwyNC42MzYwNzM4IDE2LjY3LDI0LjcwMiBMMTUuMjAzLDI3LjcwOSBDMTUuMDYzLDI4LjAzMyAxNC45MDgsMjguMDk5IDE0Ljc3NSwyNy44NDIgTDEwLjUxNSwxOC45MDggTDE2LjY3LDE2LjM2NCBaIiBmaWxsPSIjREU3ODE4IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48cGF0aCBkPSJNOS4yOTgsMjEuMzkyIEM5LjI5OCwyMS4zOTkgOS4yODQsMjEuMzkyIDkuMjY5LDIxLjM5MiBDNy4wMzU3ODA0OSwyMS4xNDQyNTI4IDQuOTQyMDgwMjYsMjAuMTgyNjIzNyAzLjI5OSwxOC42NSBDMy4yOTEsMTguNjQyIDMuMjY5LDE4LjYzNSAzLjI3NiwxOC42MjcgTDMuNDYsMTguMjM3IEMzLjQ2OCwxOC4yMjIgMy40ODIsMTguMjU5IDMuNDksMTguMjY3IEM1LjA2NywxOS43MzMgNy4yNTcsMjAuNjU1IDkuNDk3LDIwLjkyNyBDOS41MDUsMjAuOTI3IDkuNTIsMjAuOTI3IDkuNTIsMjAuOTM1IEw5LjI5OCwyMS4zOTIgWiIgZmlsbD0iI0IzNTQ1NCI+PC9wYXRoPjxjaXJjbGUgZmlsbD0iIzlCOUI5QiIgY3g9IjEwLjUiIGN5PSIxMC40ODkiIHI9IjEwLjQ4OSI+PC9jaXJjbGU+PGNpcmNsZSBmaWxsPSIjOTQ5NDk0IiBjeD0iMTAuNSIgY3k9IjEwLjQ4OSIgcj0iOS4wNDUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0iI0I2QjZCNiIgY3g9IjEwLjc1IiBjeT0iMTAuNzUiIHI9IjguNzUiPjwvY2lyY2xlPjxwYXRoIGQ9Ik03LjE5LDkuMDE4IEw3LjE5LDkuMDU0IEw5LjE1OSw5LjA1NCBMOS4xNTksOS4wMTMgQzkuMTU5LDguMzE1IDkuNjYzLDcuODIzIDEwLjM4OSw3LjgyMyBDMTEuMDg2LDcuODIzIDExLjU0NCw4LjIzOSAxMS41NDQsOC44NiBDMTEuNTQ0LDkuMzU4IDExLjIyNyw5Ljc4NiA5Ljk4NCwxMC45MzQgTDcuMzE0LDEzLjQ0OCBMNy4zMTQsMTQuODg0IEwxMy43NDEsMTQuODg0IEwxMy43NDEsMTMuMjA4IEwxMC4xNzgsMTMuMjA4IEwxMC4xNzgsMTMuMDk3IEwxMS41NzMsMTEuODEzIEMxMy4wNzMsMTAuNDc3IDEzLjYyMyw5LjY0NSAxMy42MjMsOC43MDggQzEzLjYyMyw3LjIxNCAxMi4zNTgsNi4yIDEwLjQ2NSw2LjIgQzguNTAzLDYuMiA3LjE5LDcuMzM3IDcuMTksOS4wMTggWiIgZmlsbD0iI0VGRUZFRiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMi45NywzLjA4OSBDMTYuMzI2MDc0NSwzLjg5MTEzMzYzIDE4LjcyMTMxODYsNi44NTI1MTMyNyAxOC44MDQxNjczLDEwLjMwMjEyMDUgQzE4Ljg4NzAxNjEsMTMuNzUxNzI3OCAxNi42MzY2OTc4LDE2LjgyNDY3OTMgMTMuMzIzLDE3Ljc4NyBDMTUuMzU4LDE2LjIzMiAxNi43MDcsMTMuNTc4IDE2LjcwNywxMC41NjMgQzE2LjcwNyw3LjM3OSAxNS4yMDMsNC42IDEyLjk2OSwzLjA4OSBMMTIuOTcsMy4wODkgWiIgZmlsbC1vcGFjaXR5PSIwLjIiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD48cGF0aCBkPSJNMTEuNzAyLDIxLjM5MiBDMTEuNzA5LDIxLjM5OSAxMS43MjQsMjEuMzkyIDExLjczMSwyMS4zOTIgQzE0LjAyNCwyMS4xMDQgMTYuMTMxLDIwLjE4MiAxNy43MTcsMTguNjY0IEMxNy43MjQsMTguNjU3IDE3Ljc0NiwxOC42NSAxNy43MzksMTguNjQyIEwxNy41NTQsMTguMjUyIEMxNy41NDcsMTguMjM3IDE3LjUzMiwxOC4yNzQgMTcuNTI0LDE4LjI4MSBDMTUuOTQ3LDE5Ljc0OCAxMy43NTEsMjAuNjU1IDExLjUwMywyMC45MjcgQzExLjQ5NSwyMC45MjcgMTEuNDgsMjAuOTI3IDExLjQ4LDIwLjkzNSBMMTEuNzAyLDIxLjM5MiBaIiBmaWxsPSIjQjM1NDU0Ij48L3BhdGg+PC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K",
                        title: "",
                      },
                      {
                        url: "https://samsung.com",
                        image:
                          "data:image/svg+xml,%3Csvg xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' version='1.1' id='svg2' xml:space='preserve' width='7051.4023' height='1080' viewBox='0 0 7051.4024 1080' sodipodi:docname='Samsung_wordmark.svg' inkscape:version='1.1 (c68e22c387, 2021-05-23)'%3E%3Csodipodi:namedview id='namedview11' pagecolor='%23ffffff' bordercolor='%23666666' borderopacity='1.0' inkscape:pageshadow='2' inkscape:pageopacity='0.0' inkscape:pagecheckerboard='0' showgrid='false' fit-margin-top='0' fit-margin-left='0' fit-margin-right='0' fit-margin-bottom='0' inkscape:zoom='0.059829465' inkscape:cx='2849.7664' inkscape:cy='1429.0617' inkscape:window-width='1920' inkscape:window-height='1017' inkscape:window-x='1912' inkscape:window-y='-8' inkscape:window-maximized='1' inkscape:current-layer='svg2'/%3E%3Cdefs id='defs6'%3E%3CclipPath clipPathUnits='userSpaceOnUse' id='clipPath16'%3E%3Cpath d='M 0,166.885 H 628.238 V 0 H 0 Z' id='path14'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg id='g8' transform='matrix(12.944053,0,0,-12.944053,-540.03625,1620.0233)'%3E%3Cg id='g10'%3E%3Cg id='g12' clip-path='url(%23clipPath16)'%3E%3Cg id='g18' transform='translate(558.9328,88.5098)'%3E%3Cpath d='m 0,0 v -11.358 h 7.982 v -11.269 c 0.025,-1.007 -0.03,-2.093 -0.203,-2.962 -0.317,-2.102 -2.314,-5.681 -7.98,-5.681 -5.632,0 -7.593,3.579 -7.933,5.681 -0.143,0.869 -0.204,1.955 -0.204,2.962 v 35.593 c 0,1.259 0.085,2.637 0.352,3.68 0.387,1.897 2.068,5.638 7.743,5.638 5.957,0 7.444,-3.944 7.785,-5.638 0.224,-1.122 0.237,-3.004 0.237,-3.004 V 9.32 h 19.613 v 2.555 c 0,0 0.089,2.666 -0.149,5.154 C 25.769,31.638 13.732,36.26 -0.07,36.26 c -13.827,0 -25.62,-4.665 -27.338,-19.231 -0.155,-1.332 -0.392,-3.728 -0.392,-5.154 v -32.742 c 0,-1.426 0.046,-2.53 0.31,-5.136 1.28,-14.207 13.593,-19.243 27.365,-19.243 13.857,0 26.085,5.036 27.387,19.243 0.231,2.606 0.255,3.71 0.286,5.136 V 0 Z m -135.235,34.165 h -19.696 v -57.613 c 0.031,-1.004 0,-2.132 -0.173,-2.959 -0.411,-1.934 -2.05,-5.656 -7.484,-5.656 -5.364,0 -7.046,3.722 -7.426,5.656 -0.197,0.827 -0.222,1.955 -0.197,2.959 v 57.613 h -19.69 V -21.66 c -0.025,-1.439 0.088,-4.379 0.173,-5.149 1.359,-14.547 12.824,-19.27 27.14,-19.27 14.344,0 25.802,4.723 27.186,19.27 0.109,0.77 0.252,3.71 0.167,5.149 z m -180.97,0 -9.825,-60.876 -9.819,60.876 h -31.771 l -1.685,-77.878 h 19.464 l 0.527,72.094 13.392,-72.094 h 19.748 l 13.404,72.094 0.529,-72.094 h 19.513 l -1.742,77.878 z m -117.631,0 -14.426,-77.878 h 21.037 l 10.871,72.094 10.61,-72.094 h 20.891 l -14.366,77.878 z m 367.435,-62.701 -18.34,62.701 h -28.9 v -77.066 h 19.118 l -1.11,64.707 19.696,-64.707 h 27.717 v 77.066 h -19.243 z m -176.838,42.433 c -0.346,1.538 -0.246,3.172 -0.067,4.026 0.557,2.493 2.232,5.212 7.058,5.212 4.498,0 7.135,-2.804 7.135,-7.012 v -4.762 h 19.2 v 5.428 c 0,16.78 -15.044,19.416 -25.936,19.416 -13.718,0 -24.921,-4.522 -26.967,-17.148 -0.541,-3.436 -0.675,-6.486 0.186,-10.378 3.336,-15.743 30.743,-20.31 34.721,-30.266 0.702,-1.886 0.501,-4.291 0.143,-5.708 -0.596,-2.591 -2.339,-5.197 -7.506,-5.197 -4.846,0 -7.763,2.786 -7.763,6.985 l -0.006,7.474 h -20.666 v -5.941 c 0,-17.215 13.484,-22.409 28.007,-22.409 13.909,0 25.397,4.753 27.24,17.637 0.879,6.657 0.216,10.993 -0.137,12.626 -3.22,16.147 -32.431,21.004 -34.642,30.017 m -253.273,0.191 c -0.377,1.57 -0.289,3.227 -0.079,4.091 0.532,2.481 2.217,5.248 7.128,5.248 4.555,0 7.237,-2.831 7.237,-7.073 v -4.82 h 19.425 v 5.471 c 0,16.941 -15.274,19.641 -26.285,19.641 -13.833,0 -25.136,-4.592 -27.204,-17.309 -0.566,-3.491 -0.663,-6.562 0.155,-10.497 3.372,-15.922 31.05,-20.526 35.077,-30.601 0.754,-1.873 0.526,-4.278 0.152,-5.75 -0.639,-2.618 -2.396,-5.261 -7.606,-5.261 -4.865,0 -7.775,2.834 -7.775,7.091 l -0.027,7.494 h -20.898 v -5.955 c 0,-17.412 13.675,-22.648 28.311,-22.648 14.071,0 25.626,4.795 27.511,17.828 0.937,6.718 0.234,11.09 -0.082,12.748 -3.287,16.345 -32.823,21.186 -35.04,30.302' style='fill:%231428a0;fill-opacity:1;fill-rule:nonzero;stroke:none' id='path20'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
                        title: "",
                      },
                      {
                        url: "https://stripe.com",
                        image:
                          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0NjggMjIyLjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ2OCAyMjIuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiM2MzVCRkY7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MTQsMTEzLjRjMC0yNS42LTEyLjQtNDUuOC0zNi4xLTQ1LjhjLTIzLjgsMC0zOC4yLDIwLjItMzguMiw0NS42YzAsMzAuMSwxNyw0NS4zLDQxLjQsNDUuMwoJCWMxMS45LDAsMjAuOS0yLjcsMjcuNy02LjV2LTIwYy02LjgsMy40LTE0LjYsNS41LTI0LjUsNS41Yy05LjcsMC0xOC4zLTMuNC0xOS40LTE1LjJoNDguOUM0MTMuOCwxMjEsNDE0LDExNS44LDQxNCwxMTMuNHoKCQkgTTM2NC42LDEwMy45YzAtMTEuMyw2LjktMTYsMTMuMi0xNmM2LjEsMCwxMi42LDQuNywxMi42LDE2SDM2NC42eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMwMS4xLDY3LjZjLTkuOCwwLTE2LjEsNC42LTE5LjYsNy44bC0xLjMtNi4yaC0yMnYxMTYuNmwyNS01LjNsMC4xLTI4LjNjMy42LDIuNiw4LjksNi4zLDE3LjcsNi4zCgkJYzE3LjksMCwzNC4yLTE0LjQsMzQuMi00Ni4xQzMzNS4xLDgzLjQsMzE4LjYsNjcuNiwzMDEuMSw2Ny42eiBNMjk1LjEsMTM2LjVjLTUuOSwwLTkuNC0yLjEtMTEuOC00LjdsLTAuMS0zNy4xCgkJYzIuNi0yLjksNi4yLTQuOSwxMS45LTQuOWM5LjEsMCwxNS40LDEwLjIsMTUuNCwyMy4zQzMxMC41LDEyNi41LDMwNC4zLDEzNi41LDI5NS4xLDEzNi41eiIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyMjMuOCw2MS43IDI0OC45LDU2LjMgMjQ4LjksMzYgMjIzLjgsNDEuMyAJIi8+Cgk8cmVjdCB4PSIyMjMuOCIgeT0iNjkuMyIgY2xhc3M9InN0MCIgd2lkdGg9IjI1LjEiIGhlaWdodD0iODcuNSIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5Ni45LDc2LjdsLTEuNi03LjRoLTIxLjZ2ODcuNWgyNVY5Ny41YzUuOS03LjcsMTUuOS02LjMsMTktNS4ydi0yM0MyMTQuNSw2OC4xLDIwMi44LDY1LjksMTk2LjksNzYuN3oiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNDYuOSw0Ny42bC0yNC40LDUuMmwtMC4xLDgwLjFjMCwxNC44LDExLjEsMjUuNywyNS45LDI1LjdjOC4yLDAsMTQuMi0xLjUsMTcuNS0zLjNWMTM1CgkJYy0zLjIsMS4zLTE5LDUuOS0xOS04LjlWOTAuNmgxOVY2OS4zaC0xOUwxNDYuOSw0Ny42eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTc5LjMsOTQuN2MwLTMuOSwzLjItNS40LDguNS01LjRjNy42LDAsMTcuMiwyLjMsMjQuOCw2LjRWNzIuMmMtOC4zLTMuMy0xNi41LTQuNi0yNC44LTQuNgoJCUM2Ny41LDY3LjYsNTQsNzguMiw1NCw5NS45YzAsMjcuNiwzOCwyMy4yLDM4LDM1LjFjMCw0LjYtNCw2LjEtOS42LDYuMWMtOC4zLDAtMTguOS0zLjQtMjcuMy04djIzLjhjOS4zLDQsMTguNyw1LjcsMjcuMyw1LjcKCQljMjAuOCwwLDM1LjEtMTAuMywzNS4xLTI4LjJDMTE3LjQsMTAwLjYsNzkuMywxMDUuOSw3OS4zLDk0Ljd6Ii8+CjwvZz4KPC9zdmc+Cg==",
                        title: "",
                      },
                      {
                        url: "https://ycombinator.com",
                        image:
                          "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTIgNDQiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMCAwaDQzLjg2MnY0NEgwVjBabTEyLjg2NyAxMC43MDcgNy42MDMgMTQuMjI2djkuMjRoMi45MjRWMjUuMDhsNy42MDMtMTQuMzczSDI3Ljc4bC00LjM4NiA4Ljk0NmMtLjI5My40NC0uNTg1Ljg4LS43MzEgMS4zMi0uMDg0LjMzOC0uMjE3LjU3OS0uMzQyLjgwNi0uMDkzLjE2Ny0uMTgxLjMyOC0uMjQzLjUxNC0uMDczLS4wNzMtLjExLS4xODMtLjE0Ni0uMjkzLS4wMzctLjExLS4wNzMtLjIyLS4xNDYtLjI5My0uMDc0LS4xNDctLjExLS4yNTctLjE0Ny0uMzY3YTIuNTI5IDIuNTI5IDAgMCAwLS4xNDYtLjM2N3YtLjE0NmwtLjE0Ni0uMTQ3YTIuODgxIDIuODgxIDAgMCAxLS4xMi0uMjhjLS4wNDgtLjEyNS0uMDgyLS4yMTYtLjE3Mi0uMzA3LS4xNDctLjE0Ni0uMjkzLS4yOTMtLjI5My0uNDRsLTQuMzg2LTguOTQ2aC0zLjUxWiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik02My44OTMgOC41MDdjMi4xOTMgMCA0LjA5NC41ODYgNS41NTYgMS43NmwtMS40NjIgMS43NmMtMS4zMTYtLjg4LTIuNjMyLTEuNDY3LTQuMjQtMS40NjctMi40ODYgMC00LjM4NiAxLjMyLTUuNDEgMy44MTMtLjU4NSAxLjQ2Ny0uODc3IDMuMzc0LS44NzcgNS44NjcgMCAxLjkwNy4yOTIgMy41Mi43MyA0LjY5MyAxLjE3IDIuNzg3IDMuMDcxIDQuMTA3IDUuOTk1IDQuMTA3IDEuNjA5IDAgMy4wNy0uNDQgNC4zODctMS40NjdsMS40NjIgMS45MDdjLTEuOTAxIDEuMTczLTMuOTQ4IDEuNzYtNi4xNDEgMS43Ni0yLjYzMiAwLTQuODI1LTEuMDI3LTYuNTgtMy4yMjctMS43NTQtMi4wNTMtMi40ODUtNC44NC0yLjQ4NS04LjIxMyAwLTMuMzczLjg3Ny02LjAxMyAyLjYzMi04LjIxMyAxLjYwOC0xLjkwNyAzLjgwMS0zLjA4IDYuNDMzLTMuMDhaTTcyLjIyNiAyMy4wMjdjMC0yLjY0LjU4NS00LjY5NCAxLjktNi4xNiAxLjMxNy0xLjQ2NyAyLjkyNS0yLjM0NyA0Ljk3Mi0yLjM0NyAyLjM0IDAgNC4yNC44OCA1LjU1NiAyLjc4NyAxLjAyMyAxLjQ2NiAxLjQ2MiAzLjUyIDEuNDYyIDYuMDEzIDAgMi45MzMtLjg3NyA1LjI4LTIuNDg2IDYuNzQ3LTEuMTcgMS4wMjYtMi42MzEgMS42MTMtNC4zODYgMS42MTMtMi4xOTMgMC0zLjgwMS0uNzMzLTUuMTE3LTIuMzQ3LTEuMzE2LTEuNDY2LTEuOS0zLjY2Ni0xLjktNi4zMDZabTEwLjIzNS00LjI1NGMtLjczMS0xLjMyLTEuNzU1LTIuMDUzLTMuMzYzLTIuMDUzcy0yLjYzMi41ODctMy4zNjMgMS43NmMtLjU4NS44OC0uNzMxIDIuMzQ3LS43MzEgNC4yNTMgMCAyLjQ5NC4yOTIgNC4yNTQgMS4wMjMgNS4yOC43MzEgMS4wMjcgMS43NTUgMS42MTQgMy4yMTcgMS42MTQgMS43NTUgMCAyLjkyNC0uODggMy41MDktMi40OTQuMjkyLS44OC40MzktMi4wNTMuNDM5LTMuNTIuMTQ2LTIuMi0uMTQ3LTMuODEzLS43MzEtNC44NFpNOTAuNzk1IDE5LjA2N2MwLTEuNjE0LS4xNDYtMi45MzQtLjU4NS0zLjk2bDIuNDg2LS41ODdjLjQzOC43MzMuNTg0IDEuNjEzLjU4NCAyLjM0N3YuMTQ2Yy41ODUtLjU4NiAxLjE3LTEuMTczIDIuMDQ3LTEuNjEzIDEuMDI0LS41ODcgMS45LS44OCAyLjc3OC0uODggMS4zMTYgMCAyLjQ4Ni41ODcgMy4yMTcgMS42MTMuMTQ2LjI5NC40MzguNzM0LjU4NSAxLjAyNyAxLjc1NC0xLjc2IDMuMzYyLTIuNjQgNS4xMTctMi42NCAxLjE2OSAwIDIuMTkzLjQ0IDIuOTI0IDEuMTczLjczMS44OCAxLjE3IDEuOTA3IDEuMTcgMy4wOHYxMi4xNzRoLTIuNjMyVjE4LjkyYzAtMS42MTMtLjczMS0yLjM0Ny0yLjA0Ny0yLjM0Ny0uNzMxIDAtMS42MDguMjk0LTIuMzM5Ljg4LS4yOTMuMjk0LS44NzguNzM0LTEuNjA5IDEuMzJsLS4yOTIuMjk0djExLjg4aC0yLjc3OHYtMTEuNDRjMC0xLjAyNy0uMTQ2LTEuNzYtLjQzOS0yLjA1NC0uNDM4LS40NC0uODc3LS41ODYtMS42MDgtLjU4Ni0xLjE3IDAtMi40ODUuNzMzLTQuMDk0IDIuMnYxMi4wMjZoLTIuNDg1VjE5LjA2N1pNMTE1LjY1IDcuOTJsMi42MzItLjU4N2MuMjkzIDEuMTc0LjQzOSAyLjQ5NC40MzkgNC4xMDd2NS40MjdjMS40NjItMS40NjcgMy4wNy0yLjIgNC42NzgtMi4yIDEuOTAxIDAgMy41MDkuNzMzIDQuNTMzIDIuMiAxLjE2OSAxLjQ2NiAxLjc1NCAzLjUyIDEuNzU0IDYuMDEzIDAgMi42NC0uNTg1IDQuNjkzLTEuNzU0IDYuMzA3LTEuMTcgMS42MTMtMi43NzggMi4zNDYtNC42NzkgMi4zNDZhNS4xNSA1LjE1IDAgMCAxLTIuNDg1LS41ODZjLS44NzgtLjQ0LTEuNDYyLS44OC0xLjkwMS0xLjQ2Ny0uMTQ2LjczMy0uMjkyIDEuMzItLjQzOSAxLjc2aC0yLjQ4NWMuMjkyLS43MzMuNDM4LTIuMDUzLjQzOC00LjEwN3YtMTUuNGMtLjE0Ni0xLjc2LS4yOTItMy4wOC0uNzMxLTMuODEzWm00LjI0IDkuOTczYTQuNDU3IDQuNDU3IDAgMCAwLTEuMTY5IDEuMTc0djguMzZjMS4wMjMgMS4zMiAyLjMzOSAxLjkwNiAzLjk0NyAxLjkwNiAxLjMxNiAwIDIuMzQtLjQ0IDIuOTI0LTEuNDY2LjczMi0xLjE3NCAxLjE3LTIuNzg3IDEuMTctNS4xMzQgMC0yLjA1My0uMjkyLTMuNTItMS4wMjMtNC40LS41ODUtLjg4LTEuNjA5LTEuMzItMy4wNzEtMS4zMi0uODc3LS4xNDYtMS45LjE0Ny0yLjc3OC44OFpNMTMzLjQ4NyA5Ljk3M2MwLS41ODYuMTQ2LTEuMDI2LjU4NS0xLjQ2Ni40MzgtLjQ0Ljg3Ny0uNTg3IDEuNDYyLS41ODdzMS4wMjMuMTQ3IDEuNDYyLjU4N2MuNDM4LjQ0LjU4NS44OC41ODUgMS40NjYgMCAuNTg3LS4xNDcgMS4wMjctLjU4NSAxLjQ2Ny0uNDM5LjQ0LS44NzcuNTg3LTEuNDYyLjU4N3MtMS4wMjQtLjE0Ny0xLjQ2Mi0uNTg3Yy0uNDM5LS40NC0uNTg1LS44OC0uNTg1LTEuNDY3Wm0uNTg1IDIxLjEyVjE0Ljk2bDIuNjMxLS40NHYxNi41NzNoLTIuNjMxWk0xNDIuNDA2IDE5LjA2N2MwLTEuMTc0IDAtMS45MDctLjE0Ni0yLjIgMC0uNDQtLjI5Mi0uODgtLjU4NS0xLjYxNGwyLjQ4Ni0uNzMzYy40MzguODguNTg1IDEuNjEzLjU4NSAyLjQ5MyAxLjYwOC0xLjYxMyAzLjM2Mi0yLjQ5MyA1LjExNy0yLjQ5My44NzcgMCAxLjYwOC4xNDcgMi4zMzkuNTg3LjczMS40NCAxLjMxNiAxLjAyNiAxLjYwOCAxLjc2LjI5My41ODYuNDM5IDEuMTczLjQzOSAxLjkwNnYxMi4zMmgtMi40ODV2LTExYzAtMS4zMi0uMTQ3LTIuMi0uNTg1LTIuNjRhMi40MiAyLjQyIDAgMCAwLTEuNzU1LS43MzNjLS41ODUgMC0xLjQ2Mi4yOTMtMi4zMzkuNzMzYTguNTI1IDguNTI1IDAgMCAwLTIuMTkzIDEuNjE0djEyLjAyNmgtMi40ODZWMTkuMDY3Wk0xNjAuMDk2IDE4LjQ4bC0xLjMxNi0xLjc2YzIuMTkzLTEuNDY3IDQuMzg3LTIuMiA2LjcyNi0yLjIgMi4zMzkgMCAzLjgwMS44OCA0LjUzMiAyLjQ5My4yOTMuNTg3LjI5MyAxLjQ2Ny4yOTMgMi43ODd2Ljg4bC0uMTQ3IDUuMjh2LjczM2MwIC44OCAwIDEuNDY3LjE0NyAxLjkwNy4xNDYuNTg3LjU4NSAxLjAyNyAxLjE2OSAxLjMybC0xLjMxNiAxLjc2Yy0xLjE2OS0uNDQtMS45LTEuMTczLTIuMTkzLTIuMzQ3LTEuNDYyIDEuNDY3LTMuMDcgMi4yLTQuNjc4IDIuMi0xLjYwOSAwLTIuOTI0LS40NC0zLjk0OC0xLjMyLS44NzctLjczMy0xLjMxNi0xLjkwNi0xLjMxNi0zLjM3MyAwLTEuOTA3LjczMS0zLjIyNyAyLjE5My00LjI1MyAxLjQ2Mi0xLjAyNyAzLjY1Ni0xLjQ2NyA2LjI4Ny0xLjQ2N2gxLjE3di0xLjE3M2MwLTEuMzItLjE0Ni0yLjItLjU4NS0yLjQ5NC0uNTg1LS41ODYtMS4xNy0uODgtMi4xOTMtLjg4LS44NzcgMC0xLjkwMS4yOTQtMy4wNy43MzQtLjQzOS4yOTMtMS4wMjQuNzMzLTEuNzU1IDEuMTczWm03Ljc0OSA4LjY1My4xNDYtNC4yNTNoLTEuMzE1Yy0yLjM0IDAtMy44MDIuNDQtNC42NzkgMS4zMi0uNTg1LjU4Ny0uODc3IDEuNDY3LS44NzcgMi42NCAwIDEuOTA3Ljg3NyAyLjkzMyAyLjc3OCAyLjkzMyAxLjc1NC0uMTQ2IDMuMDctMS4wMjYgMy45NDctMi42NFpNMTc4LjY2NSAxNC45Nmg0LjA5NGwtLjczMSAyLjA1M2gtMy4zNjN2MTAuNDE0YzAgLjg4LjE0NyAxLjQ2Ni40MzkgMS45MDYuMjkyLjI5NC44NzcuNTg3IDEuNjA4LjU4Ny41ODUgMCAxLjE3LS4xNDcgMS42MDktLjI5M2wuMjkyIDEuNjEzYy0uODc3LjQ0LTEuNzU0LjU4Ny0yLjc3OC41ODctMi40ODUgMC0zLjY1NS0xLjE3NC0zLjY1NS0zLjY2N1YxNy4wMTNoLTIuMTkzVjE0Ljk2aDIuMDQ3di0uMjkzYzAtLjI5NC4xNDYtMS40NjcuMjkyLTMuMzc0di0uNDRsMi42MzItLjU4NmMtLjI5MyAxLjc2LS4yOTMgMy4zNzMtLjI5MyA0LjY5M1pNMTg1LjM5MiAyMy4wMjdjMC0yLjY0LjU4NC00LjY5NCAxLjktNi4xNiAxLjE3LTEuNDY3IDIuOTI0LTIuMzQ3IDQuOTcxLTIuMzQ3IDIuMzQgMCA0LjI0Ljg4IDUuNTU2IDIuNzg3IDEuMDI0IDEuNDY2IDEuNDYyIDMuNTIgMS40NjIgNi4wMTMgMCAyLjkzMy0uODc3IDUuMjgtMi40ODUgNi43NDctMS4xNyAxLjAyNi0yLjYzMiAxLjYxMy00LjM4NiAxLjYxMy0yLjE5NCAwLTMuODAyLS43MzMtNS4xMTgtMi4zNDctMS4xNjktMS40NjYtMS45LTMuNjY2LTEuOS02LjMwNlptMTAuMzgtNC4yNTRjLS43MzEtMS4zMi0xLjc1NC0yLjA1My0zLjM2Mi0yLjA1My0xLjYwOSAwLTIuNjMyLjU4Ny0zLjM2MyAxLjc2LS41ODUuODgtLjczMSAyLjM0Ny0uNzMxIDQuMjUzIDAgMi40OTQuMjkyIDQuMjU0IDEuMDIzIDUuMjguNzMxIDEuMDI3IDEuNzU1IDEuNjE0IDMuMjE3IDEuNjE0IDEuNzU0IDAgMi45MjQtLjg4IDMuNTA5LTIuNDk0LjI5Mi0uODguNDM4LTIuMDUzLjQzOC0zLjUyIDAtMi4yLS4yOTItMy44MTMtLjczMS00Ljg0Wk0yMDQuMTA0IDE4Ljc3M2MwLTEuNDY2LS4xNDYtMi42NC0uNTg0LTMuNTJsMi40ODUtLjczM2MuNDM5Ljg4LjU4NSAxLjYxMy41ODUgMi40OTN2LjI5NGMxLjMxNi0xLjc2IDIuNzc4LTIuNjQgNC41MzItMi42NC4yOTMgMCAuNTg1IDAgLjg3OC4xNDZsLTEuMDI0IDIuNzg3Yy0uMjkyLS4xNDctLjU4NS0uMTQ3LS43MzEtLjE0Ny0uNTg1IDAtMS4zMTYuMTQ3LTEuOTAxLjU4Ny0uNTg0LjQ0LTEuMTY5Ljg4LTEuNDYyIDEuNDY3YTUuNDkzIDUuNDkzIDAgMCAwLS4yOTIgMS43NnYxMC4xMmgtMi40ODZWMTguNzczWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==",
                        title: "",
                      },
                    ].map(({ url, image, title }) => (
                      <div
                        key={url}
                        className="mr-8 h-[54px] min-w-[250px] overflow-hidden"
                      >
                        <a href={url} target="_blank">
                          <Image
                            src={image}
                            alt={title}
                            className="h-[54px] w-[250px]"
                            width="250"
                            height="54"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-row items-center justify-center gap-x-8 overflow-hidden">
                <div className="animate-slide mt-4 flex flex-row items-center justify-center gap-x-8"></div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl py-32">
            <div className="flex flex-col text-center">
              <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                How does Snapify work?
              </span>
              <span className="mt-4 text-[#6c6684]">
                Get started easily. Share video instantly.
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-x-6 xl:mt-16 xl:flex-row xl:gap-x-20">
              <div className="mt-24 flex flex-1 flex-col items-center justify-center gap-8 xl:flex-row xl:items-start xl:gap-12">
                {[
                  {
                    icon: (
                      <Image
                        src={logo}
                        alt="logo"
                        width={48}
                        height={48}
                        unoptimized
                      />
                    ),
                    title: "1. Record a video message",
                    description:
                      "Record a short video of your screen with just a few clicks. No installations required.",
                  },
                  {
                    icon: <ShareIcon className="h-12 w-12" />,
                    title: "2. Share with a link",
                    description:
                      "Simply share a link to your video message. Your recipients can watch it right then and there without the need to create an account or sign in.",
                  },
                  {
                    icon: <CheckCircleIcon className="h-12 w-12" />,
                    title: "3. Get work done",
                    description:
                      "Get feedback, gather opinions, make decisions and more.",
                  },
                ].map(({ title, description, icon }) => (
                  <div
                    key={title}
                    className="flex w-full max-w-[600px] gap-x-4 xl:max-w-none"
                  >
                    <div className="shrink-0">{icon}</div>
                    <div className="flex flex-col">
                      <span className="mb-4 text-[32px]">{title}</span>
                      <span>{description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl py-32">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Ways to Use Snapify
              </span>
              <span className="mt-4 max-w-[75%] text-[#6c6684]">
                Snapify helps you get your message across quickly and clearly
                whether you’re sharing an update with your team, documenting a
                bug, or demoing an app.
              </span>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  title: "Engineering",
                  description:
                    "Review, document, and collaborate across engineering teams using async video.",
                  features: [
                    "To improve code reviews",
                    "To centralize team knowledge",
                    "To collaborate asynchronously",
                  ],
                  image: engineeringUsecase,
                },
                {
                  title: "Support",
                  description:
                    "Discover a whole new way to delight customers and reach resolutions faster.",
                  features: [
                    "To provide visual support",
                    "To improve self-serve content",
                    "To accelerate team onboarding",
                  ],
                  image: supportUsecase,
                },
              ].map(({ title, description, features, image }) => (
                <div
                  key={title}
                  className="mx-auto max-w-[600px] flex-1 overflow-hidden rounded-lg border border-[#eaeaea]"
                >
                  <div className="flex flex-col pb-2 pt-8">
                    <div className="flex flex-col px-8">
                      <span className="mb-3 text-xl font-semibold">
                        {title}
                      </span>
                      <span className="text-[#666]">{description}</span>
                    </div>
                    <div className="mx-8 mt-4 border-t border-[#eaeaea] pt-4">
                      {features.map((feature) => (
                        <div key={feature} className="mb-2 flex flex-row">
                          <CheckIcon className="h-6 w-6" />
                          <span className="text-md ml-4">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Image
                    src={image}
                    width={600}
                    height={575}
                    alt="usecase cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center border-y border-[#eaeaea] bg-[#fafafa]">
          <div className="flex max-w-7xl flex-1 flex-col items-center justify-center py-4 lg:h-[140px] lg:flex-row">
            {[
              { stat: "data served", value: "16GB" },
              { stat: "videos viewed", value: "650" },
              { stat: "videos created", value: "260" },
              { stat: "uptime", value: "99.9%" },
            ].map(({ stat, value }) => (
              <div
                key={stat}
                className="flex flex-1 flex-col py-5 text-center lg:border-r lg:border-[#eaeaea] lg:py-0 lg:last:border-r-0"
              >
                <span className="text-6xl font-bold text-black">{value}</span>
                <span className="pt-2 text-sm font-semibold uppercase text-[#666]">
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>

        <CTA />

        <Footer />
      </div>

      <VideoRecordModal />
      <Paywall />
    </>
  );
};

export default Home;
