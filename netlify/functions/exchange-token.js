// netlify/functions/exchange-token.js

const { google } = require("googleapis");
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "postmessage";

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Non allowed method" };
  }
  if (!event.body) {
    return { statusCode: 400, body: "Missing request body" };
  }
  const { code, refreshToken } = JSON.parse(event.body);
  if (!code && !refreshToken) {
    return {
      statusCode: 400,
      body: "Missing authorization code or refresh token",
    };
  }

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  try {
    if (refreshToken) {
      console.log("refresh token recibido. Longitud:", refreshToken.length);
      console.log("Renovando token...");
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { tokens } = await oauth2Client.refreshAccessToken();

      console.log(
        "Token renovado con éxito. Nuevo access token:",
        tokens.access_token
      );

      return {
        statusCode: 200,
        body: JSON.stringify(tokens),
      };
    }

    if (code) {
      console.log("Código de autorización recibido. Longitud:", code.length);
      console.log("Intercambiando código por tokens...");
      const { tokens } = await oauth2Client.getToken(code);
      console.log(
        "Tokens obtenidos con éxito. Expiración:",
        tokens.expiry_date
      );

      // Configura el cliente de Google con el access_token
      oauth2Client.setCredentials(tokens);

      // Llama a la API de Google People para obtener los datos del usuario
      const people = google.people({ version: "v1", auth: oauth2Client });
      const profile = await people.people.get({
        resourceName: "people/me",
        personFields: "names,emailAddresses,photos",
      });
      console.log(
        "Perfil del usuario obtenido:",
        profile.data.names[0].displayName
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          tokens,
          userProfile: profile.data,
        }),
      };
    }
  } catch (error) {
    console.error("Error al intercambiar el código:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener los tokens" }),
    };
  }
};
