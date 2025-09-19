

fn main() {

    let s = String::from("hello world");
    let mut v: Vec<String> = Vec::new();

    v.push("value".to_string());
    v.push("value123".to_string());

    let hello = &s[0..5];
    let world = &s[6..11];
 
    println!("{}, {}, {}", hello, world, match &v.pop() {
        Some(s) => s,
        None => "没有"
    });
 
 }
