import { Suspense } from "react";
import DashboardPage from "../../components/DashboardPage";
import DashboardSkeleton from "../../components/DashboardSkeleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}
