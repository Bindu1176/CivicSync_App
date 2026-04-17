const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/message', auth, async (req, res) => {
  try {
    const { message, history } = req.body;

    // Try OpenAI if key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const messages = [
          {
            role: 'system',
            content: `You are CivicSync AI Assistant. You help Indian citizens with:
            - Understanding government schemes and eligibility
            - Navigating identity documents (Aadhaar, PAN, Passport, etc.)
            - Health services and appointments
            - Transport services (DL, RC, challans)
            - Bill payments and dues
            - Certificates and their applications
            - Property-related queries
            Be helpful, concise, and speak in the user's preferred language. Always provide accurate information about Indian government services.`
          },
          ...(history || []).map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7
        });

        return res.json({ reply: completion.choices[0].message.content });
      } catch (aiError) {
        console.error('OpenAI error:', aiError.message);
      }
    }

    // Fallback: Smart mock responses
    const lowerMsg = message.toLowerCase();
    let reply = '';

    if (lowerMsg.includes('aadhaar') || lowerMsg.includes('aadhar')) {
      reply = 'To update your Aadhaar details, go to Identity → Aadhaar → Update Information. You can update your address, mobile number, and other details. For name changes, you\'ll need supporting documents. Would you like me to guide you through the process?';
    } else if (lowerMsg.includes('pan')) {
      reply = 'Your PAN card details are available under Identity → PAN. You can view your PAN number, name, and date of birth. For corrections, use the Update Information feature which will submit a request for review.';
    } else if (lowerMsg.includes('bill') || lowerMsg.includes('pay')) {
      reply = 'You can pay your bills through Pay Bills module. We support Electricity, Gas, Water, Property Tax, and Broadband bills. Use the mock UPI gateway to simulate payments. Any unpaid bills will show with a "Pay Now" button.';
    } else if (lowerMsg.includes('scheme') || lowerMsg.includes('eligib')) {
      reply = 'To check scheme eligibility, tap the "Check Eligibility" button at the bottom of your dashboard. Fill in your details like caste, income, and disability status to see matching government schemes. Currently we track 12+ central schemes!';
    } else if (lowerMsg.includes('health') || lowerMsg.includes('doctor') || lowerMsg.includes('hospital')) {
      reply = 'Your health services are under the Health module. You can view health records, upcoming appointments, vaccination history, blood donation records, and active prescriptions. Need to book an appointment? Use the Book Appointments feature.';
    } else if (lowerMsg.includes('license') || lowerMsg.includes('vehicle') || lowerMsg.includes('challan')) {
      reply = 'Transport services include your Driving License, Vehicle RC, Fine/Challan history, and FASTag details. You can also book bus and train tickets. Any pending challans will show with payment options.';
    } else if (lowerMsg.includes('certificate')) {
      reply = 'Your certificates (SSLC, PUC, Degree, Birth, Caste, Income, Domicile, Marriage) are all available under the Certificates module. You can view and download each certificate as a document.';
    } else if (lowerMsg.includes('property') || lowerMsg.includes('land')) {
      reply = 'The Property module shows your owned properties, sale deeds, encumbrance certificates, and property tax receipts. You can view details and download documents for each property.';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      reply = 'Hello! 👋 I\'m your CivicSync AI Assistant. I can help you with government schemes, identity documents, health services, bill payments, and more. What would you like to know?';
    } else if (lowerMsg.includes('help')) {
      reply = 'I can help you with:\n🆔 Identity Documents (Aadhaar, PAN, Passport, etc.)\n🏥 Health Services\n🚗 Transport & Travel\n💰 Bill Payments\n📜 Certificates\n🏛️ Government Schemes\n🏠 Property Records\n\nJust ask me about any of these topics!';
    } else {
      reply = 'I\'m your CivicSync AI Assistant! I can help you navigate government services, check scheme eligibility, understand document processes, and more. Try asking about specific services like "How to update Aadhaar?" or "What schemes am I eligible for?"';
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Chatbot error', reply: 'Sorry, I\'m having trouble right now. Please try again.' });
  }
});

module.exports = router;
