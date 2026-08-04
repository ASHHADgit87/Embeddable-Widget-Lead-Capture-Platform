import type { WidgetType } from "@prisma/client";

export interface WidgetField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
}

export interface WidgetDisplayOptions {
  position?: "inline" | "bottom-right" | "bottom-left" | "center-modal";
  theme?: "light" | "dark";
  delaySeconds?: number;
}

export interface WidgetPublicConfig {
  id: string;
  type: WidgetType;
  title: string;
  description: string | null;
  buttonText: string;
  fields: WidgetField[];
  displayOptions: WidgetDisplayOptions | null;
  honeypotFieldName: string;
  bundleVersion: number;
}

export interface GeoResult {
  country: string | null;
  region: string | null;
  city: string | null;
  provider: string | null;
  failed: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
