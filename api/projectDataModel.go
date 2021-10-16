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

	"go.mongodb.org/mongo-driver/bson"
)

// Project data object structure defined here.
type projectDataObject struct {
	ID          string    `json:"_id,omitempty" bson:"_id,omitempty"`
	Content     string    `json:"content,omitempty" bson:"content,omitempty"`
	CreatedAt   time.Time `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	Completed   bool      `json:"completed,omitempty" bson:"completed,omitempty"`
	CompletedOn time.Time `json:"completedOn,omitempty" bson:"completedOn,omitempty"`
	Deadline    time.Time `json:"deadline,omitempty" bson:"deadline,omitempty"`
	IsTask      bool      `json:"isTask,omitempty" bson:"isTask,omitempty"`
}

// This function return project data in json string.
func projectDataJSON(projectData projectDataObject) string {
	s, _ := json.Marshal(projectData)
	return string(s)
}

// This function save heading details in database.
func saveHeading(projectData *projectDataObject, project projectObject) error {
	if inValidHeadingTitle(projectData.Content) {
		return handleError("cannot add new heading")
	}
	projectData.ID = generateID()
	projectData.CreatedAt = time.Now().UTC()
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID}, bson.M{"$push": bson.M{"data": projectData}})
		if result.Err() != nil {
			// Unable to add new heading in project data.
			go saveLog("New heading not saved")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function update heading details in database.
func updateHeading(projectData projectDataObject, project projectObject) error {
	if inValidID(projectData.ID) || inValidHeadingTitle(projectData.Content) {
		return handleError("cannot update heading")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "data._id": projectData.ID}, bson.M{"$set": bson.M{"data.$.content": projectData.Content}})
		if result.Err() != nil {
			// Unable to update heading details in project data.
			go saveLog("Heading details not updated")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function save task details in database.
func saveTask(projectData *projectDataObject, project projectObject) error {
	if inValidTaskContent(projectData.Content) {
		return handleError("cannot add new task")
	}
	projectData.ID = generateID()
	projectData.CreatedAt = time.Now().UTC()
	projectData.IsTask = true
	projectData.Deadline = projectData.CreatedAt
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID}, bson.M{"$push": bson.M{"data": projectData}})
		if result.Err() != nil {
			// Unable to add new task in project data.
			go saveLog("New task not saved")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function update task details in database.
func updateTask(projectData projectDataObject, project projectObject) error {
	if inValidID(projectData.ID) || inValidTaskContent(projectData.Content) {
		return handleError("cannot update task")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "data._id": projectData.ID}, bson.M{"$set": bson.M{"data.$.content": projectData.Content}})
		if result.Err() != nil {
			// Unable to update task details in project data.
			go saveLog("Task details not updated")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function update task deadline.
func updateTaskDeadline(projectData projectDataObject, project projectObject, timeStamp string) error {
	timeInt, err := strconv.Atoi(timeStamp)
	if err != nil {
		return handleError("invalid task deadline")
	}
	projectData.Deadline = time.Unix(int64(timeInt)/1000, (int64(timeInt)%1000)*1000*1000).UTC()
	if inValidDeadline(projectData.Deadline) {
		// Invalid task deadline.
		return handleError("invalid deadline")
	}
	if inValidID(projectData.ID) {
		return handleError("cannot update task")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "data._id": projectData.ID}, bson.M{"$set": bson.M{"data.$.deadline": projectData.Deadline}})
		if result.Err() != nil {
			// Unable to update task details in project data.
			go saveLog("Task deadline details not updated")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function update task status details in database.
func updateTaskStatus(projectData projectDataObject, project projectObject) error {
	if inValidID(projectData.ID) {
		return handleError("cannot update task status")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID, "data._id": projectData.ID}, bson.M{"$set": bson.M{"data.$.completed": projectData.Completed, "data.$.completedOn": time.Now().UTC()}})
		if result.Err() != nil {
			// Unable to update task status details in project data.
			go saveLog("Task status details not updated")
			return
		}
		result.Decode(&project)
	}()
	return nil
}

// This function update data order details in database.
func updateDataOrder(projectData projectDataObject, project projectObject, indexValue string) error {
	if inValidID(projectData.ID) {
		return handleError("cannot update order")
	}
	moveTo, err := strconv.Atoi(indexValue)
	if err != nil || moveTo < 0 {
		return handleError("invalid index value")
	}
	go func() {
		result := projectsCollection.FindOne(context.TODO(), bson.M{"_id": project.ID})
		if result.Err() != nil {
			// project not found with given id.
			go saveLog("Project detail not found for data order change")
			return
		}
		result.Decode(&project)
		if moveTo > len(project.Data) {
			return
		}
		projectData, dataIndex := findProjectDataByID(project.Data, projectData.ID)
		if dataIndex == -1 || dataIndex == moveTo {
			return
		}
		// Change data order details.
		var newOrder []projectDataObject
		for i, data := range project.Data {
			if projectData.ID == data.ID {
				continue
			}
			if moveTo == i {
				if dataIndex < i {
					// Data is moved from top to bottom.
					newOrder = append(newOrder, data)
					newOrder = append(newOrder, projectData)
				} else {
					// Data is moved from bottom to top.
					newOrder = append(newOrder, projectData)
					newOrder = append(newOrder, data)
				}
				continue
			}
			newOrder = append(newOrder, data)
		}
		if result, err := projectsCollection.UpdateOne(context.TODO(), bson.M{"_id": project.ID}, bson.M{"$set": bson.M{"data": newOrder}}); err != nil || result.ModifiedCount == 0 {
			// Unable to change data order details in project data.
			return
		}
	}()
	return nil
}

// This function find given project data.
func findProjectDataByID(list []projectDataObject, id string) (projectDataObject, int) {
	for i, data := range list {
		if data.ID == id {
			return data, i
		}
	}
	return projectDataObject{ID: "NO"}, -1
}

// This function remove given project data.
func removeData(projectData projectDataObject, project projectObject) error {
	if inValidID(projectData.ID) {
		return handleError("cannot remove data")
	}
	go func() {
		result := projectsCollection.FindOneAndUpdate(context.TODO(), bson.M{"_id": project.ID}, bson.M{"$pull": bson.M{"data": bson.M{"_id": projectData.ID}}})
		if result.Err() != nil {
			// Unable to remove project data.
			go saveLog("Project data not removed")
			return
		}
		result.Decode(&project)
	}()
	return nil
}
