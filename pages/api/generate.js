import { Configuration, OpenAIApi } from "openai";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { name, phone, email, text } = req.body;
  if (!name || !phone || !email || !text) {
    res.status(400).json({
      error: {
        message: "Please fill in all required fields",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(name, phone, email, text),
      temperature: 0.6,
      max_tokens: 100,
    });
    const messageBody = `Form Sumbitted\n${completion.data.choices[0].text}`;
    client.messages
      .create({
        body: messageBody,
        from: process.env.TWILIO_NUMBER,
        to: process.env.MY_NUMBER,
      })
      .then(message => console.log(`Message sent to ${message.to}: ${message.body}`))
      .catch(error => console.error(`Error sending message: ${error.message}`));
    res.status(200).json({ result: "Message sent successfully!"  });
  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}

function generatePrompt(name, phone, email, text) {
  return `act as a virtual assistant and relay the following information from a customer to Tom:
  Name:${name}\n${phone}\n${email}\nMessage:${text}\n`;
}
