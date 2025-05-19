# react-native-moolre

**`react-native-moolre`** is a modern React Native plugin that enables seamless integration with the **Moolre Payments** platform. Accept mobile payments effortlessly using a professional, customizable checkout button.

---

## ✨ Features

- ✅ One-line integration
- ✅ Secure embedded payment via WebView
- ✅ Handles payment success, cancellation & errors
- ✅ Fully customizable button
- ✅ Lightweight and production-ready
- ✅ Supports optional custom callback URLs
- ✅ Built for React Native 0.69+ and Expo

---

## 📦 Installation

```bash
yarn add react-native-moolre
```

This plugin requires [`react-native-webview`](https://github.com/react-native-webview/react-native-webview) as a peer dependency. If it’s not already in your project, install it:

```bash
yarn add react-native-webview
```

> 🎯 If you're using **Expo Go**, no extra installation is required — `react-native-webview` is already included.

---

## 🚀 Quick Start

### 1. Import the Button

```tsx
import { MoolrePayButton } from 'react-native-moolre';
```

### 2. Use in Your Component

```tsx
<MoolrePayButton
  amount={50}
  publicKey="your_public_key"
  accountNumber="your_account_number"
  email="user@example.com"
  onSuccess={(reference) => {
    console.log("Payment successful. Ref:", reference);
  }}
  onError={({ code, message }) => {
    console.error(`Payment error [${code}]: ${message}`);
  }}
  buttonStyle={{ padding: 12, borderRadius: 8 }}
  textStyle={{ fontSize: 16 }}
/>
```

> 💡 The `callbackUrl` prop is optional. By default, a deeplink is used to return users to your app. If you'd like to handle redirects via your backend or browser, provide a custom `callbackUrl`:
>
> ```tsx
> callbackUrl="https://yourdomain.com/payment/callback"
> ```

---

## 🛒 Example Checkout UI

```tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MoolrePayButton } from 'react-native-moolre';

const products = [
  { id: '1', name: 'Premium Sneakers', price: 120 },
  { id: '2', name: 'T-Shirt', price: 40 },
  { id: '3', name: 'Cap', price: 25 },
];

export default function App() {
  const total = products.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>GHS {item.price.toFixed(2)}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.total}>Total: GHS {total.toFixed(2)}</Text>

      <MoolrePayButton
        amount={total}
        publicKey="your_public_key"
        accountNumber="your_account_number"
        email="user@example.com"
        onSuccess={(ref) => Alert.alert('Success', `Payment ref: ${ref}`)}
        onError={({ code, message }) =>
          Alert.alert(`Error [${code}]`, message)
        }
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: { fontSize: 18 },
  price: { fontSize: 18, fontWeight: '600' },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#FF9900',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
```

---

## 🧠 Props Reference

| Prop           | Type                                   | Required | Description                                      |
|----------------|----------------------------------------|----------|--------------------------------------------------|
| `amount`       | `number`                               | ✅       | Payment amount in your currency                 |
| `publicKey`    | `string`                               | ✅       | Your Moolre public API key                      |
| `accountNumber`| `string`                               | ✅       | Your Moolre merchant account number             |
| `currency`     | `string`                               | ❌       | Defaults to `"GHS"`                             |
| `email`        | `string`                               | ❌       | Customer email address                          |
| `callbackUrl`  | `string`                               | ❌       | Optional custom payment redirect callback URL   |
| `onSuccess`    | `(ref: string) => void`                | ✅       | Triggered on successful payment                 |
| `onError`      | `({ code, message }) => void`          | ✅       | Triggered on failure or cancellation            |
| `buttonStyle`  | `ViewStyle`                            | ❌       | Custom styles for the button                    |
| `textStyle`    | `TextStyle`                            | ❌       | Custom styles for the button text              |

---

## 🤝 Contributing

We welcome all PRs, suggestions, and improvements! Please follow the guidelines in [`CONTRIBUTING.md`](./CONTRIBUTING.md) when contributing.

---

## 📄 License

MIT © [Moolre HQ](https://github.com/moolrehq)  
Made with ❤️ by the Moolre team.