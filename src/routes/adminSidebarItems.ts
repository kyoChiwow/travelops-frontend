import type { ISidebarItem } from "@/types";
import { lazyLoading } from "@/utils/lazyLoading";

const Analytics = lazyLoading("Admin/Analytics");
const AddTour = lazyLoading("Admin/AddTour");
const AddTourType = lazyLoading("Admin/AddTourType");
const AddDivision = lazyLoading("Admin/AddDivision");
const AllToursList = lazyLoading("Admin/AllToursList");

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Division",
        url: "/admin/add-division",
        component: AddDivision,
      },
      {
        title: "Add Tour Type",
        url: "/admin/add-tour-type",
        component: AddTourType,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "All Tours List",
        url: "/admin/all-tours-list",
        component: AllToursList,
      },
    ],
  },
];
