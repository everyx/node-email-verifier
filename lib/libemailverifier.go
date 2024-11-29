package main

import (
	"C"
	"encoding/json"

	emailVerifier "github.com/AfterShip/email-verifier"
)

type Result struct {
	Data  *emailVerifier.Result `json:"data"`
	Error *string               `json:"error"`
}

//export Verify
func Verify(e *C.char) *C.char {
	email := C.GoString(e)

	verifier := emailVerifier.NewVerifier().EnableDomainSuggest()

	ret, err := verifier.Verify(email)

	result := Result{Data: ret, Error: nil}
	if err != nil {
		errMsg := err.Error()
		result.Error = &errMsg
	}

	bytes, err := json.Marshal(result)
	if err != nil {
		panic(err)
	}

	return C.CString(string(bytes))
}

//export SuggestDomain
func SuggestDomain(d *C.char) *C.char {
	domain := C.GoString(d)
	verifier := emailVerifier.NewVerifier()
	suggestion := verifier.SuggestDomain(domain)
	return C.CString(suggestion)
}

func main() {}
