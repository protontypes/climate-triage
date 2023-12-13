import Link from "next/link";

export default function Page() {
  return (
    <article className="prose mb-10 dark:prose-invert lg:prose-lg">
      <h1>
        Discover a meaningful way to contribute to open source projects focused on climate technology and sustainability.
      </h1>
      <p className="lead">
        Harness the power of open source collaboration to tackle environmental challenges such as
        climate change, clean energy, biodiversity, and natural resource conservation. ClimateTriage
        brings you all the impactful projects that welcome new developers with Help Wanted and Good
        First Issues. Whether you're an experienced developer, a scientist, or a newcomer looking to
        contribute, we'll connect you with opportunities to use your skills to create a sustainable
        future.
      </p>

      <h2>The Importance of Open Source in Environmental Sustainability</h2>
      <p>
        Climate change and environmental sustainability are challenges that require reliable
        figures. Without software, we are unable to assess the state of our environment and how
        future technologies will affect it. How can we transparently and collaboratively decide what
        a sustainable future looks like without being influenced by manipulated calculations? The
        open source movement has shown how the software building blocks of our digital
        infrastructure can be developed collaboratively, securely, and transparently to us as users.
        This success story of collaborative innovation can now be applied to one of the greatest
        challenges of our time: preserving natural resources and stability for future generations.
      </p>

      <h2>Join the OpenSustain.tech Community</h2>
      <p>
        Have you have developed a documented and thriving open source project in the field of
        sustainability? Are you are looking for new contributors to help you build a stable
        community? Simply add your project to OpenSustain.tech and label your issues as 'Good First
        Issue' or 'Help Wanted'. Ecosyste.ms will do the rest in the background and your project
        should soon appear on this website. Still interested but not sure how to get started? Read
        more about this project and how you can get involved in a impactful way.
      </p>

      <h2>Collaborative Efforts in Sustainable Development</h2>
      <p>
        Citizens, engineers, scientists, and developers from all sectors have shared their
        calculations, tools, and blueprints for a sustainable future. To support this emerging open
        source ecosystem, the OpenSustain.tech website lists all the active and high quality projects.
      </p>

      <h2>ClimateTriage: Your Gateway to Sustainability Projects</h2>
      <p>
        With ClimateTriage, we are now taking the next step and offering experienced developers,
        scientists or newcomers an entry point to join this movement. With the help of Ecosyste.ms,
        an open source analytics platform, we collected all projects listed on OpenSustain.tech with
        'Help Wanted' and 'Good First Issues'.
      </p>

      <h2>Building Long-Term Relationships in Open Source Projects</h2>
      <p>
        Our goal is not to solve individual issues within the projects, but to build long-term
        relationships between the projects and new community members. Therefore, we highly recommend
        that all new contributors first comment their interest in each issue before jumping in and
        fixing it. Many of the projects require specialist domain knowledge and are directed at
        scientists and experts in the field. However, if you are interested in a long-term career in
        one of these domains, we have listed a number of beginner-friendly{" "}
        <Link href="https://opensustain.tech/education/">
          open source programming courses with sustainable use cases here
        </Link>
        .
      </p>

      <h2>Collaborative Partnerships</h2>
      <p>
        This development is a collaboration of{" "}
        <Link href="https://codeshark.net/" target="_blank">
          Codeshark
        </Link>
        {", "}
        <Link href="https://ecosyste.ms/" target="_blank">
          Ecosyste.ms
        </Link>
        {", "}
        OpenCorridor and{" "}
        <Link href="https://opensustain.tech/" target="_blank">
          Open Sustainable Technology
        </Link>{" "}
        as part of the Linux Foundation Energy.
      </p>
    </article>
  );
}
