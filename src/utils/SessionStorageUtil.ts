import { SESSION_STORAGE_KEYS } from "@/consts/keys/sessionStorageKeys";
import type { BreadcrumbItem } from "@/types/Global";

export const SessionStorageUtil = {
  saveBreadcrumbJourney(journey: BreadcrumbItem[]) {
    sessionStorage.setItem(
      SESSION_STORAGE_KEYS.BREADCRUMB_JOURNEY,
      JSON.stringify(journey),
    );
  },
  loadBreadcrumbJourney(): BreadcrumbItem[] {
    const journey = sessionStorage.getItem(
      SESSION_STORAGE_KEYS.BREADCRUMB_JOURNEY,
    );
    return journey ? (JSON.parse(journey) as BreadcrumbItem[]) : [];
  },
  deleteBreadcrumbJourney() {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.BREADCRUMB_JOURNEY);
  },
  removeLastBreadcrumbJourneyItem() {
    const journey = this.loadBreadcrumbJourney();
    if (journey.length > 0) {
      journey.pop();
      this.saveBreadcrumbJourney(journey);
    }
  },
};
