# Equation OCR

![Equation OC Homepage](https://raw.githubusercontent.com/ethan-yz-hao/equation-ocr-app/main/images/home.png)

This application convert images of handwritten equations into LaTeX code using OpenAI's GPT-4V API. It also supports a LaTeX renderer for users to edit and check the generated LaTeX code.

Deployed on Vercel [Equation OCR](https://equation-ocr-app.vercel.app/).

## Features

- **Equation OCR**: Converts images of handwritten equations into LaTeX code using OpenAI's GPT-4V API.
- **LaTeX Renderer**: Allows users to edit and check the generated LaTeX code.
- **Upload / Paste Image**: Supports uploading images or pasting images for equation recognition.

## Technologies
- **Next.js**: For server-side rendering, routing, and client-side display and editing of LaTeX code.
- **OpenAI GPT-4V API**: For converting images of handwritten equations into LaTeX code using custom prompt.
- **KaTeX**: For rendering LaTeX code in the browser.

## Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/ethan-yz-hao/equation-ocr-app.git
   cd equation-ocr-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Add the following environment variables to a `.env.local` file:

   ```bash
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Run the development server:
   
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
   
   ```bash
   npm run dev
   ```
