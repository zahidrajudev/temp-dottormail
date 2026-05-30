"use client";

import { useEffect, useState, FormEvent } from "react";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, type Appearance } from "@stripe/stripe-js";
import Api from "@/lib/api";
import Section from "@/modules/global/elements/section";

interface PaymentFormProps {
  item_id: number;
  currency_code: string;
  payment_intent: any;
}

interface StripeSubscriptionFormProps {
  item_id: number;
  currency_code: string;
}

function PaymentForm({ item_id, currency_code, payment_intent }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [invoice, setInvoice] = useState("");

  const handleSubmitPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const data = { pkg_id: item_id, currency_code, payment_intent_id: payment_intent, gateway_code: "stripe" };
      const res = await Api.post("v1/checkout/stripe/submit-intent", data);
      setInvoice(res.data?.invoice);
      setIsLoading(false);
      return res.data?.invoice;
    } catch (err) {
      console.error("Error when creating order", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) return;

    setIsLoading(true);

    const _invoice = await handleSubmitPaymentIntent();

    // Step 1: Confirm setup intent (save card for future use)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/status?invoice=${_invoice}` },
      // redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred while proccessing payment.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full block mt-4 text-center px-3 py-1.5 bg-linear-to-l from-fuchsia-500 to-violet-500 text-white hover:opacity-75 duration-500 disabled:cursor-not-allowed disabled:opacity-50 rounded-full"
      >
        {isLoading ? "Processing..." : "Add Card"}
      </button>
      {message && <div className="mt-3 text-center text-red-600">{message}</div>}
      {successMessage && <div className="mt-3 text-center text-green-600">{successMessage}</div>}
    </form>
  );
}

export default function DottormailStripePaymentForm({ item_id, currency_code }: StripeSubscriptionFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [pubKey, setPubKey] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Step 1: Create SetupIntent on backend
        const data = { pkg_id: item_id, currency_code, gateway_code: "stripe" };
        const res = await Api.post("v1/checkout/stripe/create-intent", data);
        setPaymentIntent(res.data?.payment_intent);
        setPubKey(res.data?.pub_key);
        setClientSecret(res.data?.client_secret);
      } catch (err) {
        console.error("Error creating Payment Intent", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    // console.log("pubKey:", pubKey);
    // console.log("clientSecret:", clientSecret);
    if (pubKey && clientSecret) {
      const stripeInstance = loadStripe(pubKey);
      setStripePromise(stripeInstance);
    }
  }, [pubKey]);

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <Section loading={loading}>
      {stripePromise ? (
        <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
          <PaymentForm item_id={item_id} currency_code={currency_code} payment_intent={paymentIntent} />
        </Elements>
      ) : (
        <div>Loading...</div>
      )}
    </Section>
  );
}
