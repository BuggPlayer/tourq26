import { FullStackStyleHubLanding } from "@/components/hub/FullStackStyleHubLanding";
import { getHubLandingStats } from "@/lib/hub/hub-landing-stats";

export default async function HubLandingPage() {
  const stats = await getHubLandingStats();
  return <FullStackStyleHubLanding stats={stats} />;
}
