import fs from "fs";

const testAPI = async () => {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    const output = {};

    try {
        const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
        });
        output.gemini = { status: gemRes.status, data: await gemRes.json() };
    } catch (e) { output.gemini = e.message; }

    try {
        const groqModelsRes = await fetch("https://api.groq.com/openai/v1/models", {
            headers: { "Authorization": `Bearer ${groqApiKey}` }
        });
        output.groqModels = await groqModelsRes.json();
    } catch (e) { output.groqModels = e.message; }

    fs.writeFileSync("api-test-results.json", JSON.stringify(output, null, 2));
    console.log("Done");
};

testAPI();
