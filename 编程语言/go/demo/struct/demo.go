package main

import (
    "fmt"
)

type s1 struct {
	a1   uint
	a2 string
	a3 string
}

func main() {

	var w = map[string]*s1{}
	
	w["qq1"] = &s1{a1: 50}
	fmt.Println(w)
	fmt.Println(w["qq1"].a1)
}