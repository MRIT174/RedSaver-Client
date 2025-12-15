import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import VolunteerDashboardLayout from "../layouts/VolunteerDashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import SearchDonors from "../pages/SearchDonors";
import DonationRequests from "../pages/DonationRequests";
import FundingPage from "../pages/FundingPage";
import GiveFund from "../pages/GiveFund";

import DashboardHome from "../pages/Dashboard/DashboardHome";
import Profile from "../pages/Dashboard/Profile";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";

import AdminDashboardHome from "../pages/AdminDashboard/AdminDashboardHome";
import AllUsers from "../pages/AdminDashboard/AllUsers";
import AllDonationRequests from "../pages/AdminDashboard/AllDonationRequests";

import DashboardHomePage from "../pages/VolunteerDashboard/DashboardHomePage";
import AllBloodDonationRequestPage from "../pages/VolunteerDashboard/AllBloodDonationRequestPage";

export default createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search-donors", element: <SearchDonors /> },
      { path: "/donation-requests", element: <DonationRequests /> },
      { path: "/funding", element: <FundingPage /> },
      { path: "/give-fund", element: <GiveFund /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={["donor"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "", element: <DashboardHome /> },
          { path: "profile", element: <Profile /> },
          { path: "my-donation-requests", element: <MyDonationRequests /> },
          {
            path: "create-donation-request",
            element: <CreateDonationRequest />,
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminDashboardLayout />,
        children: [
          { path: "", element: <AdminDashboardHome /> },
          { path: "all-users", element: <AllUsers /> },
          {
            path: "all-blood-donation-request",
            element: <AllDonationRequests />,
          },
        ],
      },
    ],
  },

  {
    path: "/volunteer",
    element: <ProtectedRoute allowedRoles={["volunteer"]} />,
    children: [
      {
        element: <VolunteerDashboardLayout />,
        children: [
          { path: "", element: <DashboardHomePage /> },
          {
            path: "all-blood-donation-request",
            element: <AllBloodDonationRequestPage />,
          },
        ],
      },
    ],
  },
]);
