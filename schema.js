// Require mongo client package.
// Install mongodb package (npm i mongodb);
const MongoClient = require('./node_modules/mongodb').MongoClient;
var connection = process.env["MONGO_DB"];

// Connect to database.
MongoClient.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function (client) {
        const db = client.db('ltasks_db');
        db.createCollection("projects", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    properties: {
                        title: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        description: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        createdAt: {
                            bsonType: "date",
                            description: "must be a date and is required"
                        },
                        updatedAt: {
                            bsonType: "date",
                            description: "must be a date and is required"
                        },
                        deadline: {
                            bsonType: "date",
                            description: "must be a number and is required"
                        },
                        tags: {
                            bsonType: "array",
                            description: "must be a array and is not required"
                        },
                        data: {
                            bsonType: "array",
                            description: "must be a array and is required"
                        },
                        isDefault: {
                            bsonType: "bool",
                            description: "must be a bool and is required" 
                        } 
                    }
                }
            }
        }).then(function (r) {
            console.log("Projects collection created..");
            client.close();
        }).catch(e => { console.log(e); });
    }).catch(e => { console.log(e); });