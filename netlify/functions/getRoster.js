exports.handler = async function(event, context) {
  // Grab the secret key from your Netlify Environment Variables
  const apiKey = process.env.API_FOOTBALL_KEY;
  
  // Get the team ID passed from the frontend (defaults to Chiefs if missing)
  const teamId = event.queryStringParameters.teamId || "17";
  
  // We use the 2024 season because it has the most complete roster data for free tiers
  const url = `https://v1.american-football.api-sports.io/players?team=${teamId}&season=2024`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    // If the API returns nothing or an error, tell the frontend
    if (!data.response || data.response.length === 0) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ error: "No players found in API response." }) 
      };
    }

    // Initialize the clean roster object
    let formattedRoster = {
      "QB": [],
      "RB": [],
      "WR": [],
      "TE": []
    };

    // FUZZY MATCHING LOGIC:
    // This scans every player and looks for specific keywords in their position string.
    data.response.forEach(item => {
      const name = item.name;
      const pos = (item.position || "").toLowerCase();

      if (pos.includes("quar") || pos === "qb") {
        formattedRoster["QB"].push(name);
      } 
      else if (pos.includes("runn") || pos === "rb") {
        formattedRoster["RB"].push(name);
      } 
      else if (pos.includes("recei") || pos === "wr") {
        formattedRoster["WR"].push(name);
      } 
      else if (pos.includes("tight") || pos === "te") {
        formattedRoster["TE"].push(name);
      }
    });

    // Send the filtered JSON back to the app
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedRoster)
    };

  } catch (error) {
    // If the server crashes or the fetch fails
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Internal Server Error: " + error.message }) 
    };
  }
};
