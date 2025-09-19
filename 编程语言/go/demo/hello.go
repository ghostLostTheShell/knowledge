package main

import "fmt"
import "strconv"

func main() {

	var a = 1
	var b = 3
	var b = 0b1111 //二进制
	var O = 010 //八进制
	var x = 0xff

	fmt.Println("Hello, World!----'☺'\u025FF" + strconv.Itoa(a + b))

	s := strconv.QuoteRune('☺')

	fmt.Println(s)

	fmt.Println("%d \n", x)
	fmt.Println("%d \n", x)
	fmt.Println("%d \n", x)
	fmt.Println("%d \n", x)

}