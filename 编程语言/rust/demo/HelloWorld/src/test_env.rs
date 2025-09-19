
const MY_VAR: &str = env!("my_var");

fn main(){
  println!("env:var {}", MY_VAR);
}