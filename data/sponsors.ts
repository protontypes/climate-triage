interface Sponsor {
  name: string;
  logoSmall: string;
  logo?: string;
  url: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "Codeshark",
    logoSmall: "/partners/codeshark_s.svg",
    url: "https://codeshark.net"
  },
  {
    name: "Ecosyste.ms",
    logoSmall: "/partners/ecosystems_s.png",
    url: "https://ecosyste.ms"
  },
  {
    name: "GitHub",
    logoSmall: "/partners/github-mark.svg",
    url: "https://github.com/social-impact"
  },
  {
    name: "Ground Truth",
    logoSmall: "/partners/ground_truth.png",
    url: "https://groundtruth.app/"
  }
];
