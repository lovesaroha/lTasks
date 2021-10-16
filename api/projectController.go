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

// HandleGetProjects function listen to get /api/get-projects and return user projects.
func HandleGetProjects(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	projects, err := findProjects()
	if err != nil {
		// Unable to get user projects.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(projectsJSON(projects)))
}

// HandleCreateProject function listen to post /api/create-project and save project details in database.
func HandleCreateProject(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project projectObject
	if json.NewDecoder(req.Body).Decode(&project) != nil {
		http.Error(res, `{"error" : "Invalid project parameters"}`, 400)
		return
	}
	if err := saveProject(&project); err != nil {
		// Unable to save project details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(projectJSON(project)))
}

// HandleUpdateProject function listen to post /api/update-project and change project details in database.
func HandleUpdateProject(res http.ResponseWriter, req *http.Request) {
	defer req.Body.Close()
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if json.NewDecoder(req.Body).Decode(&project) != nil {
		http.Error(res, `{"error" : "Invalid project parameters"}`, 400)
		return
	}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDPROJECTTOKEN"}`, 500)
		return
	}
	if err := updateProject(project); err != nil {
		// Unable to change project details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated": true}`))
}

// HandleUpdateProjectDeadline function listen to post /api/update-project-deadline and change project deadline details in database.
func HandleUpdateProjectDeadline(res http.ResponseWriter, req *http.Request) {
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	if err := updateProjectDeadline(project, req.FormValue("deadline")); err != nil {
		// Unable to change project deadline details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"updated": true}`))
}

// HandleRemoveProject function listen to get /api/remove-project and remove given project in database.
func HandleRemoveProject(res http.ResponseWriter, req *http.Request) {
	var project = projectObject{Token: req.Header.Get("X-Data-Token")}
	if invalidProjectToken(&project) {
		http.Error(res, `{"error" : "INVALIDTOKEN"}`, 500)
		return
	}
	if err := removeProject(project); err != nil {
		// Unable to remove project details in database.
		http.Error(res, `{"error" : "`+err.Error()+`"}`, 400)
		return
	}
	res.Write([]byte(`{"removed": true}`))
}
