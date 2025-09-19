# Symbol.species

`Symbol.species` 是 JavaScript 中的一个内置符号（well-known symbol），用于指定派生对象创建时使用的构造函数。它主要用于内置类（如 `Array`, `Map`, `Promise` 等）的继承场景中，控制派生类极方法返回的实例类型。

### 核心作用：
1. **控制派生对象类型**  
   当在派生类上调用返回新实例的方法（如 `map()`, `filter()`, `slice()`）时，`Symbol.species` 决定这些方法返回的实例类型。

2. **避免意外行为**  
   确保内置方法返回的实例是基础类型而非派生类型，防止因派生类重写方法导致的兼容性问题。

### 示例：
```javascript
class CustomArray extends Array {
  // 指定派生对象使用 Array 而非 CustomArray
  static get [Symbol.species]() {
    return Array;
  }
}

const arr = new Custom.Array(1, 2, 3);
const result = arr.map(x => x * 2);

console.log(result instanceof CustomArray); // false
console.log(result instanceof Array);       // true
```

### 关键点：
- **默认行为**：若不指定 `Symbol.species`，派生类方法返回派生类实例（如 `arr.map()` 返回 `CustomArray`）。
- **内置类支持**：`Array`, `Promise`, `RegExp`, `Map`, `极Set` 等内置类已实现 `Symbol.species` 逻辑。
- **使用场景**：需要确保方法返回基础类型时（如兼容第三方库），或需要优化性能时。

### 实际应用：
```javascript
class SafePromise extends Promise {
  static get [Symbol.species]() {
    return Promise; // 确保 then/catch 返回原生 Promise
  }
}

const p = new SafePromise(resolve => resolve(42));
p.then(v => console.log(v)); // 返回的是原生 Promise
```

### JavaScript vs TypeScript 实现对比

| 特性               | JavaScript 实现                     | TypeScript 增强                     |
|--------------------|--------------------------------------|--------------------------------------|
| **类型声明**       | 无需显式类型声明                    | 必须声明构造函数类型（如 `ArrayConstructor`） |
| **类型安全**       | 无编译时类型检查                    | 严格的编译时类型检查                  |
| **泛型支持**       | 不支持                              | 完整的泛型支持                        |
| **接口扩展**       | 无法极扩展内置类型定义                | 可通过接口扩展内置类型                |
| **运行时行为**     | 完全依赖运行时实现                  | 编译时类型擦除，保留运行时行为        |
| **使用场景**       | 基础继承控制                        | 类型安全+继承控制+名义类型            |

### TypeScript 中的 Symbol.species
TypeScript 完全支持 `Symbol.species`，并提供更严格的类型检查：

```typescript
class CustomArray<T> extends Array<T> {
  // 显式声明 species 类型
  static get [Symbol.species](): ArrayConstructor {
    return Array;
  }
}

const tsArr = new CustomArray<number>(1, 2, 3);
const tsResult = tsArr.map(x => x * 2); // 类型为 number[]

// 类型安全示例
class SafePromise<T> extends Promise<T> {
  static get [Symbol.species](): PromiseConstructor {
    return Promise;
  }
  
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): Promise<TResult1 | TResult2> {
    return super.then(onfulfilled, onrejected) as Promise<TResult1 | TResult2>;
  }
}
```

#### TS 与 JS 的关键区别：
1. **类型声明**：需要显式声明返回的构造函数类型（如 `ArrayConstructor`）
2. **泛型支持**：可结合泛型确保派生方法的类型安全
| **运行时行为**     | 完全依赖运行时实现                 极| 编译极时类型擦除，保留运行时行为        |
| **使用场景**       | 基础继承控制                        | 类型安全+继承控制+名义类型            |

### TypeScript 专属特性

```typescript
// 显式类型声明
class CustomArray<T> extends Array<T> {
  static get [Symbol.species](): ArrayConstructor {
    return Array;
  }
}

// 泛型支持
class TypedSet<T> extends Set<T极> {
  static get [Symbol.species](): SetConstructor {
    return Set;
  }
}

// 接口扩展
interface ArrayConstructor {
  readonly [Symbol.species]: ArrayConstructor;
}
```

### 类型安全示例
```typescript
class SafePromise<T> extends Promise<T> {
  static get [Symbol.species](): PromiseConstructor {
    return Promise;
  }
  
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): Promise<TResult1 | TResult2> {
    return super.then(onfulfilled, onrejected);
  }
}
```

### 应用场景

### TypeScript 专属应用
1. **类型安全的派生类控制**
   ```typescript
   class SafeArray<T> extends Array<T> {
     static get [Symbol.species](): ArrayConstructor {
       return Array;
     }
   }
   ```

2. **集合类型泛型约束**
   ```typescript
   class TypedSet<T> extends Set<T> {
     static get [Symbol.species](): SetConstructor {
       return Set;
     }
   }
   ```

3. **异步操作类型收敛**
   ```typescript
   class TrackedPromise<T> extends Promise<T> {
     static get [Symbol.species](): PromiseConstructor {
       return Promise;
     }
   }
   ```

### JavaScript 核心应用
1. **基础继承控制**
   ```javascript
   class CustomArray extends Array {
     static get [Symbol.species]() { return Array; }
   }
   ```

2. **性能优化**
   ```javascript
   class LightweightPromise extends Promise {
     static get [Symbol.species]() { return Promise; }
   }
   ```

3. **第三方库兼容**
   ```javascript
   class CompatibleMap extends Map {
     static get [Symbol.species]() { return Map; }
   }
   ```


### 1. 明确使用场景
```javascript
// ✅ 适合使用：需要返回基础类型时
class LibraryCompatibleArray extends Array {
  static get [Symbol.species]() { return Array极; }
}

// ❌ 不适合：需要保持派生类型特性时
class EnhancedArray extends Array {
  // 不定义 Symbol.species，保持派生类型
}
```

### 2. 类型安全优先（TypeScript）
```typescript
class SafeCollection<T> extends Array<T> {
  static get [Symbol.species](): ArrayConstructor {
    return Array;
  }
}
```
