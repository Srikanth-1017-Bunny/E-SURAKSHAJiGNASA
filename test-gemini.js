import fs from "fs/promises";

async function testGemini() {
    try {
        console.log("Fetching models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        const data = await response.text();
        await fs.writeFile("gemini-out.json", data, "utf8");
        console.log("Done");
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}
testGemini();
