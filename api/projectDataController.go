/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
package api

import (
	"encoding/json"
	"net/http"
)

// HandleCreateHeading function listen to post /api/create-heading and save project heading details in database.
func HandleCreateHeading(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := saveHeading(&projectData, project); err != nil {
		// Unable to save project heading details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(projectDataJSON(projectData)))
}

// HandleCreateTask function listen to post /api/create-task and save project task details in database.
func HandleCreateTask(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := saveTask(&projectData, project); err != nil {
		// Unable to save project task details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(projectDataJSON(projectData)))
}

// HandleUpdateHeading function listen to post /api/update-heading and change project heading details in database.
func HandleUpdateHeading(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := updateHeading(projectData, project); err != nil {
		// Unable to update project heading details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated" : true}`))
}

// HandleUpdateTask function listen to post /api/update-task and change project task details in database.
func HandleUpdateTask(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := updateTask(projectData, project); err != nil {
		// Unable to update project task details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated" : true}`))
}

// HandleUpdateTask function listen to post /api/update-task-deadline and change project task deadline details in database.
func HandleUpdateTaskDeadline(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := updateTaskDeadline(projectData, project, req.FormValue("deadline")); err != nil {
		// Unable to update project task details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated" : true}`))
}

// HandleUpdateTaskStatus function listen to post /api/update-task-status and change project task status details in database.
func HandleUpdateTaskStatus(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData projectDataObject
	if json.NewDecoder(req.Body).Decode(&projectData) != nil {
		http.Error(res, `{"error" : "Invalid project data parameters"}`, 400)
		return
	}
	if err := updateTaskStatus(projectData, project); err != nil {
		// Unable to update project task status details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated" : true}`))
}

// HandleUpdateDataOrder function listen to get /api/update-data-order and change project data order details in database.
func HandleUpdateDataOrder(res http.ResponseWriter, req *http.Request) {
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData = projectDataObject{ID: req.FormValue("dataID")}
	if err := updateDataOrder(projectData, project, req.FormValue("moveTo")); err != nil {
		// Unable to update project data order details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated" : true}`))
}

// HandleRemoveData function listen to post /api/remove-data and remove project data details in database.
func HandleRemoveData(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	var projectData = projectDataObject{ID: req.FormValue("dataID")}
	if err := removeData(projectData, project); err != nil {
		// Unable to remove project data details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"removed" : true}`))
}
