
struct App<'a>  {
    name: &'a str
}


impl <'a> App<'a> {
    pub fn new(name: & 'a str) -> Self {
        App {
            name: name
        }
    }

    #[warn(non_snake_case)]
    pub fn get_name(self) -> &'a str{
        self.name
    }
}
fn main() {
    let x = "abc";

    let app = App::new(x);
    
    let name = app.get_name();

    println!("{}", name);
}
