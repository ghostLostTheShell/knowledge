# keyof

  获取某种类型的所有键,返回联合类型

[ 用例 ]

```ts
interface User{
  name: string;
  age: number;
}

type K1 = keyof User; // "name" | "age"
type K2 = keyof User[]; // number | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | "reverse" | "shift" | "slice" | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" | ... 14 more ... | "includes"
// 对象的propName就算是number也会转换成string
type K3 = keyof { [x: string]: User};  // string | number

```