# typeof

[ 作用 ]
  
  获取一个变量声明或对象的类型

```ts
interface User{
  name: string;
  age: number;
}

const user: User= { name: 'huxianc', age: 25 };
type UserType= typeof user; // -> User

function func(x: number): number[] {
  return [x];
}

type Func = typeof func; // -> (x: number) => number[]

```