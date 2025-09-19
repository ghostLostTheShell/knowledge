## 循环

- loop

  - break

    ```rust
    
    's1: loop{
      loop{
        break 's1;
      }
    }

    ```
  
  - 返回值
    ```rust
      let x = loop{
        break 20;
      }

      
      let x = 's1: loop{
      loop{
        break 's1(10);
      }
    }
    ```