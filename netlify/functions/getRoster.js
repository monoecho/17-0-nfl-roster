exports.handler = async function(event, context) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = event.queryStringParameters.teamId || "17";
  const url = `https://v1.american-football.api-sports.io/players?team=${teamId}&season=2024`;

  console.log(`LOG: Requesting Team ${teamId}`);
  console.log(`LOG: API Key found: ${apiKey ? "YES (hidden)" : "NO (Missing in Netlify Settings!)"}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-apisports-key": apiKey || "" }
    });

    const data = await response.json();

    // Check for API-specific errors (like plan limits)
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log("LOG API ERROR:", JSON.stringify(data.errors));
    }

    if (!data.response || data.response.length === 0) {
      console.log("LOG: API returned an empty response array.");
      return { statusCode: 200, body: JSON.stringify({ error: "Empty" }) };
    }

    console.log(`LOG: Success! Found ${data.response.length} total players.`);

    let formattedRoster = { "QB": [], "RB": [], "WR": [], "TE": [] };

    data.response.forEach(item => {
      const pos = (item.position || "").toLowerCase();
      if (pos.includes("quar") || pos === "qb") formattedRoster["QB"].push(item.name);
      else if (pos.includes("runn") || pos === "rb") formattedRoster["RB"].push(item.name);
      else if (pos.includes("recei") || pos === "wr") formattedRoster["WR"].push(item.name);
      else if (pos.includes("tight") || pos === "te") formattedRoster["TE"].push(item.name);
    });

    console.log(`LOG: Filtered to ${formattedRoster.QB.length} QBs.`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedRoster)
    };
  } catch (error) {
    console.log("LOG CRITICAL FUNCTION ERROR:", error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
