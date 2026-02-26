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
      return { statusCode: 200, body: JSON.stringify({ error: "No API data" }) };
    }

    let formattedRoster = { "QB": [], "RB": [], "WR": [], "TE": [] };

    data.response.forEach(item => {
      const name = item.name;
      const pos = (item.position || "").toLowerCase();
      
      // Fuzzy logic: if the position string contains these letters, grab the player
      if (pos.includes("quar") || pos === "qb") formattedRoster["QB"].push(name);
      else if (pos.includes("runn") || pos === "rb") formattedRoster["RB"].push(name);
      else if (pos.includes("recei") || pos === "wr") formattedRoster["WR"].push(name);
      else if (pos.includes("tight") || pos === "te") formattedRoster["TE"].push(name);
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
