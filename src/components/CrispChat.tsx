import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { env } from "~/env.mjs";

export default function CrispChat() {
  useEffect(() => {
    if (env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
      Crisp.configure(env.NEXT_PUBLIC_CRISP_WEBSITE_ID);
    }
  }, []);

  return null;
}
