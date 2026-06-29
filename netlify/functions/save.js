exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);

    const NOCODB_URL = process.env.NOCODB_URL;
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
    const NOCODB_TABLE = process.env.NOCODB_TABLE;

    if (!NOCODB_URL || !NOCODB_TOKEN || !NOCODB_TABLE) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Variables d'environnement manquantes"
        })
      };
    }

    const response = await fetch(
      `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE}/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xc-token": NOCODB_TOKEN
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        inserted: body.length,
        data
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};