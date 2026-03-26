import { getResolvedFeatureFlags } from "@/lib/feature-flags";
import Header from "@/components/Header";

export default async function MarketingHeader() {
  const f = await getResolvedFeatureFlags();
  return (
    <Header navFlags={{ showTools: f.nav_tools }} />
  );
}
