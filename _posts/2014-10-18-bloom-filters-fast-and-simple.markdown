---
layout: post
title:  "Bloom filters, fast and simple"
date:   2014-10-18 11:14:00
---

Everyone is always raving about bloom filters. But what exactly are they, and what are they useful for?

> The Bloom filter is a space efficient, probabilistic data structure – used to test whether an item does not belong to a collection.

## Operations

The basic bloom filter supports two operations: __add__ and __query__.

__Query__ is used to check whether a given element is in the set or not. It can only return a boolean value:

* _true_, if element is __probably__ in the set.
* _false_, if element is __definitely not__ in the set.

__Add__ simply adds an element to the set.

Removal is impossible without introducing false negatives, but there are versions where is possible to remove element e.g. [counting filters](http://en.wikipedia.org/wiki/Bloom_filter#Counting_filters).

## Structure

![Diagram](/assets/images/prints/bloom-fig1-11.jpeg)

Internally Bloom filters use a bit array, and multiple different hash functions.

## Example

Let’s say for instance we have a bit array of a _100 elements_, and _3 hash functions_.

__Add__, when we want to insert the word "Maciej" into the filter:

* We pass it through hash functions:
 - hash 1, returns 33
 - hash 2, returns 7
 - hash 3, returns 22
* Next, we go to each of those elements in the array and set them to 1.

__Query__, now to test whether the word might be in the collection:

* We pass it through hash functions, and check those elements in the bit array:
 - _true_, if all 3 elements are set to 1.
 - _false_, if any one of the elements are set to zero.

## Implementation

```python
#!/usr/bin/env python

from hashlib import sha256

class Filter(object):
  """A simple bloom filter for lots of int()"""

  def __init__(self, array_size=(1 * 1024), hashes=13):
    """Initializes a Filter() object
    Expects:
      array_size (in bytes): 4 * 1024 for a 4KB filter
      hashes (int): for the number of hashes to perform
    """
    self.filter = bytearray(array_size)     # The filter itself
    self.bitcount = array_size * 8          # Bits in the filter
    self.hashes = hashes                    # The number of hashes to use

  def _hash(self, value):
    """Creates a hash of an int and yields a generator of hash functions
    Expects:
      value: int()
    Yields:
      generator of ints()
    """
    # Build an int() around the sha256 digest of int() -> value
    digest = int(sha256(value.__str__()).hexdigest(), 16)
    for _ in range(self.hashes):
      # bitwise AND of the digest and all of the available bit positions
      # in the filter
      yield digest & (self.bitcount - 1)
      # Shift bits in digest to the right, based on 256 (in sha256)
      # divided by the number of hashes needed be produced.
      # Rounding the result by using int().
      # So: digest >>= (256 / 13) would shift 19 bits to the right.
      digest >>= (256 / self.hashes)

  def add(self, value):
    """Bitwise OR to add value(s) into the self.filter
    Expects:
      value: generator of digest ints()
    """
    for digest in self._hash(value):
      # In-place bitwise OR of the filter, position is determined
      # by the (digest / 8) digest is described above in self._hash()
      # Bitwise OR is undertaken on the value at the location and
      # 2 to the power of digest modulo 8. Ex: 2 ** (30034 % 8)
      # to grantee the value is <= 128, the bytearray not being able
      # to store a value >= 256. Q: Why not use ((modulo 9) -1) then?
      self.filter[(digest / 8)] |= (2 ** (digest % 8))
      # The purpose here is to spread out the hashes to create a unique
      # "fingerprint" with unique locations in the filter array,
      # rather than just a big long hash blob.

  def query(self, value):
    """Bitwise AND to query values in self.filter
    Expects:
      value: value to check filter against (assumed int())
    """
    # If all() hashes return True from a bitwise AND (the opposite
    # described above in self.add()) for each digest returned from
    # self._hash return True, else False
    return all(self.filter[(digest / 8)] & (2 ** (digest % 8))
      for digest in self._hash(value))


if __name__ == "__main__":
  bf = Filter()

  bf.add(1234)
  bf.add(40005)
  bf.add(1)

  print("Filter size {0} bytes").format(bf.filter.__sizeof__())

  print bf.query(1)            # True
  print bf.query(40005)        # True
  print bf.query(123)          # False
```