import config from "../app/config.mts";
import { SectionTitle } from "./SectionTitle";

export const AboutSection = () => {
  return (
    <div>
      <SectionTitle className="mb-2" text="About" />
      <h1 className="hidden text-lg font-bold">{config.meta.title}</h1>
      <p className="text-gray-900 dark:text-silver-500">
        <strong>{config.meta.title}</strong> is a unique platform dedicated to harnessing the power
        of open source collaboration in tackling environmental challenges. We provide a curated
        directory of impactful projects focused on climate change, energy, biodiversity, and natural
        resource management. Whether you're a seasoned developer or a newcomer eager to contribute,
        our platform connects you with meaningful opportunities to apply your skills towards
        creating a sustainable future. Join our community of forward-thinking developers and make
        your first impactful contribution today!
      </p>
    </div>
  );
};
