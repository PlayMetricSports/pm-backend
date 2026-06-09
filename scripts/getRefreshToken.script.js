require("dotenv").config();

const { google } = require("googleapis");
const readline = require("readline");
const getRefreshToken = async () => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        "http://localhost"
    );

    const scopes = [
        "https://www.googleapis.com/auth/gmail.readonly",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });

    console.log("\nOpen this URL in your browser:\n");
    console.log(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("\nPaste the code here: ", async (code) => {
        try {
            const { tokens } = await oauth2Client.getToken(code);

            console.log("\nTOKENS:");
            console.log(tokens);

            console.log("\nREFRESH TOKEN:");
            console.log(tokens.refresh_token);

            rl.close();
        } catch (err) {
            console.error(err);
            rl.close();
        }
    });

}
getRefreshToken()