/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
package api

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// MongoClient variable.
var MongoClient *mongo.Client

// Set default variables for application usage.
var projectsCollection *mongo.Collection

// Initialize function assign values to default variables.
func init() {

	// Connect to mongo db.
	MongoClient, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_DB")))
	if err != nil {
		log.Fatal("Cannot connect to mongo database.")
	}
	// Check if connected to mongo database.
	if err = MongoClient.Connect(context.TODO()); err != nil {
		log.Fatal("Cannot connect to mongo database.")
	}
	if err = MongoClient.Ping(context.TODO(), readpref.Primary()); err != nil {
		log.Fatal("Unable to ping mongo database.")
	}

	// Projects collection mongo database.
	projectsCollection = MongoClient.Database("ltasks_db").Collection("projects")

	// Print output.
	fmt.Println("Connected to ltasks databases.")
}
