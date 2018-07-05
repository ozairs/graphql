const axios = require('axios');
const url = 'https://megafanz.mybluemix.net/api/team/list?league=';

module.exports = {
    getTeams: function (name, league) {
        console.log('Requested leagues %s', league);
        //if league name not provided, then search all leagues
        if (!league) league = ["nhl", "nba", "mlb", "nfl"];
        var teamRequests = [];
        league.forEach(element => {
            var func = function findTeams() { return axios.get(url + element) };
            teamRequests.push(func());
        })

        return axios.all(teamRequests).then(axios.spread((response1, response2, response3, response4) => {
            var teamsList = [];
            if (response1 && response1.data) {
                response1.data.teams.filter(function (team) {
                    if (team.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found team %s", team.name);
                        teamsList.push(team);
                    }
                });
            }

            if (response2 && response2.data) {
                response2.data.teams.filter(function (team) {
                    if (team.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found team %s", team.name)
                        teamsList.push(team);
                    }
                });
            }

            if (response3 && response3.data) {
                response3.data.teams.filter(function (team) {
                    if (team.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found team %s", team.name)
                        teamsList.push(team);
                    }
                });
            }

            if (response4 && response4.data) {
                response4.data.teams.filter(function (team) {
                    if (team.name.toLowerCase().indexOf(name.toLowerCase()) >=0) {
                        console.log("Found team %s", team.name)
                        teamsList.push(team);
                    }
                });
            }
            return teamsList;

        })).catch(error => {
            console.log(error);
        }); 
    }
};