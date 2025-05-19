import type { ViewStyle, TextStyle } from "react-native";
import type { PaymentSuccessCallback, PaymentErrorCallback } from "../../types";

export interface MoolrePayButtonProps {
  amount: number;
  publicKey: string;
  accountNumber: string;
  currency?: string;
  email?: string;
  reference?: string;
  callbackUrl?: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  onSuccess: PaymentSuccessCallback;
  onError: PaymentErrorCallback;
}
