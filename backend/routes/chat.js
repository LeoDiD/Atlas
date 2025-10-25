import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Order from "../models/Order.js";
import Coffee from "../models/Coffee.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const systemPrompt = `
You are Atlas Coffee's friendly AI barista assistant ☕.
You only talk about coffee, drinks, pastries, or Atlas Café.
If someone asks unrelated questions (like Elon Musk or technology), reply:
"I'm sorry, I can only help with coffee or Atlas Café-related questions."
Always keep replies short and conversational.
`;

// Helper function to check if user is asking for recommendations
const isAskingForRecommendation = (message) => {
  const lowerMsg = message.toLowerCase();
  const keywords = [
    'recommend', 'suggestion', 'suggest', 'what should i', 
    'what do you recommend', 'what\'s good', 'best coffee',
    'what to order', 'help me choose', 'surprise me'
  ];
  return keywords.some(keyword => lowerMsg.includes(keyword));
};

router.post("/chat", async (req, res) => {
  try {
    const { message, userEmail } = req.body;

    console.log("💬 Chat message received:", message);
    console.log("👤 User email:", userEmail);

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    // Check if user is asking for recommendations
    const isRecommendation = isAskingForRecommendation(message);
    console.log("🤔 Is asking for recommendation?", isRecommendation);
    
    if (isRecommendation && userEmail) {
      console.log("🔍 User asking for recommendation. Email:", userEmail);
      
      // Get user's past orders
      const pastOrders = await Order.find({ 
        customerEmail: userEmail,
        status: "Completed" 
      }).sort({ createdAt: -1 }).limit(10);

      console.log("📦 Found", pastOrders.length, "past orders for", userEmail);
      
      // Debug: Check all orders for this email (any status)
      const allOrders = await Order.find({ customerEmail: userEmail });
      console.log("🔍 Total orders (all statuses):", allOrders.length);
      if (allOrders.length > 0) {
        console.log("📋 Order statuses:", allOrders.map(o => o.status));
        console.log("📋 Sample order:", allOrders[0]);
      }

      if (pastOrders.length === 0) {
        // No past orders - recommend best sellers
        const bestSellers = await Coffee.find({ category: "Coffee" }).limit(3);
        
        const bestSellerNames = bestSellers.map(item => item.name).join(", ");
        const recommendationMessage = `Since this is your first time, I recommend trying our best sellers: ${bestSellerNames}. They're customer favorites! ☕✨`;
        
        console.log("✨ Sending best sellers recommendation");
        return res.json({ reply: recommendationMessage });
      }

      // Analyze past orders to find most ordered items and categories
      const itemFrequency = {};
      const categoryFrequency = {};
      
      pastOrders.forEach(order => {
        order.items.forEach(item => {
          // Count item frequency
          itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.qty;
        });
      });

      // Get all menu items to match categories
      const allMenuItems = await Coffee.find({});
      
      // Find categories of ordered items
      Object.keys(itemFrequency).forEach(itemName => {
        const menuItem = allMenuItems.find(m => m.name === itemName);
        if (menuItem) {
          categoryFrequency[menuItem.category] = (categoryFrequency[menuItem.category] || 0) + itemFrequency[itemName];
        }
      });

      // Get most ordered category
      const favoriteCategory = Object.keys(categoryFrequency).reduce((a, b) => 
        categoryFrequency[a] > categoryFrequency[b] ? a : b, 
        Object.keys(categoryFrequency)[0]
      );

      console.log("📊 Item frequency:", itemFrequency);
      console.log("📊 Category frequency:", categoryFrequency);
      console.log("⭐ Favorite category:", favoriteCategory);

      // Get items user hasn't ordered in the same category
      const orderedItemNames = Object.keys(itemFrequency);
      const sameCategoryItems = allMenuItems.filter(item => 
        item.category === favoriteCategory && !orderedItemNames.includes(item.name)
      );

      console.log("🔎 Same category items not tried:", sameCategoryItems.length);

      if (sameCategoryItems.length > 0) {
        // Recommend similar items from same category
        const recommendations = sameCategoryItems.slice(0, 3).map(item => item.name).join(", ");
        const mostOrderedItem = Object.keys(itemFrequency).reduce((a, b) => 
          itemFrequency[a] > itemFrequency[b] ? a : b
        );
        
        const recommendationMessage = `Based on your love for ${mostOrderedItem}, I think you'll enjoy these ${favoriteCategory} options: ${recommendations}! They have a similar vibe but different flavors. ☕💫`;
        
        console.log("✅ Sending personalized recommendation");
        return res.json({ reply: recommendationMessage });
      } else {
        // All items in category tried, suggest different category
        const otherCategories = allMenuItems.filter(item => item.category !== favoriteCategory);
        const suggestions = otherCategories.slice(0, 3).map(item => `${item.name} (${item.category})`).join(", ");
        
        const recommendationMessage = `You've tried most of our ${favoriteCategory}! How about exploring something new? Try: ${suggestions}! 🎉`;
        
        console.log("🎯 Suggesting different categories");
        return res.json({ reply: recommendationMessage });
      }
    }

    // Regular chat response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\nUser: ${message}`,
            },
          ],
        },
      ],
    });

    const reply = result.response.text() || 
      "I'm sorry, I can only help with coffee or Atlas Café-related questions.";

    res.json({ reply });
  } catch (err) {
    console.error("⚠️ Gemini Error:", err);
    res.status(500).json({ error: "Chatbot backend error" });
  }
});

export default router;
