## Age Gate

This example Zk Program stores a counter of accepted, a counter of rejected, and a method to check an input age.

If the age is above a required limit, the accepted counter is incremented, else the rejected counter is incremented.

The 2 counters are stored in a single packed UInt, and the data type for age is a packed string.
