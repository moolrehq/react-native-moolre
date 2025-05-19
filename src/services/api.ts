export interface PaymentParams {
  amount: number;
  currency: string;
  publicKey: string;
  accountNumber: string;
  email?: string;
  reference?: string;
  callback?: string;
}

export interface PaymentResponse {
  authorization_url: string;
  reference: string;
  status: boolean;
}

export interface VerificationData {
  status: number;
  reference: string;
  amount: number;
  currency: string;
}

export interface VerificationResponse {
  data: VerificationData;
  status: boolean;
}

const MOOLRE_API_URL = "https://api.moolre.com/embed/src/start";

export const initiatePayment = async ({
  amount,
  currency,
  publicKey,
  accountNumber,
  email = "",
  reference = `${Date.now()}`,
  callback = "moolre://payment-callback",
}: PaymentParams & { callback?: string }): Promise<PaymentResponse> => {
  try {
    const json_data = {
      state: "starter",
      accountnumber: accountNumber,
      reference: reference,
      email: email,
      amount: amount,
      currency: currency,
      callback: callback,
      tx_source: "react-native-sdk",
    };
    const response = await fetch(MOOLRE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Pubkey": publicKey,
      },
      body: JSON.stringify(json_data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message
          ? Array.isArray(errorData.message)
            ? errorData.message.join(", ")
            : errorData.message
          : "Payment initiation failed"
      );
    }

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Payment initiation failed");
    }

    return {
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      status: data.status,
    };
  } catch (error) {
    console.error("Moolre API Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Network error during payment initiation"
    );
  }
};

/**
 * Verifies a payment transaction with Moolre API
 * @param reference - The transaction reference to verify
 * @param publicKey - Merchant public key
 * @param accountNumber - Merchant account number
 * @returns Promise<VerificationResponse>
 * @throws Error if verification fails
 */
export const verifyPayment = async (
  reference: string,
  publicKey: string,
  accountNumber: string
): Promise<VerificationResponse> => {
  try {
    const json_data = {
      state: "confirm",
      accountnumber: accountNumber,
      reference: reference,
    };

    const response = await fetch(MOOLRE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Pubkey": publicKey,
      },
      body: JSON.stringify(json_data),
    });

    if (!response.ok) {
      throw new Error("Verification request failed");
    }

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Payment verification failed");
    }

    return data;
  } catch (error) {
    console.error("Moolre Verification Error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Network error during payment verification"
    );
  }
};
