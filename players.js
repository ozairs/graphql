const axios = require('axios');
const url = "https://megafanz.mybluemix.net/api/player/list?league=";
module.exports = {
    getPlayers : function (name, league) {
    
        //if league name not provided, then search all leagues
        if (!league) league = ["nhl", "nba", "mlb", "nfl"];

        var playerRequests = [];
        league.forEach(element => {
            var func = function findPlayers() { return axios.get(url + element) };
            playerRequests.push(func());
        })

        return axios.all(playerRequests).then(axios.spread((response1, response2, response3, response4) => {
            var playerList = [];
            if (response1 && response1.data) {
                response1.data.filter(function (player) {
                    if (player.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found player %s", player.name);
                        playerList.push(player);
                    }
                });
            }

            if (response2 && response2.data) {
                response2.data.filter(function (player) {
                    if (player.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found player %s", player.name)
                        playerList.push(player);
                    }
                });
            }

            if (response3 && response3.data) {
                response3.data.filter(function (player) {
                    if (player.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found player %s", player.name)
                        playerList.push(player);
                    }
                });
            }

            if (response4 && response4.data) {
                response4.data.filter(function (player) {
                    if (player.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found player %s", player.name)
                        playerList.push(player);
                    }
                });
            }
            return playerList;

        })).catch(error => {
            console.log(error);
        }); 
    }
};