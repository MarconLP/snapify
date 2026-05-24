export default async function generateThumbnail(
  video: HTMLVideoElement,
  time?: number
): Promise<Blob> {

  // Wait until the video metadata is loaded
  if (video.readyState < 1) {
    await new Promise((resolve) => {
      video.addEventListener("loadedmetadata", resolve, {
        once: true,
      });
    });
  }

  // Pause the video before seeking to ensure it doesn't interfere with thumbnail generation
  video.pause();

  // Use the provided time if available Otherwise use the middle of the video
  const thumbnailTime = time ?? video.duration / 2;

  
  // "seeked" fires when the video successfully jumps to the requested time
  const seekedPromise = new Promise<void>((resolve) => {
    video.addEventListener(
      "seeked",
      () => {
        resolve();
      },
      {
        // Automatically remove listener after running once
        once: true,
      }
    );
  });

  // Move the video to the chosen timestamp
  video.currentTime = thumbnailTime;

  // Wait until the video finishes seeking
  await seekedPromise;

  
  // Canvas will be used to capture the video frame
  const canvas = document.createElement("canvas");


  // Smaller size = faster performance + smaller file
  canvas.width = 320;
  canvas.height = 180;

  // Get the 2D drawing context from canvas
  const ctx = canvas.getContext("2d");

  // Ensure the browser supports canvas drawing
  if (!ctx) {
    throw new Error("Canvas is not supported");
  }

  // Draw the current video frame onto the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  
  // JPEG format with 80% quality
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.8);
  });

  // Ensure blob creation succeeded
  if (!blob) {
    throw new Error("Failed to generate thumbnail");
  }

  // Return the thumbnail image blob
  return blob;
}