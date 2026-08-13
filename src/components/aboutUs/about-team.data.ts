export type TeamMember = {
  id: number;
  key: string;
  image: string;
  email?: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    key: "mansourRoshan",
    image: "/about/team/1.jpg",
    email: "m.roshan@atiabzarpishro.com",
  },
  {
    id: 2,
    key: "javadGhomi",
    image: "/about/team/2.jpg",
    email: "j.ghomi@atiabzarpishro.com",
  },
  {
    id: 3,
    key: "miladSadeh",
    image: "/about/team/3.jpg",
    email: "milad.sadeh@atiabzarpishro.com",
  },
  {
    id: 4,
    key: "ehsanAraghi",
    image: "/about/team/4.jpg",
  },
  {
    id: 5,
    key: "kianAdinelou",
    image: "/about/team/5.jpg",
    email: "Kian.adinelou@atiabzarpishro.com",
  },
  {
    id: 6,
    key: "ehsanSalem",
    image: "/about/team/6.jpg",
    email: "Ehsan.Salem@atiabzarpishro.com",
  },
];
