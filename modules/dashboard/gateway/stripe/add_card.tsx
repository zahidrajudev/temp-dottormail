"use client";

import { useEffect, useState, FormEvent } from "react";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, type Appearance } from "@stripe/stripe-js";
import Api from "@/lib/api";
import Section from "@/modules/global/elements/section";
import Button from "@/modules/global/elements/button";

interface PaymentFormProps {
  onSuccess: () => void;
}

interface StripeSubscriptionFormProps {
  onSuccess: () => void;
}

function PaymentForm({ onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) return;

    setIsLoading(true);

    // Step 1: Confirm setup intent (save card for future use)
    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred while saving card.");
      setIsLoading(false);
      return;
    }

    if (setupIntent && setupIntent.status === "succeeded") {
      setSuccessMessage("Card Successfully Added");
      onSuccess();
    } else {
      setMessage("Something went wrong while adding your card.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full block mt-4 text-center px-3 py-1.5 bg-linear-to-l from-fuchsia-500 to-violet-500 text-white hover:opacity-75 duration-500 disabled:cursor-not-allowed disabled:opacity-50 rounded-full">
        {isLoading ? "Processing..." : "Add Card"}
      </button>
      {message && <div className="mt-3 text-center text-red-600">{message}</div>}
      {successMessage && <div className="mt-3 text-center text-green-600">{successMessage}</div>}
    </form>
  );
}

export default function StripeAddCard({ onSuccess }: StripeSubscriptionFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [pubKey, setPubKey] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Step 1: Create SetupIntent on backend
        const res = await Api.post("v1/dashboard/payment-card/create");
        setPubKey(res.data.pub_key);
        setClientSecret(res.data.client_secret);
      } catch (err) {
        console.error("Error creating SetupIntent", err);
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
          <PaymentForm onSuccess={onSuccess} />
        </Elements>
      ) : (
        <div>Loading...</div>
      )}
    </Section>
  );
}
