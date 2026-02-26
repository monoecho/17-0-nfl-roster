exports.handler = async function(event, context) {
  // Grab the hidden key from the Netlify dashboard vault
  const apiKey = process.env.API_FOOTBALL_KEY;
  
  // Dynamically grab the team ID sent from your frontend game
  // If the frontend fails to send an ID, it defaults to 17 (Chiefs) so the app doesn't crash
  const teamId = event.queryStringParameters.teamId || "17";
  
  // Notice the backticks (`) instead of quotes. This injects the variable into the URL.
  const url = `https://v1.american-football.api-sports.io/players?team=${teamId}&season=2024`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "No players found for this team." }) };
    }

    // Run your filter logic to strip out the noise
    let formattedRoster = { "QB": [], "RB": [], "WR": [], "TE": [] };

    data.response.forEach(item => {
      const name = item.name;
      const pos = item.position;
      
      if (pos === "Quarterback" || pos === "QB") formattedRoster["QB"].push(name);
      else if (pos === "Running Back" || pos === "RB") formattedRoster["RB"].push(name);
      else if (pos === "Wide Receiver" || pos === "WR") formattedRoster["WR"].push(name);
      else if (pos === "Tight End" || pos === "TE") formattedRoster["TE"].push(name);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(formattedRoster)
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed fetching data from the API." }) };
  }
};
