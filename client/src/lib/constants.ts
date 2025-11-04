export enum Directions {
  RTL = "rtl",
  LTR = "ltr",
}

export enum Environments {
  PROD = "production",
  DEV = "development",
}

export enum Routes {
  ROOT = "/",
  AUTH = "auth",
  DASHBOARD = "dashboard",
  VIEW = "view",
}

export enum AuthPages {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
  RESET_PASSWORD = "reset-password",
  VERIFY_EMAIL = "verify-email",
}

export enum DashboardPages {
  BUILDER = "builder",
}

export enum InputTypes {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  DATE = "date",
  TIME = "time",
  DATE_TIME_LOCAL = "datetime-local",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
  TEXTAREA = "textarea",
  FILE = "file",
  IMAGE = "image",
  COLOR = "color",
  RANGE = "range",
  TEL = "tel",
  URL = "url",
  SEARCH = "search",
  MONTH = "month",
  WEEK = "week",
  HIDDEN = "hidden",
  MULTI_SELECT = "multi select",
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum CookieKeys {
  ACCESSTOKEN = "accessToken",
  REFRESHTOKEN = "refreshToken",
}

export enum LocalStorageKeys {
  OTP_TIMER = "otp_timer",
}

export enum SectionsLinks {
  HOME = "home",
  FEATURES = "features",
  TESTIMONIALS = "testimonials",
  CONTACT = "contact",
}

export const menuLinks = [
  {
    label: "Home",
    href: `/#${SectionsLinks.HOME}`,
  },
  {
    label: "Features",
    href: `/#${SectionsLinks.FEATURES}`,
  },
  {
    label: "Testimonials",
    href: `/#${SectionsLinks.TESTIMONIALS}`,
  },
  {
    label: "Contact",
    href: `/#${SectionsLinks.CONTACT}`,
  },
];
