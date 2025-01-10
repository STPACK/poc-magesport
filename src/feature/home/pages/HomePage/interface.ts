import { RetailDetailType } from "@/feature/retailManagement/pages/RetailManagementPage/RetailManagementPage";

export interface WithHomePageProps {
  className?: string;
}

export interface HomePageProps {
  className?: string;
  retail: RetailDetailType[];
}
