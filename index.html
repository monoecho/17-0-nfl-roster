exports.handler = async function(event, context) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = event.queryStringParameters.teamId || "17";
  const url = `https://v1.american-football.api-sports.io/players?team=${teamId}&season=2024`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-apisports-key": apiKey }
    });

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "No data found" }) };
    }

    let formattedRoster = { "QB": [], "RB": [], "WR": [], "TE": [] };

    data.response.forEach(item => {
      const name = item.name;
      // Convert to lowercase to prevent case-sensitivity bugs
      const pos = (item.position || "").toLowerCase();
      
      if (pos.includes("quarterback") || pos === "qb") formattedRoster["QB"].push(name);
      else if (pos.includes("running back") || pos === "rb") formattedRoster["RB"].push(name);
      else if (pos.includes("wide receiver") || pos === "wr") formattedRoster["WR"].push(name);
      else if (pos.includes("tight end") || pos === "te") formattedRoster["TE"].push(name);
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedRoster)
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
