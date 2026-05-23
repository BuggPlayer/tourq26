import Header from "@/components/Header";
import { getResolvedFeatureFlags } from "@/lib/feature-flags";

export default async function MarketingHeader() {
  const f = await getResolvedFeatureFlags();
  return <Header navFlags={{ showTools: f.nav_tools }} />;
}
