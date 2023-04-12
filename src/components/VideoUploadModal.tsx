import { ChangeEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "~/utils/api";
import axios from "axios";

export default function VideoUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const getSignedUrl = api.video.getUploadUrl.useMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleSubmit = async (): Promise<void> => {
    if (!file) return;
    const presignedUrl = await getSignedUrl.mutateAsync({ key: file.name });
    await axios
      .put(presignedUrl, file.slice(), {
        headers: { "Content-Type": file.type },
      })
      .then((response) => {
        console.log(response);
        console.log("Successfully uploaded ", file.name);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <span
        onClick={openModal}
        className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]"
      >
        New video
      </span>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <label className="flex h-32 w-full min-w-[300px] cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 px-4 transition hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2 text-white">
                        {file ? (
                          <span className="font-medium">{file.name}</span>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="font-medium">
                              {"Drop files to Attach, or browse"}
                            </span>
                          </>
                        )}
                      </span>
                      <input
                        onChange={handleFileChange}
                        type="file"
                        name="file_upload"
                        className="hidden"
                      />
                    </label>
                    <button
                      className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                      onClick={() => void handleSubmit()}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
