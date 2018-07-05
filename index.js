const fs = require('fs');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
var cfenv = require('cfenv');

var players = require("./players");
var teams = require("./teams");

var isLocal = true;
var appEnv = cfenv.getAppEnv();

//sends an introspection query to the API, grabs the entire schema, 
//and builds an interactive documentation for that endpoint
const { makeExecutableSchema } = require('graphql-tools'); 
const schemaFile = path.join(__dirname, 'sports.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

//The signature of resolver function is (previousValue, parameters) => data.
const resolvers = {
    Query: {
        Teams: (_, { name, league }, context, info) => {
            return teams.getTeams(name, league).then( (result) => {
                console.log(result);
                return result;
            });
        },
        Players: (_, { name, league }, context, info) => {
            return players.getPlayers(name, league).then( (result) => {
                console.log(result);
                return result;
            });
        }
        
    }, 
    Team: {
        name: team => team.name,
        arena: team => team.arena,
        city: team => team.city,
        homepage: team  => team.homepage,
    },
    Player: {
        name: player => player.name,
        league: player => player.league,
        position: player => player.position,
        picture: player => player.picture,
        team: player => teams.getTeams(player.team, player.league.split()).then( (result) => {
            console.log(result);
            return result;
        })
    }
};


// pass the resolver map as second argument
const schema = makeExecutableSchema({ typeDefs, resolvers });

// proceed with the express app setup
var app = express();


//run local node server
if (isLocal) {
    app.use('/sports/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
    }));
    app.listen(4000);
    console.log('Running a GraphQL API server at localhost:4000/graphql');
}
else {
    console.log("Listening on: " + appEnv.port);
    app.listen(appEnv.port);
}

/**
 * https://graphql.org/learn/execution/
 * 
 * query { 
 *  Team (name: "Toronto", league: [mlb, nba, nhl, nfl]) { 
 *      league
 *      name 
 *      city 
 *      arena
 *  }
 *  Players (name: "John", league: [nhl, nba, mlb, nfl]) { 
  	    name
  	    league
          picture
          team {
            name
            arena
            city    
        }
	} 
 * }
 * 
 */
