import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { paymentMethodId, fullName } = await req.json();

    if (!paymentMethodId || !fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method ID and full name are required",
        },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `http://localhost:3000/payment-success`,
    });

    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
