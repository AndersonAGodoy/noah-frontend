import { Suspense } from "react";
import DashboardPage from "../../components/DashboardPage";
import DashboardSkeleton from "../../components/DashboardSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}
