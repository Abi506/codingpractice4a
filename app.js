const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
app.use(express.json());

let data = null;
const databaseandServerIntialization = async () => {
  try {
    let databasepath = path.join(__dirname, "cricketTeam.db");
    data = await open({
      filename: databasepath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server Started ${databasepath}`);
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
  }
};
databaseandServerIntialization();
let databaseObjectToResponseObject = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  };
};

app.get(/players/, async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team
    `;
  const getPlayersArray = await data.all(getPlayersQuery);
  console.log(getPlayersArray);
  response.send(
    getPlayersArray.map((eachPlayer) =>
      databaseObjectToResponseObject(eachPlayer)
    )
  );
});

app.post("/players/", async (request, response) => {
  const postPlayerDetails = request.body;
  const { player_name, jersey_number, role } = postPlayerDetails;
  const postPlayerDetailsQuery = `
  INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES(
      '${player_name}',
      ${jersey_number},
      '${role}'
  )
  `;
  const postPlayerDetailsArray = await data.run(postPlayerDetailsQuery);
  response.send("Player Added to Team");
});
module.exports = app;
