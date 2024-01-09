## v0.5

- Making PackedString class 31 characters instead of 15
  - This has implications in any source code using the default packed string implementation
  - Unpacked character arrays will now be 31 characters long, so code expecting a 15-character array may break!
