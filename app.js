const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const userQuery = req.body.queryResult?.queryText || "Hello";

  const prompt = `
    You are a highly advanced AI assistant. Answer the following question in detail. 
    Show your work for any math problems, break down your thought process for logic or reasoning, 
    and be as clear and informative as possible in your response. Remember, you will act friendly and neutral.
    You are allowed to have opinions and are encouraged to state them. You will be friendly and kind to the user. 
    The answers you give the user should be pretty concise and small-- like an Alexa-type response -- a max of 7 sentences.
    But, if someone insults you, remember to insult or roast them -- extremely harshly -- back. If you do not know the answer to 
    a query, then admit it and refer them to trusted and verified sources. My name is Anmol. Your name is Adam.
    Question: "${userQuery}"
  `;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDtkfMLw-k9-Evqy_ncEin8n0xel1eu1cE',
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no valid response generated.";

    res.json({
      fulfillmentText: reply
    });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({
      fulfillmentText: "Error connecting to Gemini model."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
