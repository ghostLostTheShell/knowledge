
以下是针对主流 Linux 发行版的操作指南。假设你的证书文件名为 `mitmproxy-ca-cert.pem`（如果是 `.crt` 也可以）。

---

### 1. Ubuntu / Debian / Kali Linux
这是最常见的系列。

1.  **转换格式（如果需要）**
    如果是 `.pem` 文件，最好先改成 `.crt` 后缀（其实内容一样，只是通过后缀识别）：
    ```bash
    cp mitmproxy-ca-cert.pem mitmproxy.crt
    ```

2.  **复制证书到系统目录**
    需要 `sudo` 权限：
    ```bash
    sudo cp mitmproxy.crt /usr/local/share/ca-certificates/
    ```

3.  **更新系统证书库**
    运行以下命令，系统会扫描目录并自动添加信任：
    ```bash
    sudo update-ca-certificates
    ```
    *如果成功，你会看到类似 `1 added, 0 removed; done.` 的提示。*

---

### 2. CentOS / RHEL / Fedora
红帽系的操作略有不同。

1.  **复制证书到系统目录**
    ```bash
    sudo cp mitmproxy-ca-cert.pem /etc/pki/ca-trust/source/anchors/
    ```

2.  **更新系统信任配置**
    ```bash
    sudo update-ca-trust
    ```

---

### 3. Arch Linux / Manjaro

1.  **复制证书**
    ```bash
    sudo cp mitmproxy-ca-cert.pem /etc/ca-certificates/trust-source/anchors/
    ```

2.  **更新信任**
    ```bash
    sudo trust extract-compat
    ```

---

### 4. 验证是否安装成功

你可以用 `curl` 来测试证书是否生效。

*   **测试前**（如果不加 `-k` 应该会报错）：
    ```bash
    curl https://www.google.com --proxy http://127.0.0.1:8080
    # 报错: curl: (60) SSL certificate problem: self signed certificate in certificate chain
    ```

*   **测试后**（正常访问，无需 `-k`）：
    ```bash
    curl https://www.google.com --proxy http://127.0.0.1:8080
    # 成功返回 HTML 代码
    ```

---

### 5. 特殊情况：为特定程序单独安装

有些程序**不走系统的证书库**，需要单独配置：

*   **Firefox 浏览器**：
    Firefox 有自己的证书数据库。你需要去 Firefox 的 **设置 -> 隐私与安全 -> 查看证书 -> 导入**，手动导入该文件。

*   **Chrome 浏览器 (Linux 版)**：
    通常使用名为 `libnss3-tools` 的工具来管理。
    ```bash
    # 安装工具 (Ubuntu为例)
    sudo apt install libnss3-tools

    # 导入证书到当前用户的数据库
    certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "Mitmproxy" -i mitmproxy-ca-cert.pem
    ```

*   **Python (Requests 库)**：
    Python 的 `requests` 也不一定走系统库。你需要设置环境变量：
    ```bash
    export REQUESTS_CA_BUNDLE=/path/to/mitmproxy-ca-cert.pem
    ```

*   **Node.js**:
    ```bash
    export NODE_EXTRA_CA_CERTS=/path/to/mitmproxy-ca-cert.pem
    ```