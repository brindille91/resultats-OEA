exports.handler = async function (event) {
  try {
    // ================================
    // 1. Vérification méthode HTTP
    // ================================
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          error: "Méthode non autorisée"
        })
      };
    }

    // ================================
    // 2. Vérification body
    // ================================
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body vide reçu"
        })
      };
    }

    // ================================
    // 3. Parsing JSON sécurisé
    // ================================
    let data;

    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "JSON invalide",
          raw: event.body
        })
      };
    }

    // ================================
    // 4. Validation minimale
    // ================================
    if (!Array.isArray(data) || data.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Aucune donnée à insérer"
        })
      };
    }

    // ================================
    // 5. Variables d'environnement
    // ================================
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

    // ================================
    // 6. Appel NocoDB
    // ================================
    const response = await fetch(
      `${NOCODB_URL}/api/v2/tables/${NOCODB_TABLE}/records`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xc-token": NOCODB_TOKEN
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    // ================================
    // 7. Gestion erreur API NocoDB
    // ================================
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Erreur NocoDB",
          details: result
        })
      };
    }

    // ================================
    // 8. Succès
    // ================================
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        inserted: data.length,
        result
      })
    };

  } catch (err) {
    // ================================
    // 9. Erreur globale
    // ================================
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erreur serveur",
        message: err.message
      })
    };
  }
};