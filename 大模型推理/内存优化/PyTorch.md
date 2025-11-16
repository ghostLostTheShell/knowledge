
#

## 设置环境变量 PYTORCH_CUDA_ALLOC_CONF

`PYTORCH_CUDA_ALLOC_CONF` 是 PyTorch 的环境变量，用于控制 CUDA 内存分配的行为。
设置 `'expandable_segments:True'` 启用可扩展内存段功能。这允许内存分配器在必要时扩展内存块的大小，而不是严格限制在预分配的大小范围内，从而减少内存碎片化，提高内存利用效率。这在训练大型模型或处理大量 GPU 内存操作时特别有用，可以防止内存不足错误并优化性能。

设置方法
```python
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'expandable_segments:True'
```

## 限制GPU内存

`torch.cuda.set_per_process_memory_fraction(0.9)` 的作用是限制当前 PyTorch 进程对 GPU 内存的使用比例。具体来说：

- `torch.cuda.set_per_process_memory_fraction(fraction)` 是 PyTorch 中的函数，用于设置当前进程可以分配的 GPU 内存上限。
- 参数 `0.9` 表示该进程最多可以使用 GPU 总内存的 90%，即保留 10% 的内存给其他进程或系统操作。
- 这有助于防止内存不足错误（Out-of-Memory），特别是在多进程共享 GPU 或处理大型模型时，确保系统稳定性并避免与其他进程的冲突。
