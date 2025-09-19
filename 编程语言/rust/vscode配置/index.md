## 配置环境

1. rust的安装位置

配置环境变量

```
CARGO_HOME：${path}
RUSTUP_HOME：${path}
```

2. 安装

  https://www.rust-lang.org/zh-CN/tools/install
  
  - win

3. 装工具链
  - 
  rustup toolchain install nightly-x86_64-pc-windows-gnu　　
  - 安装源码
  rustup component add rust-src --toolchain nightly

4. 配置变量
  1. RUST
    ${rustup_root}\.rustup\toolchains\nightly-i686-pc-windows-msvc

  2. RUST_SRC_PATH
      ${RUST}\lib\rustlib\src\rust\src
  3. RUSTBINPATH
      ${cargo_path}\bin

安装工具链
  
  rustup toolchain install ${版本}

  1. nightly-x86_64-pc-windows-gnu                    
  2. nightly-i686-pc-windows-msvc
  3. stable-x86_64-pc-windows-msvc     　　

  	
  rustup component add rust-src --toolchain [nightly|stable]

参考：
  https://www.cnblogs.com/skzxc/p/12129353.html
* 补全工具

cargo install racer

