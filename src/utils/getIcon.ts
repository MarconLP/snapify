import googleButtonIcon from "../assets/Google button icon.svg";
import githubButtonIcon from "../assets/Github button icon.svg";

const icons: { [key: string]: any } = {
  Google: googleButtonIcon,
  GitHub: githubButtonIcon,
};

export default function getIcon(iconName: string) {
  return icons[iconName];
}
