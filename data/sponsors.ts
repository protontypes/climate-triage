interface Sponsor {
  name: string;
  logoSmall: string;
  logo?: string;
  url: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "Codeshark",
    logoSmall: "/partners/codeshark_s.png",
    url: "https://codeshark.net"
  },
  {
    name: "Ecosyste.ms",
    logoSmall: "/partners/ecosystems_s.png",
    url: "https://ecosyste.ms"
  },
  {
    name: "Open Corridor",
    logoSmall: "/partners/opencorridor_s.svg",
    url: "https://opencorridor.org"
  },
  {
    name: "LF Energy",
    logoSmall: "/partners/lf-energy_s.svg",
    url: "https://lfenergy.org"
  }
];
