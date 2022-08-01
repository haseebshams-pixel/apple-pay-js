import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  async function onApplePayButtonClicked() {
    // Consider falling back to Apple Pay JS if Payment Request is not available.
    if (!PaymentRequest) {
      return;
    }
    try {
      // Define PaymentMethodData
      const paymentMethodData = [
        {
          supportedMethods: "https://apple.com/apple-pay",
          data: {
            version: 3,
            merchantIdentifier: "merchant.com.codingpixel.openboardersWeb",
            merchantCapabilities: ["supports3DS"],
            supportedNetworks: ["amex", "discover", "masterCard", "visa"],
            countryCode: "US",
          },
        },
      ];
      // Define PaymentDetails
      const paymentDetails = {
        total: {
          label: "My Merchant",
          amount: {
            value: "27.50",
            currency: "USD",
          },
        },
      };
      // Define PaymentOptions
      const paymentOptions = {
        requestPayerName: false,
        requestBillingAddress: false,
        requestPayerEmail: false,
        requestPayerPhone: false,
        requestShipping: true,
        shippingType: "shipping",
      };

      // Create PaymentRequest
      const request = new PaymentRequest(
        paymentMethodData,
        paymentDetails,
        paymentOptions
      );

      request.onmerchantvalidation = (event) => {
        let obj = { URL: event.validationURL };
        // Call your own server to request a new merchant session.
        axios
          .post(
            "https://13b0-110-39-152-42.in.ngrok.io/merchant-session/new",
            obj
          )
          .then(async (res) => {
            event.complete(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      request.onpaymentmethodchange = (event) => {};

      request.onshippingoptionchange = (event) => {
        // Define PaymentDetailsUpdate based on the selected shipping option.
        // No updates or errors needed, pass an object with the same total.
        const paymentDetailsUpdate = {
          total: paymentDetails.total,
        };
        event.updateWith(paymentDetailsUpdate);
      };

      request.onshippingaddresschange = (event) => {
        // Define PaymentDetailsUpdate based on a shipping address change.
        const paymentDetailsUpdate = {
          total: {
            label: "My Merchant",
            amount: {
              value: "27.50",
              currency: "USD",
            },
          },
        };
        event.updateWith(paymentDetailsUpdate);
      };

      const response = await request.show();
      console.log(response.details.token.paymentData);

      const status = "success";
      await response.complete(status);
    } catch (e) {
      console.log("error", e.message);
      // Handle errors
    }
  }
  function onApplePayButtonClicked2() {
    if (!window.ApplePaySession) {
      return;
    }

    // Define ApplePayPaymentRequest
    const request = {
      countryCode: "US",
      currencyCode: "USD",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      total: {
        label: "Demo (Card is not charged)",
        type: "final",
        amount: "1.99",
      },
    };

    // Create ApplePaySession
    const session = new window.ApplePaySession(3, request);

    session.onvalidatemerchant = async (event) => {
      // Call your own server to request a new merchant session.
      let obj = { URL: event.validationURL };
      // Call your own server to request a new merchant session.
      axios
        .post(
          "https://13b0-110-39-152-42.in.ngrok.io/merchant-session/new",
          obj
        )
        .then(async (res) => {
          session.completeMerchantValidation(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    session.onpaymentmethodselected = (event) => {
      // Define ApplePayPaymentMethodUpdate based on the selected payment method.
      // No updates or errors are needed, pass an empty object.
      const update = {};
      session.completePaymentMethodSelection(update);
    };

    session.onshippingmethodselected = (event) => {
      // Define ApplePayShippingMethodUpdate based on the selected shipping method.
      // No updates or errors are needed, pass an empty object.
      const update = {};
      session.completeShippingMethodSelection(update);
    };

    session.onshippingcontactselected = (event) => {
      // Define ApplePayShippingContactUpdate based on the selected shipping contact.
      const update = {};
      session.completeShippingContactSelection(update);
    };

    session.onpaymentauthorized = (event) => {
      // Define ApplePayPaymentAuthorizationResult
      const result = {
        status: window.ApplePaySession.STATUS_SUCCESS,
      };
      const response = session.completePayment(result);
      setToken(response.details.token.paymentData);
    };

    session.oncouponcodechanged = (event) => {
      // Define ApplePayCouponCodeUpdate
      const update = {};

      session.completeCouponCodeChange(update);
    };

    session.oncancel = (event) => {
      // Payment cancelled by WebKit
    };

    session.begin();
  }
  const tokenization = async () => {
    let obj = {
      token: token,
    };
    axios
      .post("https://13b0-110-39-152-42.in.ngrok.io/decypt", obj)
      .then(async (res) => {
        console.log("Done");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="App">
      <h1>Apple Pay</h1>
      <button onClick={onApplePayButtonClicked2}>Pay</button>
      <button onClick={tokenization}>Decrypt</button>
    </div>
  );
}

export default App;
