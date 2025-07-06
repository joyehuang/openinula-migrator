# openInula 2.0 升级迁移工具

这是一个 CLI 工具，旨在帮助开发者将使用 openInula 1.0 语法的项目自动迁移到 openInula 2.0 的响应式语法。

## 安装与设置

1.  **克隆仓库**
    ```bash
    # git clone <your-repo-url>
    cd openinula_migrator
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **链接 CLI 命令**
    为了在本地方便地测试 CLI，请使用 `npm link` 将其链接到全局。
    ```bash
    npm link
    ```

## 使用方法

目前，工具提供一个 `migrate` 命令，可以对指定的文件或目录执行代码转换。

### 语法

```bash
inula-migrator migrate <path-to-file-or-directory> [options]
```

### 选项

*   `-d, --dry-run`: 执行空运行，不会实际修改文件，但会在控制台输出转换后的代码。

### 示例

项目中的 `src/example.js` 文件包含一个 openInula 1.0 的 `useState` 示例。你可以用它来测试迁移工具：

#### 预览转换结果 (推荐)

使用 `--dry-run` 选项来预览转换后的代码，而不会修改原始文件：

```bash
inula-migrator migrate src/example.js --dry-run
```

#### 实际执行转换

如果你想实际修改文件，请省略 `--dry-run` 选项：

```bash
inula-migrator migrate src/example.js
```

执行后，`src/example.js` 中的代码将会被自动更新为 2.0 的语法。