package main

import "fmt"


type Person struct{
	name string
	age int
}

func (p *Person) toString() string{
	return p.name
}
func (p *Person) say(){
	fmt.Printf("我叫%v, %v岁\n", p.name, p.age)
}

func (p *Person) hit(obj Person){
	fmt.Printf("%v 打了 %v\n", p.name, obj.name)
}

func main() {
	p := Person{"xxz",18}

    p1 := Person{name : "用户2", age: 18}
    
    p.say()
	p1.say()
	
	p.hit(p1)

}