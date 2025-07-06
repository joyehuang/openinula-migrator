
# 开发日志 3: 实现 `--dry-run` 功能与 Codemod 脚本调试

**日期:** 2025-07-06

## 目标

为 CLI 工具添加 `--dry-run` 功能，允许用户在不实际修改文件的情况下预览代码转换结果。同时，解决 `jscodeshift` 在 dry-run 模式下不输出转换代码的问题。

## 完成事项

1.  **`--dry-run` 选项添加**:
    *   在 `index.js` 中使用 `commander` 为 `migrate` 命令添加了 `-d, --dry-run` 选项。
    *   当检测到 `--dry-run` 选项时，CLI 会向 `jscodeshift` 命令传递 `--print` 标志。`--print` 标志会阻止 `jscodeshift` 写入文件，并将转换结果输出到标准输出。

2.  **`transform-useState.js` 脚本调试与优化**:
    *   **问题**: 尽管 `useState` 转换逻辑正确，但 `jscodeshift` 在 dry-run 模式下始终报告文件 `unmodified` (未修改)，且不输出转换后的代码。
    *   **初步尝试**: 尝试同时使用 `-d` 和 `--print` 标志，但未解决问题。
    *   **深入分析**: 发现 `jscodeshift` (通过 Recast) 在生成代码时，会尽可能保留原始格式。如果转换后的 AST 重新生成为字符串后，与原始文件内容完全一致（即使 AST 结构已改变），`jscodeshift` 就会认为文件未被修改。
    *   **解决方案**: 在 `transform-useState.js` 中，引入 `fileModified` 标志来跟踪是否发生了实际的 AST 转换。最关键的是，在返回 `root.toSource()` 时，强制使用 `recast.print(root.get().node, { tabWidth: 4, quote: 'single' }).code;`。通过指定 `tabWidth` 和 `quote` 等格式化选项，强制 `jscodeshift` 生成一个与原始文件不同的字符串，从而使其能够正确识别到文件已被修改。
    *   同时，完善了 `transform-useState.js`，使其在转换 `useState` 的同时，也能从 `import` 语句中移除不再需要的 `useState` 导入。

3.  **功能验证**:
    *   通过执行 `inula-migrator migrate src/example.js --dry-run` 命令，成功在控制台看到了转换后的代码输出，且 `src/example.js` 文件未被修改。

## 遇到的挑战与经验教训

*   `jscodeshift` 的 `dry-run` 和 `print` 行为比预期复杂，需要深入理解其内部机制（特别是与 Recast 的交互）。
*   AST 转换后，即使逻辑上代码已改变，但如果最终生成的字符串与原始文件完全一致，`jscodeshift` 不会报告修改。强制格式化是解决此问题的有效手段。
*   调试这类问题需要耐心和系统性，从最简单的场景开始逐步排除可能性。

## 下一步计划

*   **支持目录递归处理**: 扩展 `migrate` 命令，使其能够处理整个目录下的文件。
*   **动态加载转换脚本**: 允许用户指定要运行的转换脚本，而不是硬编码。
*   **完善报告系统**: 统计成功、失败和跳过的转换，并提供详细的报告。
