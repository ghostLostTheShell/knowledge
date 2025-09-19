
#[derive(Clone, Copy)]
struct Point {x:i32, y: i32}


struct Test { name: String }

impl Test {
    pub fn new(name: String)-> Self{
        Test {
            name: name
        }
    }
}


fn main() {
    let s = String::from("xxxx");
    println!("length: {}", s.len());
    println!("length: {}", (&s).len());
    println!("length: {}", (&&&&&&&&&&&&&s).len());

    //----------------------

    let b = Box::new(5);

    print!("{}", b);
}
