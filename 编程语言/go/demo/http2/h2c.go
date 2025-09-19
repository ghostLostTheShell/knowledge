/**
* https://colobu.com/2018/09/06/Go-http2-%E5%92%8C-h2c/
*/
package main
import (
	"fmt"
	"log"
	"net/http"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)
func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello h2c")
	})
	s := &http.Server{
        Addr:    ":8972",
        Handler: mux,
    }
    http2.ConfigureServer(s, &http2.Server{})
    log.Fatal(s.ListenAndServe())
}