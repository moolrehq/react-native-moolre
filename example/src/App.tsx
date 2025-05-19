import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MoolrePayButton } from "react-native-moolre";
import { Ionicons } from "@expo/vector-icons";

// --- Deep Link Utilities ---
const isMoolreCallback = (url: string): boolean => {
  return url.startsWith("moolre://payment-callback");
};

const parseMoolreCallback = (
  url: string
): { status?: string; reference?: string } | null => {
  try {
    const parsed = new URL(url);
    const status = parsed.searchParams.get("status") || undefined;
    const reference = parsed.searchParams.get("reference") || undefined;
    return { status, reference };
  } catch (err) {
    return null;
  }
};

// --- Sample Products Logic ---
const sampleProducts = [
  "Smart Watch",
  "USB Charger",
  "Gaming Mouse",
  "LED Bulb",
  "Water Bottle",
  "Backpack",
];

const generateRandomProduct = () => {
  const name =
    sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
  const price = parseFloat((Math.random() * 1 + 0.1).toFixed(2));
  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    name,
    price,
  };
};

export default function App() {
  const [products, setProducts] = useState([
    { id: "1", name: "Wireless Headphones", price: 0.5 },
    { id: "2", name: "Bluetooth Speaker", price: 0.2 },
  ]);

  const total = products.reduce((sum, item) => sum + item.price, 0);
  const customReference = `my-txn-${Date.now()}`;
  const callbackUrl = "moolre://payment-callback"; // Deep link

  const removeItem = (id: string) =>
    setProducts((prev) => prev.filter((item) => item.id !== id));

  const addRandomItem = () =>
    setProducts((prev) => [...prev, generateRandomProduct()]);

  const handleSuccess = (reference: any) =>
    Alert.alert("Success", `Payment reference: ${reference}`);

  const handleError = ({ code, message }) =>
    Alert.alert(`Error ${code}`, message);

  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      if (isMoolreCallback(event.url)) {
        const parsed = parseMoolreCallback(event.url);
        if (parsed?.status === "success") {
          Alert.alert("Payment Successful", `Ref: ${parsed.reference}`);
        } else {
          Alert.alert("Payment Failed", `Ref: ${parsed?.reference || "N/A"}`);
        }
      }
    };

    const sub = Linking.addEventListener("url", handleUrl);

    // Optional: handle app open with link when not running
    Linking.getInitialURL().then((url) => {
      if (url && isMoolreCallback(url)) handleUrl({ url });
    });

    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.checkoutBox}>
          <Text style={styles.heading}>Checkout</Text>

          {products.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Text style={styles.productText}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.productPrice}>GHS {item.price}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="red"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={addRandomItem}
          >
            <Ionicons name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.addItemText}>Add Random Item</Text>
          </TouchableOpacity>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrice}>GHS {total.toFixed(2)}</Text>
          </View>

          <MoolrePayButton
            amount={total}
            publicKey="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjUyNzgzLCJleHAiOjE4OTM0NzM5OTl9.ZtI3Q6D0Vb_OuM9AQYofwL7nmJfLIm1-cSqBTILK7ZQ"
            accountNumber="527830503234"
            email="freshdan24@gmail.com"
            reference={customReference}
            callbackUrl={callbackUrl}
            onSuccess={handleSuccess}
            onError={handleError}
            buttonStyle={styles.moolreButton}
            textStyle={styles.moolreButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  checkoutBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productText: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginBottom: 30,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  moolreButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDB93C",
  },
  moolreButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  addItemText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 6,
  },
});
