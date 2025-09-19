mod mylib;

use mylib::mammal::Mammal as _;
struct Mammal; 


pub struct App {

    name: &String,

}

impl App {
    pub  fn new() -> Self {}
}


fn main() {
    let a = [1,2,3];

    let mut iter = a.iter();

    let ruster = 'exit: loop {
        let next = iter.next();
        match next {
            Some(x) => {
                println!("??{}", x);
            },
            None => {
                println!("跳出循环");
                break 'exit(122);
            },
        }
    };

    println!("循环的结果{}", ruster)

    let mammal= Mammal;

    // assert_eq!(Some(&1), );
    // assert_eq!(Some(&1), iter.next());
    
}