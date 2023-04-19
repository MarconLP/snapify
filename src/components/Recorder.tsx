import React, { useState, useRef, Fragment, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MicrophoneIcon, PauseIcon } from "@heroicons/react/24/outline";
import { ResumeIcon, TrashIcon } from "@radix-ui/react-icons";
import { StopIcon } from "@heroicons/react/24/solid";
import StopTime from "~/components/StopTime";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Recorder() {
  const [steam, setStream] = useState<null | MediaStream>(null);
  const [blob, setBlob] = useState<null | Blob>(null);
  const refVideo = useRef<null | HTMLVideoElement>(null);
  const recorderRef = useRef<null | RecordRTC>(null);
  const [pause, setPause] = useState<boolean>(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(
    null
  );
  const [step, setStep] = useState<"pre" | "in" | "post">("pre");
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const apiUtils = api.useContext();
  const getSignedUrl = api.video.getUploadUrl.useMutation();

  const handleRecording = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 1920,
        height: 1080,
        frameRate: 30,
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    });

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedDevice?.deviceId },
    });

    const mediaStream = new MediaStream();
    micStream.getAudioTracks().forEach((track) => mediaStream.addTrack(track));
    screenStream
      .getVideoTracks()
      .forEach((track) => mediaStream.addTrack(track));

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, { type: "video" });
    recorderRef.current.startRecording();

    setStep("in");
  };

  const handleStop = () => {
    if (recorderRef.current === null) return;
    recorderRef.current.stopRecording(() => {
      if (recorderRef.current) {
        setBlob(recorderRef.current.getBlob());
        steam?.getTracks().map((track) => track.stop());
      }
    });

    setStep("post");
  };

  const handleDelete = () => {
    if (recorderRef.current === null) return;
    setBlob(null);
    recorderRef.current.stopRecording(() => {
      steam?.getTracks().map((track) => track.stop());
    });
  };

  const handlePause = () => {
    if (recorderRef.current) {
      console.log(recorderRef.current?.state);
      if (pause) {
        recorderRef.current?.resumeRecording();
      } else {
        recorderRef.current.pauseRecording();
      }
      setPause(!pause);
    }
  };

  useEffect(() => {
    async function getAudioDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setAudioDevices(audioDevices);
        if (audioDevices[0]) setSelectedDevice(audioDevices[0]);
      } catch (error) {
        console.error(error);
      }
    }

    void getAudioDevices();
  }, []);

  const handleSave = () => {
    if (blob) {
      const dateString =
        "Recording - " + dayjs().format("D MMM YYYY") + ".webm";
      invokeSaveAsDialog(blob, dateString);
    }
  };

  const handleUpload = async () => {
    if (!blob) return;
    const dateString = "Recording - " + dayjs().format("D MMM YYYY") + ".webm";
    setSubmitting(true);
    const { signedUrl, id } = await getSignedUrl.mutateAsync({
      key: dateString,
    });
    await axios
      .put(signedUrl, blob.slice(), {
        headers: { "Content-Type": "video/webm" },
      })
      .then(() => {
        void router.push("share/" + id);
      })
      .catch((err) => {
        console.error(err);
      });
    setSubmitting(false);
    void apiUtils.video.getAll.invalidate();
  };

  return (
    <div>
      {step === "pre" ? (
        <div className="w-full">
          <Listbox value={selectedDevice} onChange={setSelectedDevice}>
            <div className="relative mt-1">
              <Listbox.Button className="relative flex w-full cursor-default flex-row items-center justify-start rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
                <MicrophoneIcon
                  className="mr-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="block truncate">
                  {selectedDevice?.label ?? "No device selected"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {audioDevices.map((audioDevice, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                          active ? "bg-gray-200" : ""
                        }`
                      }
                      value={audioDevice}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {audioDevice.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <button
            type="button"
            className="mt-4 flex inline-flex w-full items-center items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
            onClick={() => void handleRecording()}
          >
            <span>Start recording</span>
          </button>
        </div>
      ) : null}
      {step === "in" ? (
        <div className="flex flex-row items-center justify-center">
          <div
            onClick={handleStop}
            className="flex cursor-pointer flex-row items-center justify-center rounded pr-2 text-lg hover:bg-gray-200"
          >
            <StopIcon className="h-8 w-8 text-[#ff623f]" aria-hidden="true" />
            <StopTime running={!pause} />
          </div>
          <div className="mx-2 h-6 w-px bg-[#E7E9EB]"></div>
          <div
            onClick={handlePause}
            className="cursor-pointer rounded p-1 hover:bg-gray-200"
          >
            {pause ? (
              <ResumeIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <PauseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            )}
          </div>
          <div
            onClick={handleDelete}
            className="ml-1 cursor-pointer rounded p-1 hover:bg-gray-200"
          >
            <TrashIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      ) : null}
      {step === "post" ? (
        <div>
          {blob && (
            <video
              src={URL.createObjectURL(blob)}
              controls
              autoPlay
              ref={refVideo}
              style={{ width: "700px", margin: "1em" }}
            />
          )}
          <button
            onClick={handleSave}
            className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download
          </button>
          <button
            onClick={() => void handleUpload()}
            className="ml-2 mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Upload
          </button>
        </div>
      ) : null}
    </div>
  );
}
