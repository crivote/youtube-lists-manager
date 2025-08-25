// netlify/functions/exchange-token.js

const { google } = require("googleapis");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  const { code } = JSON.parse(event.body);

  const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = "postmessage";

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Puedes decidir si guardar el refresh token en una base de datos o en el navegador.
    // Para esta prueba, lo devolvemos al cliente.
    return {
      statusCode: 200,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    console.error("Error al intercambiar el código:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener los tokens" }),
    };
  }
};
