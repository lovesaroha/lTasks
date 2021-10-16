/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
package api

import "time"

// This function check invalid project title.
func inValidProjectTitle(title string) bool {
	if len(title) < 2 || len(title) > 35 || title == "Inbox" {
		return true
	}
	return false
}

// This function check invalid project description.
func inValidProjectDescription(description string) bool {
	return len(description) > 255
}

// This function checks invalid project tags.
func inValidProjectTags(tags []string) bool {
	if len(tags) > 10 {
		return true
	}
	for _, tag := range tags {
		if len(tag) < 2 || len(tag) > 20 {
			return true
		}
	}
	return false
}

// This function check invalid project heading content.
func inValidHeadingTitle(title string) bool {
	if len(title) < 2 || len(title) > 90 {
		return true
	}
	return false
}

// THis function check invalid id.
func inValidID(id string) bool {
	return len(id) < 6
}

// This function check invalid project task content.
func inValidTaskContent(content string) bool {
	if len(content) < 2 || len(content) > 255 {
		return true
	}
	return false
}

// This function check invalid deadline.
func inValidDeadline(deadline time.Time) bool {
	var today = time.Now().UTC()
	return deadline.Before(today)
}
