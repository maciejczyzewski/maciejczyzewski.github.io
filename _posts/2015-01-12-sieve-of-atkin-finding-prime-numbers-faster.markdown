---
layout: post
title:  "Sieve of Atkin, finding prime numbers faster"
date:   2015-01-12 04:03:22
---

It is an optimized version of the ancient __sieve of Eratosthenes__ which does some preliminary work and then marks off multiples of the square of each prime, rather than multiples of the prime itself.

It was created in 2003 by _A. O. L. Atkin_ and _Daniel J. Bernstein_. References can be found in “[Prime sieves using binary quadratic forms](http://www.ams.org/journals/mcom/2004-73-246/S0025-5718-03-01501-1/S0025-5718-03-01501-1.pdf)”

## Complexity

The page segmented version implemented by the authors has the same <span class="equation" data-expr="O(N)"></span> operations but reduces the memory requirement to just that required by the base primes below the square root of the range of <span class="equation" data-expr="O(N^{1/2} / \log N)"></span> bits of memory plus a minimal page buffer.

## Optimization

All numbers with a modulo-sixty remainder:

- that is divisible by 2, 3, or 5 are not prime because they are divisible by 2, 3, or 5, respectively.
- 1, 13, 17, 29, 37, 41, 49, or 53 have a modulo-four remainder of 1. These numbers are prime iff the number of solutions to <span class="equation" data-expr="4x^{2} + y^{2} = n"></span> is odd and the number is not a square of another integer.
- 7, 19, 31, or 43 have a modulo-six remainder of 1. These numbers are prime iff the number of solutions to <span class="equation" data-expr="3x^{2} + y^{2} = n"></span> is odd and the number is not a square of another integer.
- 11, 23, 47, or 59 have a modulo-twelve remainder of 11. These numbers are prime iff the number solutions to <span class="equation" data-expr="3x^{2} - y^{2} = n"></span> is odd and the number is not a square of another integer.

## Implementation

```python
#!/usr/bin/env python
import math

def sieveOfAtkin(end):
  if end < 2: return []

  # The array doesn't need to include even numbers
  lng = (end / 2) - 1 + end % 2

  # Create array and assume all numbers in array are prime
  sieve = [True] * (lng + 1)

  # The transforming is not optimal, and the number of
  # operations involved can be reduced.

  # Only go up to square root of the end
  for i in range(int(math.sqrt(end)) >> 1):

    # Skip numbers that aren't marked as prime
    if not sieve[i]: continue

    # Unmark all multiples of i, starting at i**2
    for j in range((i * (i + 3) << 1) + 3, lng, (i << 1) + 3):
      sieve[j] = False

  # Don't forget 2
  primes = [2]

  # Gather all the primes into a list, leaving out the composite numbers
  primes.extend([(i << 1) + 3 for i in range(lng) if sieve[i]])

  return primes

if __name__ == "__main__":
  my = sieveOfAtkin(100000)

  # Conclusions [2, 3, 5, ... , 99991]
  print my
```