/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
package api

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
)

// Project object structure is defined here.
type projectObject struct {
	ID          string              `json:"_id,omitempty" bson:"_id,omitempty"`
	Token       string              `json:"token,omitempty" bson:"token,omitempty"`
	Title       string              `json:"title,omitempty" bson:"title,omitempty"`
	Description string              `json:"description,omitempty" bson:"description,omitempty"`
	IsDefault   bool                `json:"isDefault,omitempty" bson:"isDefault,omitempty"`
	Deadline    time.Time           `json:"deadline,omitempty" bson:"deadline,omitempty"`
	Tags        []string            `json:"tags,omitempty" bson:"tags,omitempty"`
	Data        []projectDataObject `json:"data,omitempty" bson:"data,omitempty"`
	CreatedAt   time.Time           `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	UpdatedAt   time.Time           `json:"updatedAt,omitempty" bson:"updatedAt,omitempty"`
}

// Project token structure defined here.
type projectTokenObject struct {
	CreatedBy string `json:"createdBy"`
	ID        string `json:"_id"`
	IsDefault bool   `json:"isDefault" bson:"isDefault"`
	jwt.StandardClaims
}

// This function return json string of projects.
func projectsJSON(projects []projectObject) string {
	if len(projects) < 1 {
		return "[]"
	}
	s, err := json.Marshal(projects)
	if err != nil {
		return "[]"
	}
	return string(s)
}

// This function return json string of project.
func projectJSON(project projectObject) string {
	project.Token = encryptProjectToken(project)
	s, _ := json.Marshal(project)
	return string(s)
}

// This function find user projects in database.
func findProjects() ([]projectObject, error) {
	var projects []projectObject
	cursor, err := projectsCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		return projects, handleError("Unable to find user's projects")
	}
	defer cursor.Close(context.TODO())
	for cursor.Next(context.TODO()) {
		var project projectObject
		cursor.Decode(&project)
		projects = append(projects, project)
	}
	if err != nil {
		return projects, handleError("Unable to find user's projects")
	}
	for i, project := range projects {
		if project.Title == "Inbox" {
			projects[i].IsDefault = true
		}
		projects[i].Token = encryptProjectToken(project)
	}
	if len(projects) < 1 {
		projects, err = createDefaultProjects()
		if err != nil {
			return projects, err
		}
	}
	return projects, nil
}

// This function create default projects.
func createDefaultProjects() ([]projectObject, error) {
	var projects []projectObject
	var inbox = projectObject{ID: "Inbox", IsDefault: true, Title: "Inbox", Description: "Inbox", CreatedAt: time.Now().UTC(), UpdatedAt: time.Now().UTC()}
	if _, err := projectsCollection.InsertOne(context.TODO(), inbox); err != nil {
		// Project details not saved in database.
		return projects, handleError("Unable to save default projects")
	}
	inbox.Token = encryptProjectToken(inbox)
	projects = append(projects, inbox)
	return projects, nil
}

// This function save project details in database.
func saveProject(project *projectObject) error {
	if inValidProjectTitle(project.Title) || inValidProjectDescription(project.Description) {
		return handleError("invalid project title or description")
	}
	project.ID = generateID()
	project.CreatedAt = time.Now().UTC()
	project.UpdatedAt = project.CreatedAt
	project.Deadline = project.CreatedAt
	go func() {
		if _, err := projectsCollection.InsertOne(context.TODO(), project); err != nil {
			// Project details not saved in database.
			go saveLog("Project details not saved")
			return
		}
	}()
	return nil
}

// This function update project details.
func updateProject(project projectObject) error {
	if inValidProjectTitle(project.Title) || inValidProjectDescription(project.Description) || inValidProjectTags(project.Tags) || project.IsDefault {
		return handleError("invalid project parameters")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "title": bson.M{"$ne": "Inbox"}}, bson.M{"$set": bson.M{"title": project.Title, "description": project.Description, "tags": project.Tags, "updatedAt": time.Now().UTC()}})
		if result.Err() != nil {
			// Project details not changed in database.
			go saveLog("Project details not changed")
			return
		}
		var savedProject projectObject
		result.Decode(&savedProject)
	}()
	return nil
}

// This function update project deadline details.
func updateProjectDeadline(project projectObject, timeStamp string) error {
	timeInt, err := strconv.Atoi(timeStamp)
	if err != nil {
		return handleError("invalid project deadline")
	}
	project.Deadline = time.Unix(int64(timeInt)/1000, (int64(timeInt)%1000)*1000*1000).UTC()
	if inValidDeadline(project.Deadline) || project.IsDefault {
		// Invalid project deadline.
		return handleError("cannot update deadline")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "title": bson.M{"$ne": "Inbox"}}, bson.M{"$set": bson.M{"deadline": project.Deadline, "updatedAt": time.Now().UTC()}})
		if result.Err() != nil {
			// Project details not changed in database.
			go saveLog("Project deadline not changed")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function remove given project in database.
func removeProject(project projectObject) error {
	if project.IsDefault {
		return handleError("cannot remove this project")
	}
	go func() {
		result := projectsCollection.FindOneAndDelete(context.TODO(), bson.M{"_id": project.ID})
		if result.Err() != nil {
			go saveLog("Project not removed")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function encrypts project's sensitive details using key.
func encryptProjectToken(project projectObject) string {
	expirationTime := time.Now().Add(12 * time.Hour)
	claims := &projectTokenObject{
		ID:        project.ID,
		IsDefault: project.IsDefault,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte("qwertyuiopasdfghjklzxcvbnmlkjhgf"))
	return tokenString
}

// This function decrypt project's sensitive details using key.
func invalidProjectToken(project *projectObject) bool {
	claims := &projectTokenObject{}
	if token, err := jwt.ParseWithClaims(project.Token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("qwertyuiopasdfghjklzxcvbnmlkjhgf"), nil
	}); err != nil || !token.Valid {
		return true
	}
	project.ID = claims.ID
	project.IsDefault = claims.IsDefault
	return false
}
