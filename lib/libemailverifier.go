package main

import (
	"C"
	"encoding/json"
	"fmt"

	emailVerifier "github.com/AfterShip/email-verifier"
)

type Result struct {
	Data  *emailVerifier.Result `json:"data"`
	Error error                 `json:"error"`
}

//export Verify
func Verify(e *C.char) *C.char {
	email := C.GoString(e)

	var result Result

	verifier := emailVerifier.NewVerifier().EnableDomainSuggest()
	ret, err := verifier.Verify(email)
	if err != nil {
		result = Result{
			Data:  nil,
			Error: err,
		}
	} else {
		result = Result{
			Data:  ret,
			Error: nil,
		}
	}

	bytes, err := json.Marshal(result)
	if err != nil {
		return C.CString(fmt.Sprintf("{error:%s}", err.Error()))
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
