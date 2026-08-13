import AboutCEO from "./AboutCEO";
import AboutEngagement from "./AboutEngagement";
import AboutHero from "./AboutHero";
import AboutPurpose from "./AboutPurpose";
import AboutTeam from "./AboutTeam";

export default function AboutSection() {
  return (
    <div className="bg-background">
      <AboutHero />
      <AboutPurpose />
      <AboutEngagement />
      <AboutCEO />
      <AboutTeam />
    </div>
  );
}
