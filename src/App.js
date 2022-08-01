import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
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
            merchantIdentifier: "merchant.com.example",
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
            "https://4179-110-39-152-42.in.ngrok.io/merchant-session/new",
            obj
          )
          .then(async (res) => {
            event.complete(res.data);
          })
          .catch((error) => {
            console.log(error);
          });

        //const merchantSessionPromise = validateMerchant();
        //event.complete(merchantSessionPromise);
      };

      // request.onpaymentmethodchange = (event) => {
      //   if (event.methodDetails.type !== undefined) {
      //     // Define PaymentDetailsUpdate based on the selected payment method.
      //     // No updates or errors needed, pass an object with the same total.
      //     const paymentDetailsUpdate = {
      //       total: paymentDetails.total,
      //     };
      //     event.updateWith(paymentDetailsUpdate);
      //   } else if (event.methodDetails.couponCode !== undefined) {
      //     // Define PaymentDetailsUpdate based on the coupon code.
      //     const total = calculateTotal(event.methodDetails.couponCode);
      //     const displayItems = calculateDisplayItem(
      //       event.methodDetails.couponCode
      //     );
      //     const shippingOptions = calculateShippingOptions(
      //       event.methodDetails.couponCode
      //     );
      //     const error = calculateError(event.methodDetails.couponCode);

      //     event.updateWith({
      //       total: total,
      //       displayItems: displayItems,
      //       shippingOptions: shippingOptions,
      //       modifiers: [
      //         {
      //           data: {
      //             additionalShippingMethods: shippingOptions,
      //           },
      //         },
      //       ],
      //       error: error,
      //     });
      //   }
      // };

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
        console.log("here1");
      };

      const response = await request.show();
      const status = "success";
      await response.complete(status);
      console.log("here2");
    } catch (e) {
      console.log("error", e);
      // Handle errors
    }
  }
  return (
    <div className="App">
      <h1>Apple Pay</h1>
      <button onClick={onApplePayButtonClicked}>Pay</button>
    </div>
  );
}

export default App;
