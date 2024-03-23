// pages/api/upload-image.js
import fetch from 'node-fetch';
import {IncomingForm} from 'formidable';
import fs from 'fs';
import {promisify} from 'util';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js' default body parser to handle FormData
    },
};

// Helper function to convert the uploaded file to a base64 string
const fileToBase64 = async (filePath) => {
    const readFile = promisify(fs.readFile);
    const fileBuffer = await readFile(filePath);
    return fileBuffer.toString('base64');
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Received POST request");
        const form = new IncomingForm();
        form.uploadDir = "./";
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({error: 'Error processing the upload'});
                return;
            }

            // Assuming a single file upload, get the path of the uploaded file
            // console.log(files)
            const filePath = files.image[0].filepath;

            // Convert the file to a base64 string
            const base64Image = await fileToBase64(filePath);

            // Specify your OpenAI API key here
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

            // Cleanup: remove the uploaded file after processing
            fs.unlinkSync(filePath);

            res.status(200).json(data);
        });
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
