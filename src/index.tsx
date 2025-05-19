export function multiply(a: number, b: number): number {
  return a * b;
}

export { default as MoolrePayButton } from "./components/MoolrePayButton";
export { isMoolreCallback, parseMoolreCallback } from "./utils/deepLinkHandler";
export type { MoolrePayButtonProps } from "./components/MoolrePayButton.types";
export type { PaymentParams, PaymentResponse } from "./services/api";
