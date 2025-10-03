import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

// Create a Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            amount: amount * 100, // convert to centavos
            currency: "PHP",
            description,
            payment_method_types: ["card", "gcash", "paymaya"],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ url: response.data.data.attributes.checkout_url });
  } catch (err) {
    console.error("PayMongo Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
