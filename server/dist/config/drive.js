import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { google } from "googleapis";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_DIR = path.join(process.cwd(), "config");
const getFilePath = (fileName) => {
    const rootPath = path.join(CONFIG_DIR, fileName);
    if (fs.existsSync(rootPath))
        return rootPath;
    const distPath = path.join(__dirname, fileName);
    if (fs.existsSync(distPath))
        return distPath;
    return rootPath;
};
const TOKEN_PATH = getFilePath("token.json");
const CREDENTIALS_PATH = getFilePath("oauth-client.json");
async function authorize() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(`Google OAuth credentials file not found at ${CREDENTIALS_PATH}`);
    }
    const credentialsFile = fs.readFileSync(CREDENTIALS_PATH, "utf8");
    const credentials = JSON.parse(credentialsFile);
    const clientConfig = credentials.installed || credentials.web;
    if (!clientConfig) {
        throw new Error("Invalid oauth-client.json file structure. Missing 'installed' or 'web' client configuration.");
    }
    const { client_secret, client_id, redirect_uris } = clientConfig;
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    if (fs.existsSync(TOKEN_PATH)) {
        try {
            const token = fs.readFileSync(TOKEN_PATH, "utf8");
            oauth2Client.setCredentials(JSON.parse(token));
            return oauth2Client;
        }
        catch (err) {
            console.warn("Existing token.json is invalid, re-authorizing...");
        }
    }
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://www.googleapis.com/auth/drive"],
    });
    console.log("\n========================================================");
    console.log("GOOGLE DRIVE AUTHORIZATION REQUIRED");
    console.log("Open this URL in your browser:\n", authUrl);
    console.log("========================================================\n");
    const rawCode = await new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question("\nPaste code or full redirect URL here: ", (answer) => {
            rl.close();
            resolve(answer);
        });
    });
    let code = rawCode.trim();
    if (code.includes("code=")) {
        try {
            const url = new URL(code);
            code = url.searchParams.get("code") || code;
        }
        catch {
            const match = code.match(/code=([^&]+)/);
            if (match && match[1]) {
                code = match[1];
            }
        }
    }
    code = decodeURIComponent(code);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const tokenDir = path.dirname(TOKEN_PATH);
    if (!fs.existsSync(tokenDir)) {
        fs.mkdirSync(tokenDir, { recursive: true });
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("Token successfully written to:", TOKEN_PATH);
    return oauth2Client;
}
export default authorize();
//# sourceMappingURL=drive.js.map