export type PaymentSuccessCallback = (reference: string) => void;
export type PaymentErrorCallback = (error: {
  code: string;
  message: string;
}) => void;
