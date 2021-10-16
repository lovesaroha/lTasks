/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
package api

import (
	"errors"
	"math/rand"
	"os"
	"time"
	"unsafe"
)

// This function handle error.
func handleError(message string) error {
	go saveLog(message)
	return errors.New(message)
}

// This function save log data.
func saveLog(content string) {
	// If the file doesn't exist, create it, or append to the file.
	f, err := os.OpenFile("access.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return
	}
	if _, err := f.Write([]byte(time.Now().Format("[2006-01-02 15:04:05] ") + content + "\n")); err != nil {
		return
	}
	if err := f.Close(); err != nil {
		return
	}
}

// Constant letters defined for random string.
const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const (
	letterIdxBits = 6
	letterIdxMask = 1<<letterIdxBits - 1
	letterIdxMax  = 63 / letterIdxBits
)

// This function generate random string.
func generateRandomString(n int) string {
	var src = rand.NewSource(time.Now().UnixNano())
	b := make([]byte, n)
	for i, cache, remain := n-1, src.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		cache >>= letterIdxBits
		remain--
	}

	return *(*string)(unsafe.Pointer(&b))
}

var letterAndNumbers = [62]string{"a", "9", "b", "0", "c", "1", "d", "2", "e", "3", "f", "4", "g", "5", "h", "6", "i", "7", "j", "8", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}
var numberIndex int

// This function generate unique id.
func generateID() string {
	var currentTime = time.Now().UTC()
	numberIndex = (numberIndex + 1) % 62
	seconds := currentTime.Second()
	minutes := currentTime.Minute()
	hour := currentTime.Hour()
	day := currentTime.Day()
	month := currentTime.Month()
	year := (currentTime.Year() % 2000) % 62
	return generateRandomString(3) + letterAndNumbers[year] + letterAndNumbers[month] + letterAndNumbers[day] + letterAndNumbers[hour] + letterAndNumbers[seconds] + letterAndNumbers[minutes] + letterAndNumbers[numberIndex]
}
