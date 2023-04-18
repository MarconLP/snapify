import React, { useState, useRef, Fragment, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
  };

  const handleStop = () => {
    if (recorderRef.current === null) return;
    recorderRef.current.stopRecording(() => {
      if (recorderRef.current) {
        setBlob(recorderRef.current.getBlob());
        steam?.getTracks().map((track) => track.stop());
      }
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
      invokeSaveAsDialog(blob);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          type="button"
          className="mt-4 inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
          onClick={() => void handleRecording()}
        >
          start
        </button>
        <button
          type="button"
          className="mx-4 mt-4 inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
          onClick={handleStop}
        >
          stop
        </button>
        <button
          type="button"
          className="mx-4 mt-4 inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
          onClick={handlePause}
        >
          {pause ? "resume" : "pause"}
        </button>
        <button
          type="button"
          className="mt-4 inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
          onClick={handleSave}
        >
          save
        </button>
        <div className="top-16 mb-52 w-72">
          <Listbox value={selectedDevice} onChange={setSelectedDevice}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {audioDevices.map((audioDevice, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
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
        </div>
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: "700px", margin: "1em" }}
          />
        )}
      </header>
    </div>
  );
}
