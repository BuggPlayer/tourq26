import { revalidatePath } from "next/cache";

export function revalidateInterviewHubContent() {
  revalidatePath("/hub", "layout");
  revalidatePath("/hub/candidate", "layout");
  revalidatePath("/hub/candidate/nodejs-interview");
  revalidatePath("/hub/candidate/interview", "layout");
}
