import Header from "@/components/Header";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { getResolvedFeatureFlags } from "@/lib/feature-flags";

export default async function MarketingHeader() {
  const f = await getResolvedFeatureFlags();
  return <Header navFlags={{ showTools: f.nav_tools }} endSlot={<ThemeControls />} />;
}
