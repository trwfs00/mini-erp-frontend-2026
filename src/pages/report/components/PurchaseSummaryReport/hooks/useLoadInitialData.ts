import { useEffect, useState } from "react";
import { useDidUpdate } from "@mantine/hooks";
import { useDeepEqualDidUpdate } from "@/hooks/basic/useDeepEqualDidUpdate";
import { ReportService } from "@/services/ReportService";
import { usePaginationState } from "@/hooks/pagination/usePaginationState";
import { useTableSort } from "@/hooks/table/useTableSort";
import { compareValues } from "@/utils/SortUtil";
import { NotificationUtil } from "@/utils/NotificationUtil";
import type {
  PurchaseSummaryReport,
  PurchaseSummaryRow,
} from "@/types/report/PurchaseSummary";

type Params = {
  month: string;
};

export const useLoadInitialData = ({ month }: Params) => {
  const [report, setReport] = useState<PurchaseSummaryReport | null>(null);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const pagination = usePaginationState();
  const sortHandler = useTableSort("created_at", "desc");
  const { limit, page, setTotalCount, setTotalPage, setPage } = pagination;
  const { sortBy, orderBy } = sortHandler;

  const callGetReport = async (): Promise<boolean> => {
    const response = await ReportService.getPurchaseSummary({ month });
    if (!response.ok) return false;
    const data = response.data;
    setReport(data);
    setTotalCount(data.rows.length);
    setTotalPage(Math.ceil(data.rows.length / limit) || 1);
    return true;
  };

  const loadInitialData = async (): Promise<void> => {
    setIsLoadingInitialData(true);
    const success = await callGetReport();
    setIsLoadingInitialData(false);
    if (!success) {
      NotificationUtil.notifyError({
        title: "Failed to load purchase summary",
      });
    }
  };

  const reloadReport = async (): Promise<boolean> => {
    setIsReloading(true);
    const success = await callGetReport();
    setIsReloading(false);
    if (!success) {
      NotificationUtil.notifyError({
        title: "Failed to load purchase summary",
      });
    }
    return success;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useDeepEqualDidUpdate(() => {
    if (page > 1) {
      setPage(1);
    } else {
      reloadReport();
    }
  }, [month]);

  useDidUpdate(() => {
    if (report) {
      setTotalPage(Math.ceil(report.rows.length / limit) || 1);
    }
  }, [limit]);

  const rows: PurchaseSummaryRow[] = (() => {
    if (!report) return [];
    let sorted = [...report.rows];
    if (sortBy && orderBy) {
      sorted.sort((a, b) => {
        const cmp = compareValues(
          a[sortBy as keyof PurchaseSummaryRow],
          b[sortBy as keyof PurchaseSummaryRow],
        );
        return orderBy === "asc" ? cmp : -cmp;
      });
    }
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  })();

  return {
    isLoadingInitialData,
    isReloading,
    report,
    rows,
    totals: report?.totals,
    pagination,
    sortHandler,
    reloadReport,
  };
};
