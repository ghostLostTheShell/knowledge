
mod mammal{
  pub trait Mammal {
    pub fn breating(&self){
      println!("呼吸中")
    }
  }
  
  impl<T> Mammal for T{
    
  }

  pub struct Humanity{
      name: String,
      age: u8
  }

  pub struct bird{
    name: String,
    age: u8
  }
  
}
