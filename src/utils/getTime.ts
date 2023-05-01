export const getTime = (timestamp: Date): string => {
  const delta = Math.round(
    (+new Date() - new Date(timestamp).getTime()) / 1000
  );

  const minute = 60,
    hour = minute * 60,
    day = hour * 24;

  let timeString = "";

  if (delta < 60) {
    timeString = "Just now";
  } else if (delta < 2 * minute) {
    timeString = "1 min";
  } else if (delta < hour) {
    timeString = Math.floor(delta / minute).toString() + " mins";
  } else if (Math.floor(delta / hour) === 1) {
    timeString = "1 hour ago";
  } else if (delta < day) {
    timeString = Math.floor(delta / hour).toString() + " hours ago";
  } else if (delta < day * 2) {
    timeString = "yesterday";
  } else if (delta < day * 7) {
    timeString = Math.floor(delta / day).toString() + " days ago";
  } else {
    const date = new Date(timestamp);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    timeString =
      `${
        months[date.getMonth()] || ""
      } ${date.getDate()} ${date.getFullYear()} ` +
      `at ${
        date.getHours().toString().length === 1
          ? "0" + date.getHours().toString()
          : date.getHours()
      }:${
        date.getMinutes().toString().length === 1
          ? "0" + date.getMinutes().toString()
          : date.getMinutes()
      }`;
  }

  return timeString;
};
