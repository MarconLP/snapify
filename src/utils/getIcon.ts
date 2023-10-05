const icons: { [key: string]: string } = {
  Google:
    "https://www.svgrepo.com/show/475656/google-color.svg",
  GitHub:
    "https://www.svgrepo.com/show/512317/github-142.svg"
};

export default function getIcon(iconName: string) {
    return icons[iconName];
}
