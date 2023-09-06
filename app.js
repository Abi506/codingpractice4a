const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let path = require("path");
let database = null;
const intializeDatabaseandServer = async () => {
  try {
    let dbpath = path.join(__dirname, "cricketTeam.db");
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running ${dbpath}`);
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
    process.exit(1);
  }
};

intializeDatabaseandServer();

//App get all players API
let getallplayer = app.get("/players/", async (request, response) => {
  const getallPlayersQuery = `
    SELECT * FROM cricket_team
    `;
  const getallPlayersArray = await database.all(getallPlayersQuery);
  console.log(getallPlayersArray);
  response.send(
    getallPlayersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

//App adding a new player API

let addaPlayer = app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO cricket_team( player_name, jersey_number, role)
  VALUES (
      '${player_name}',
      ${jersey_number},
      '${role}'
  )
  `;
  const dbresponse = await database.run(addPlayerQuery);
  const player_id = dbresponse.lastID;
  response.send({ id: player_id });
});

//App get a player API

let getaPlayer = app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE player_id=${playerId}
    `;
  const getPlayerArray = await database.get(getPlayerQuery);
  response.send("Player Added to Team");
});

//App updating a player API

let updatePlayer = app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;

  const { player_name, jersey_number, role } = playerDetails;
  const playerUpdateQuery = `
     UPDATE cricket_team
     SET 
       player_name='${player_name}',
       jersey_number='${jersey_number}', 
       role='${role}'
     WHERE player_id=${playerId};
    `;
  await database.run(playerUpdateQuery);
  response.send("Player Details Updated");
});

//App Delete a player API

let deletePlayer = app.delete(
  "/players/:playerId/",
  async (request, response) => {
    const { playerId } = request.params;
    const playerDeleteQuery = `
    DELETE FROM cricket_team
    WHERE
      player_id = '${playerId}';`;

    await database.run(playerDeleteQuery);
    response.send("Player Removed");
  }
);
module.exports = app;
