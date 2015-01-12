---
layout: post
title:  "Monte Carlo method, calculating π"
date:   2015-01-10 7:05:02
---

__Monte Carlo methods/experiments__ are a class of computational algorithms that rely on repeated random sampling to compute their results.

These methods are most suited to calculation by a computer and tend to be used when it is unfeasible or impossible to compute an exact result with a deterministic algorithm.

## Calculations

Now, we try to apply it to calculate an approximate value for π. Let’s start with the mathematical foundations of the problem.

The idea is to approximate an area by counting dots, which are randomly scattered over the area. We want to compare the number of dots located in circle to the whole field.

<img src="/assets/images/prints/circle_dots.jpeg" alt="Circle inside square" width="400px" />

Using the relationship between these fields and knowing the formula for the area of the square and the circle, we get:

<div class="equation" data-expr="\frac{A_{circle}}{A_{square}} = \frac{\pi r^2} {(2r)^2} = \frac{\pi r^2}{4r^2} = \frac{\pi}{4}"></div>

Therefore:

<div class="equation" data-expr="\pi = 4 * \frac{A_{circle}}{A_{square}}"></div>

## Implementation

```python
#!/usr/bin/env python

import random
from math import pi

def withinCircle(x,y):
  """Checks whether a point is in a circle"""
  if(x**2 + y**2 < 1):
    return True
  else:
    return False

def calculatePi(points = 100000):
  """Calculating Pi using random numbers"""
  circleArea = 0 # The dots in a circle
  squareArea = 0 # The dots in a square

  # Random selection of dots
  for i in range(0, points):
    # Coordinates of a random dot
    x = random.random() # x-coordinate
    y = random.random() # y-coordinate

    # Checking whether the dot is inside the circle
    if(withinCircle(x, y) == 1):
      circleArea = circleArea + 1 # Add it

    # Is certainly in the square
    squareArea = squareArea + 1 # Add it

  # Our formula
  return 4.0 * circleArea / squareArea

if __name__ == "__main__":
  my = calculatePi()

  # Conclusions
  print "Approximate value for Pi:        ", my
  print "Difference to exact value of Pi: ", my - pi
  print "Error in percent:                ", (my - pi) / pi * 100, "%"
```

## Analysis

![Monte Carlo method result](/assets/images/prints/pi_calculation.png)

## Results

```
Approximate value for Pi:         3.1424
Difference to exact value of Pi:  0.000807346410207
Error in percent:                 0.0256986343944 %
```

_Risk analysis is part of every decision we make. We are constantly faced with uncertainty, ambiguity, and variability._