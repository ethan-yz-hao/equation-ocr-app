import fetch from 'node-fetch';
import {IncomingForm} from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js' default body parser to handle FormData
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Formidable error:', err);
            res.status(500).json({error: 'Error processing the upload'});
            return;
        }

        // Read the file into a buffer
        const imageFile = files.image[0]; // Adjust based on how your files are named/structured
        const imageData = await fs.promises.readFile(imageFile.filepath);
        const base64Image = imageData.toString('base64');

        const apiKey = process.env.OPENAI_API_KEY;

        const payload = {
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "system",
                    content: "You are an OCR bot specialized in recognizing mathematical equations."
                },
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": "Write the equation in this image to latex code. Only output the equation. Do not add anything else."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        res.status(200).json(data);
    });
}
