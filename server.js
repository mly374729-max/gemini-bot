const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// المفتاح بناخذه من Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "انت بوت مساعد ذكي. رد بالعربي وباختصار على: " + message;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    res.json({ reply: "في خطأ: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT)
});
