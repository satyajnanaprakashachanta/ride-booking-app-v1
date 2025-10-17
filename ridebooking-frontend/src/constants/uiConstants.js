// UI Constants for the Ride Booking Application
// This file contains all text constants and configurations to improve maintainability

export const MESSAGES = {
  SUCCESS_PREFIX: "Success: ",
  ERROR_PREFIX: "Error: ",
  WARNING_PREFIX: "WARNING: ",
  LOADING: "Loading...",
};

export const ADMIN_TABS = {
  STATISTICS: "statistics",
  ACTIVITIES: "activities", 
  USERS: "users",
  SUSPICIOUS: "suspicious"
};

export const TAB_LABELS = {
  [ADMIN_TABS.STATISTICS]: "Statistics",
  [ADMIN_TABS.ACTIVITIES]: "Ride Activities", 
  [ADMIN_TABS.USERS]: "User Management",
  [ADMIN_TABS.SUSPICIOUS]: "Suspicious Activities"
};

export const STATUS_LABELS = {
  REQUESTED: "Pending",
  ACCEPTED: "Accepted", 
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

export const COLORS = {
  SUCCESS_BG: "#d4edda",
  SUCCESS_TEXT: "#155724", 
  SUCCESS_BORDER: "#c3e6cb",
  ERROR_BG: "#f8d7da",
  ERROR_TEXT: "#721c24",
  ERROR_BORDER: "#f5c6cb"
};

export const BUTTON_LABELS = {
  BLOCK: "Block",
  UNBLOCK: "Unblock", 
  DELETE: "Delete",
  REFRESH: "Refresh",
  LOGIN: "Login",
  SIGN_IN: "Sign In",
  LOGOUT: "Logout",
  BOOK_RIDE: "Book a Ride",
  START_DRIVING: "Start Driving", 
  BOOKING_HISTORY: "Booking History",
  REQUEST_RIDE: "Request Ride",
  CHECK_STATUS: "Check Status",
  HOME: "Home"
};

export const PAGE_TITLES = {
  ADMIN_DASHBOARD: "Admin Dashboard",
  BOOK_RIDE: "Book a Ride", 
  DRIVER_DASHBOARD: "Driver Dashboard",
  BOOKING_HISTORY: "Booking History",
  LOGIN: "Login",
  WELCOME: "Welcome!"
};
