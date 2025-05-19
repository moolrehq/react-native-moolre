import { useState } from "react";

import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

import { useMoolrePay } from "../hooks/useMoolrePay";
import { WebView } from "react-native-webview";
import type { MoolrePayButtonProps } from "./MoolrePayButton.types";

const MoolrePayButton = ({
  amount,
  publicKey,
  accountNumber,
  currency = "GHS",
  email = "",
  buttonStyle,
  textStyle,
  reference,
  callbackUrl,
  onSuccess,
  onError,
}: MoolrePayButtonProps) => {
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { handlePayment, isProcessing, verifyTransaction } = useMoolrePay({
    publicKey,
    accountNumber,
    onSuccess,
    onError,
  });

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await handlePayment({
        amount,
        currency,
        email,
        reference,
        callback: callbackUrl || "moolre://payment-callback",
      });

      if (response?.authorization_url) {
        setPaymentUrl(response.authorization_url);
        setShowWebView(true);
      }
    } catch (error) {
      const paymentError = error as { code: string; message: string };
      Alert.alert(
        "Payment Error",
        `${paymentError.code}: ${paymentError.message}`,
        [{ text: "OK", onPress: () => onError(paymentError) }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerification = async () => {
    try {
      const params = new URLSearchParams(paymentUrl.split("?")[1]);
      const reference = params.get("reference");

      if (reference) {
        const verified = await verifyTransaction(reference);
        if (verified) {
          setShowWebView(false);
        }
      }
    } catch (error) {
      onError({
        code: "MANUAL_VERIFICATION_FAILED",
        message: "Could not verify payment manually",
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={initiatePayment}
        disabled={loading || isProcessing}
      >
        {loading || isProcessing ? (
          <ActivityIndicator color="black" />
        ) : (
          <View style={styles.content}>
            <Image
              source={require("../assets/images/moolre.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.text, textStyle]}>Pay with Moolre</Text>
          </View>
        )}
      </TouchableOpacity>
      {showWebView && (
        <Modal
          visible={showWebView}
          onRequestClose={() => {
            setShowWebView(false);
            handleManualVerification();
            onError({
              code: "USER_CANCELLED",
              message: "Payment was cancelled by user",
            });
          }}
          animationType="slide"
        >
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes("moolre://payment-callback")) {
                setShowWebView(false);
              }
            }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0066FF" />
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              onError({
                code: "WEBVIEW_ERROR",
                message:
                  nativeEvent.description || "Payment page failed to load",
              });
              setShowWebView(false);
            }}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#142a4a",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 200,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
  logo: {
    width: 24,
    height: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MoolrePayButton;
