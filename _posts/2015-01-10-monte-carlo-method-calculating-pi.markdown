---
layout: article
title:  "Monte Carlo method, calculating π"
date:   2015-01-10 7:05:02

label:  bg-red
---

__Monte Carlo methods/experiments__ are a class of computational algorithms that rely on repeated random sampling to compute their results.

These methods are most suited to calculation by a computer and tend to be used when it is unfeasible or impossible to compute an exact result with a deterministic algorithm.

## Calculations

Now, we try to apply it to calculate an approximate value for π. Let’s start with the mathematical foundations of the problem.

The idea is to approximate an area by counting dots, which are randomly scattered over the area. We want to compare the number of dots located in a circle, to the whole field.

![Circle inside square](https://lh3.googleusercontent.com/4Wcl9DDp6BAMLUD9o757hxTK8BNY8LOO3cr5P1Obaf7P0wSagPesxUCvngAHRukZBE_ZtPCtJ2YV0wKst51I9n944d9P_P8mfVtPhhQvILAxVEVzXCzmLxrBhrexQecrkH3VlqPDBKCeQ85gatFEqSqvvCkN0wqR-9I9MeV-RAo26_DWd3oftzh8rQ0Vhbvmmutg6R_1WzktSaniRb9SIhAkq2_j6amSdNhwqS-xJh8jzYMyHrfhX8GaSVx1t7RV0QJ3pZmcB6nYzkYViQIt_zSWxHo9_zUyizZYS8TwaT3GVvCm0n4nyeJE30VNhzjmuuHx60G-vrZVNa4AMMx--ZUKthyg_2JQF8BTwqfZeirgPqiKVCOTrEx7ORVWGAGPOyVUdZuf4acWLgMBvaQR_S-vkyvPisVD_gPP9xQjdj8iojxvm-13mpx6NXUzKK_nCrEYn2w3_9cAGWPQmyrJ26v2LCl4geW_WkkGa1-EmsrzQ-iE5izukVJrWU5jsETJy3Mtkr8eFQoRrw-V_n5cRT-Xc5OB8vcrXag07ObKuDeoLyapzfp8L890GoUagi1BiqY5MJWdlybSPNO49z0efn7aGk5yxtQ=w1040-h905-no)

Using the relationship between these fields and knowing the formula for the area of the square and the circle, we get:

$$\frac{A_{circle}}{A_{square}} = \frac{\pi r^2} {(2r)^2} = \frac{\pi r^2}{4r^2} = \frac{\pi}{4}$$

Therefore:

$$\pi = 4 * \frac{A_{circle}}{A_{square}}$$

## Implementation

{% highlight python %}
#!/usr/bin/env python

import random
from math import pi

def withinCircle(x, y):
  """Checks whether a point is in a circle"""
  if(x**2 + y**2 < 1):
    return True
  else:
    return False

def calculatePi(points=100000):
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
{% endhighlight %}

## Analysis

![Monte Carlo method result](https://lh3.googleusercontent.com/sMUPyBI7PUmZpebxp2iAyx4br-id8tgKzzMEOZlQlSFAUF4sunmxkr8LGHNqOB2iNpeocsistFKk5kJEetdYuWXSlXxDYlzU4-NjdPqBBHvpi-sF7zit_jQAUt17SMhfWhmz_AmaFVANYi5iZAefhMfTXljK1uRAFuPbU3qRrdZbSjpUaz3nhXmnbfJU2EhVw6XHYH47MSkWVHemfiDn3TD79oRIlt_e9zdNYozM_9RZY9f0P3Zl4iEGXFzq42bJdRqgvG3bY45I4T2BViTKcU-5b7txVq3eu8pOAUts1_UWLKZjTQcFUKR24V1D1Ke4Lw-rVJrT3Iq3wf_GpQkXorM_Z3nmZNpfTkIqKsirJgOMqGjRWi_qpFq2Vr207oBZqHutpd_Y7K2HKCi0CO2PtOlQb4Viy5Wp5A1p5y-k5KbBCYm_ZQURaVamEOpitHga4OgKs-tAjiFJSSjqPKBvC8U4EVGDQGpM2npeyFPsymWouB05AOcwn29hmZXPW4uIY4oT74GUAAomLCjtpwn3JbAZfr9XJu9fCQFB6SA4hYhBdRP0cVMr_ycQIWeurTNIqqwasXJXftNdnLqRXaGdwbCqwyhGQjU=w800-h600-no)

## Results

    Approximate value for Pi:         3.1424
    Difference to exact value of Pi:  0.000807346410207
    Error in percent:                 0.0256986343944 %

_Risk analysis is part of every decision we make. We are constantly faced with uncertainty, ambiguity, and variability._
