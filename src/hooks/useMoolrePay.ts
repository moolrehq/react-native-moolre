import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native";
import { initiatePayment, verifyPayment } from "../services/api";

export const useMoolrePay = ({
  publicKey,
  accountNumber,
  onSuccess,
  onError,
}: {
  publicKey: string;
  accountNumber: string;
  onSuccess: (reference: string) => void;
  onError: (error: { code: string; message: string }) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentReference, setCurrentReference] = useState<string | null>(null);

  // const handlePayment = useCallback(
  //   async (params: { amount: number; currency: string; email?: string }) => {
  //     setIsProcessing(true);
  //     try {
  //       const response = await initiatePayment({
  //         ...params,
  //         publicKey,
  //         accountNumber,
  //       });

  //       setCurrentReference(response.reference);
  //       return response;
  //     } catch (error) {
  //       onError({
  //         code: "INITIATION_FAILED",
  //         message: error instanceof Error ? error.message : "Unknown error",
  //       });
  //       throw error;
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   },
  //   [publicKey, accountNumber, onError]
  // );

  const handlePayment = useCallback(
    async (params: {
      amount: number;
      currency: string;
      email?: string;
      reference?: string;
      callback?: string;
    }) => {
      setIsProcessing(true);
      try {
        const response = await initiatePayment({
          ...params,
          publicKey,
          accountNumber,
        });

        setCurrentReference(response.reference);
        return response;
      } catch (error) {
        onError({
          code: "INITIATION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [publicKey, accountNumber, onError]
  );

  const verifyTransaction = useCallback(
    async (reference: string) => {
      try {
        const verification = await verifyPayment(
          reference,
          publicKey,
          accountNumber
        );

        if (verification.data.status === 1) {
          onSuccess(reference);
          return true;
        }
        return false;
      } catch (error) {
        onError({
          code: "VERIFICATION_FAILED",
          message:
            error instanceof Error ? error.message : "Verification failed",
        });
        return false;
      }
    },
    [publicKey, accountNumber, onSuccess, onError]
  );

  // Deep link handler
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (!url.includes("moolre://payment-callback")) return;

      try {
        const params = new URLSearchParams(url.split("?")[1]);
        const reference = params.get("reference");

        if (reference) {
          await verifyTransaction(reference);
        } else {
          onError({
            code: "MISSING_REFERENCE",
            message: "Payment reference not found",
          });
        }
      } catch (error) {
        onError({
          code: "CALLBACK_ERROR",
          message: "Error processing payment callback",
        });
      }
    };

    // Change the Linking event listener code to:
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove(); // New way to remove listener
  }, [verifyTransaction]);

  return {
    handlePayment,
    verifyTransaction,
    isProcessing,
    currentReference,
  };
};
