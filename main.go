package main

import (
	"context"
	"log"
	"net/http"

	"./api"
)

// Main function.
func main() {

	var PORT = ":3005"

	// Serve static files.
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// All routes related to projects.
	http.HandleFunc("/api/get-projects", api.HandleGetProjects)
	http.HandleFunc("/api/create-project", api.HandleCreateProject)
	http.HandleFunc("/api/update-project", api.HandleUpdateProject)
	http.HandleFunc("/api/update-project-deadline", api.HandleUpdateProjectDeadline)
	http.HandleFunc("/api/remove-project", api.HandleRemoveProject)

	// All routes related to project data.
	http.HandleFunc("/api/create-heading", api.HandleCreateHeading)
	http.HandleFunc("/api/update-heading", api.HandleUpdateHeading)
	http.HandleFunc("/api/create-task", api.HandleCreateTask)
	http.HandleFunc("/api/update-task", api.HandleUpdateTask)
	http.HandleFunc("/api/update-task-deadline", api.HandleUpdateTaskDeadline)
	http.HandleFunc("/api/update-task-status", api.HandleUpdateTaskStatus)
	http.HandleFunc("/api/update-data-order", api.HandleUpdateDataOrder)
	http.HandleFunc("/api/remove-data", api.HandleRemoveData)

	// Close db connections.
	defer api.MongoClient.Disconnect(context.TODO())

	log.Println("ltasks server listening at " + PORT)
	if err := http.ListenAndServe(PORT, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
