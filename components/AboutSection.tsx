import Link from "next/link";
import config from "../app/config.mts";
import { SectionTitle } from "./SectionTitle";

export const AboutSection = () => {
  return (
    <div>
      <SectionTitle className="mb-2" text="About" />
      <h1 className="hidden text-lg font-bold">{config.meta.title}</h1>
      <p className="text-gray-900 dark:text-silver-500">
        Harness the power of open source collaboration to tackle environmental challenges such as
        climate change, clean energy, biodiversity, and natural resource conservation. ClimateTriage
        brings you all the impactful projects that welcome new developers with Help Wanted and Good
        First Issues. Whether you're an experienced developer, a scientist, or a newcomer looking to
        contribute, we'll connect you with opportunities to use your skills to create a sustainable
        future. You have developed a documented and thriving open source project in the field of
        sustainability and you are now looking for new contributors to help you build a stable
        community? Simply add your project to{" "}
        <Link href="https://opensustain.tech/" target="_blank" rel="noreferrer nofollow">
          OpenSustain.tech
        </Link>{" "}
        and label your issues as 'Good First Issue' or 'Help Wanted'.{" "}
        <Link href="https://ecosyste.ms/" target="_blank" rel="noreferrer nofollow">
          Ecosyste.ms
        </Link>{" "}
        will do the rest in the background and your project should soon appear on this website.
        Still interested but not sure how to get started? Read more about this project and how you
        can get involved in a impactful way.
      </p>
    </div>
  );
};
