#[derive(Debug)]
struct Person {
  name: String,
  age: u8,
}

struct Unit;

struct Pair(i32, f32);

struct Point{
  x: f32,
  y: f32,
}

struct Rectangle{
  top_left: Point,
  bottom_right: Point,
}


fn main(){

  let name = String::from("Peter");
  let age = 27;
  let peter = Person {name, age};
  let v: Vec<i32> = Vec::new();
  v.
  println!("{:?}", peter);
  
}