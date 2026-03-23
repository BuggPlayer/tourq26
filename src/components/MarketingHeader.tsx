import { getResolvedFeatureFlags } from "@/lib/feature-flags";
import Header from "@/components/Header";

export default async function MarketingHeader() {
  const f = await getResolvedFeatureFlags();
  return (
    <Header
      navFlags={{
        showInterviewHub: f.nav_interview_hub,
        showTools: f.nav_tools,
        showContact: f.marketing_contact_form,
      }}
    />
  );
}
