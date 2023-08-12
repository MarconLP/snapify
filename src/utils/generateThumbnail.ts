export default async function generateThumbnail(video: HTMLVideoElement) {
  console.log(video.duration);
  const seekedPromise = new Promise<void>((resolve) => {
    video.addEventListener("seeked", () => {
      resolve();
    });
  });

  video.currentTime = video.duration / 2;

  await seekedPromise;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve) => canvas.toBlob(resolve));
}
