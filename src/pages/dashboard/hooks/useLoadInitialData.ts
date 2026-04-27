import { useState, useEffect } from "react";
import { useMockDashboardData } from "./useMockDashboardData";
import type { DashboardDetail } from "@/types/dashboard/DashboardDetail";
import { NotificationUtil } from "@/utils/NotificationUtil";

export const useLoadInitialData = () => {
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardDetail | null>(
    null,
  );
  // TODO: ลบ useMockDashboardData เมื่อ integrate API จริง
  const { getMockDashboardStats } = useMockDashboardData();

  const callGetDashboard = async () => {
    // TODO: เปลี่ยนเป็น API จริง
    const response = await getMockDashboardStats();
    setDashboardData(response.data);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const promises = [callGetDashboard()];

    const results = await Promise.all(promises);

    setIsLoadingInitialData(false);

    if (results.some((result) => !result)) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  const reloadDashboard = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const success = await callGetDashboard();
    setIsLoadingInitialData(false);

    if (!success) {
      NotificationUtil.notifyError({
        title: "An error occurred. Please try again",
      });
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    isLoadingInitialData,
    dashboardData,
    loadInitialData,
    reloadDashboard,
  };
};
