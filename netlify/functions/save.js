export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const NOCODB_URL = process.env.NOCODB_URL;
    const NOCODB_TOKEN = process.env.NOCODB_TOKEN;
    const TABLE = process.env.NOCODB_TABLE;

    const response = await fetch(`${NOCODB_URL}/api/v2/tables/${TABLE}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xc-token": NOCODB_TOKEN
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        inserted: body.length,
        response: data
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
}