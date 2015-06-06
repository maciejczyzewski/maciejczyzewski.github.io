---
layout: post
title:  "Naive Czyzewski Generator, a different approach"
date:   2015-06-05 16:50:50

label:  green
---

> Below is an article describing my generator. You can go to the [paper](/assets/files/NCG.pdf) or [source code](/assets/files/NCG.zip) as well. There you should find all the missing information.

A __NCG__ is a [randomization function](http://en.wikipedia.org/wiki/Randomization_function), specified in 2015. The aim was to create a secure, flexible and effective algorithm which could meet all user’s needs, while meeting the main assumption of the generator:

> A deterministic algorithm to generate a sequence of numbers with little or no distinguishable pattern in the numbers, except for broad statistical properties.

It’s suitable for use as [pseudo-random number generator](http://en.wikipedia.org/wiki/Pseudorandom_number_generator) or [hash function](http://en.wikipedia.org/wiki/Hash_function). It meets the conditions of security requirements for cryptographic modules, therefore it can also be used as part of [stream cipher](http://en.wikipedia.org/wiki/Stream_cipher).

Random numbers are useful in a wide variety of applications. There is extensive use of random numbers in such areas as numerical analysis for [Monte Carlo](http://en.wikipedia.org/wiki/Monte_Carlo_method) and [Quasi-Monte Carlo](http://en.wikipedia.org/wiki/Quasi-Monte_Carlo_method) integration and, more generally, simulation methods, number theory for probabilistic primality tests, and computational statistics.

# Introduction

In theory, randomization functions are assumed to be [truly random](http://en.wikipedia.org/wiki/Randomness#Randomness_versus_unpredictability), and yield an unpredictably different function every time the algorithm is executed. My function compared with the others which are used up to now, has better results.

<u>The function easily passed Alphabit, BigCrush, SmallCrush, Crush, pseudoDIEHARD, Rabbit, FIPS-140-2 and Diehard tests.</u>

<style>td, th { padding: 10px 5px; }</style>
<table id="PRNG" style="margin: 2em 0">
  <thead>
    <tr>
      <th class="header">PRNG</th>
      <th class="header" align="right">Period</th>
      <th class="header" align="right">Failures</th>
      <th class="header" align="right">Systematic</th>
      <th class="header" align="right">Speed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>NCG</code>
      </td>
      <td align="right">2<sup>n/2</sup><!-- arbitary --></td>
      <td align="right">0</td>
      <td align="right">—</td>
      <td align="right">—</td>
    </tr>
    <tr>
      <td>
        <code>xorshift1024*</code>
      </td>
      <td align="right">2<sup>1024</sup>&nbsp;−&nbsp;1</td>
      <td align="right">51</td>
      <td align="right">—</td>
      <td align="right">1.34</td>
    </tr>
    <tr>
      <td>
        <code>xorshift128+</code>
      </td>
      <td align="right">2<sup>128</sup>&nbsp;−&nbsp;1</td>
      <td align="right">64</td>
      <td align="right">—</td>
      <td align="right">1.12</td>
    </tr>
    <tr>
      <td>
        <code>xorshift116+</code>
      </td>
      <td align="right">2<sup>116</sup>&nbsp;−&nbsp;1</td>
      <td align="right">66</td>
      <td align="right">—</td>
      <td align="right">—</td>
    </tr>
    <tr>
      <td>
        <code>xorshift4096*</code>
      </td>
      <td align="right">2<sup>4096</sup>&nbsp;−&nbsp;1</td>
      <td align="right">67</td>
      <td align="right">—</td>
      <td align="right">1.34</td>
    </tr>
    <tr>
      <td>
        <a href="http://www.nr.com/">
          <code>Ran</code>
        </a>
      </td>
      <td align="right">≈2<sup>191</sup></td>
      <td align="right">74</td>
      <td align="right">—</td>
      <td align="right">2.06</td>
    </tr>
    <tr>
      <td>
        <code>MCG128</code>
      </td>
      <td align="right">2<sup>127</sup></td>
      <td align="right">77</td>
      <td align="right">—</td>
      <td align="right">1.31</td>
    </tr>
    <tr>
      <td>
        <a href="http://maths-people.anu.edu.au/~brent/random.html">
          <code>xorgens4096</code>
        </a>
      </td>
      <td align="right">2<sup>4096</sup>&nbsp;−&nbsp;1</td>
      <td align="right">82</td>
      <td align="right">—</td>
      <td align="right">1.83</td>
    </tr>
    <tr>
      <td>
        <code>SplitMix64</code>
      </td>
      <td align="right">2<sup>64</sup></td>
      <td align="right">80</td>
      <td align="right">—</td>
      <td align="right">1.93</td>
    </tr>
    <tr>
      <td>
        <code>xorshift64*</code>
      </td>
      <td align="right">2<sup>64</sup>&nbsp;−&nbsp;1</td>
      <td align="right">363</td>
      <td align="right">MatrixRank</td>
      <td align="right">1.56</td>
    </tr>
    <tr>
      <td>
        <a href="http://www.iro.umontreal.ca/~panneton/well/">
          <code>WELL19937a</code>
        </a>
      </td>
      <td align="right">2<sup>19937</sup>&nbsp;&minus;&nbsp;1</td>
      <td align="right">468</td>
      <td align="right">LinearComp</td>
      <td align="right">8.01</td>
    </tr>
    <tr>
      <td>
        <a href="http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/VERSIONS/C-LANG/mt19937-64.c">
          <code>MT19937-64</code>
        </a>
      </td>
      <td align="right">2<sup>19937</sup>&nbsp;−&nbsp;1</td>
      <td align="right">516</td>
      <td align="right">LinearComp</td>
      <td align="right">2.66</td>
    </tr>
    <tr>
      <td>
        <code>xorshift4096</code>
      </td>
      <td align="right">2<sup>4096</sup>&nbsp;−&nbsp;1</td>
      <td align="right">659</td>
      <td align="right">MatrixRank, LinearComp</td>
      <td align="right">1.18</td>
    </tr>
    <tr>
      <td>
        <code>xorshift1024</code>
      </td>
      <td align="right">2<sup>1024</sup>&nbsp;−&nbsp;1</td>
      <td align="right">882</td>
      <td align="right">MatrixRank, LinearComp</td>
      <td align="right">1.18</td>
    </tr>
    <tr>
      <td>
        <a href="http://www.iro.umontreal.ca/~panneton/well/">
          <code>WELL1024a</code>
        </a>
      </td>
      <td align="right">2<sup>1024</sup>&nbsp;−&nbsp;1</td>
      <td align="right">882</td>
      <td align="right">MatrixRank, LinearComp</td>
      <td align="right">5.54</td>
    </tr>
    <tr>
      <td>
        <a href="http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/XSADD/">
          <code>XSadd</code>
        </a>
      </td>
      <td align="right">2<sup>128</sup>&nbsp;−&nbsp;1</td>
      <td align="right">888</td>
      <td align="right">LinearComp, MatrixRank, <br> MaxOft, Permutation</td>
      <td align="right">2.06</td>
    </tr>
    <tr>
      <td>
        <code>xorshift64</code>
      </td>
      <td align="right">2<sup>64</sup>&nbsp;−&nbsp;1</td>
      <td align="right">1512</td>
      <td align="right">BirthdaySpacings, MatrixRank, LinearComp</td>
      <td align="right">1.57</td>
    </tr>
    <tr class="even">
      <td>
        <a href="http://docs.oracle.com/javase/7/docs/api/java/util/Random.html">
          <code>java.util.Random</code>
        </a>
      </td>
      <td align="right">2<sup>48</sup>&nbsp;−&nbsp;1</td>
      <td align="right">13564</td>
      <td align="right">Almost all tests</td>
      <td align="right">2.60</td>
    </tr>
  </tbody>
</table>

_Unusual in my algorithm is that period can be adjust arbitrary. It depends only on the memory what we are willing to sacrifice..._

## Features

- __initial state matrix__ — initial values may be modified, what does not change the qualities of algorithm, but changes the series of output. It’s good when someone needs generator, which would be outputting different from other
- __arbitrary period__ — period is known, between 2<sup>n/2</sup> to 2<sup>n</sup>, it depends only on the amount of cells in matrix and chosen seed
- __high-quality output__ — it has a very uniform distribution, therefore it is proof to many attacks, extremely easily passes the _Diehard_ and _TestU01_ tests
- __cryptographically secure__ — there is no known successful attack
- __flexible skeleton__ — function in black cell can be changed (read paper)
- __suitable speed__ — quite good comparing to the other benefits
- __universal__ — due to it’s simple design, can be used for any purpose

## Structure

Generator is some kind of universal model/skeleton, based on initial state matrix, colorized in two colors - _black and white_.

<img src="/assets/images/prints/NCG_4.jpeg" alt="NCG" width="450px" />

Each cell has _16-bit_, the number of cells must be an even number, their number is unlimited. Black cells are used by already known generator, white are specially modified cells (known as “sounds of ether”).

<img src="/assets/images/prints/NCG_5.jpeg" alt="NCG" width="450px" />

Black cell in my implementation is used by __LFSR__, but it can be any other function or generator. It is just to guarantee period length and uniqueness of cycle.

Algorithm has 3 main functions:

- __push__, throws _32-bit_ otherwise known as seed, to current matrix
- __pull__, returns _32-bit_ block of output
- __reset__, replaces current matrix by the initial state matrix

The “push” can be used repeatedly, this is useful when you want using it as a hash function. You can also use “pull” without restrictions.

## Implementation

Below I am publicising my implementation in _ANSI C_. It is intended to clearly present algorithm. If you want to download the source code, go to appendix.

```c
/*  NCG written in 2015 by Maciej A. Czyzewski

To the extent possible under law, the author has dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty.

See <http://creativecommons.org/publicdomain/zero/1.0/>.  */

#include <stdint.h>
#include <string.h>

// S - seed, I - increment, t - mask, i - temporary
uint32_t S, I, t, i;

// The length of the initial states
#define SIZE 16

// Abbreviation for getting values from the matrix
#define M(i) ((i) & (SIZE - 1))

// Bit rotation
#define R(x, y) (((x) << (y)) | ((x) >> (16 - (y))))

// XOR gate, relationships
#define L(x, y) {                                    \
  (y) ^= ((x) << 5) ^ ((y) >> 3) ^ ((x) >> 1);       \
  (x) ^= ((y) << 8) ^ ((x) << 3) ^ ((y) << 9);       \
}

// Variebles in the algorithm
uint16_t a, b, c, d;

// Initial state matrix (pi digits)
uint16_t G[SIZE], Q[SIZE] = { 1, 4, 1, 5, 9, 2, 6, 5,
                              3, 5, 8, 9, 7, 9, 3, 2 };

void push(uint32_t seed) {
  // Preparation
  I = seed * 0x3C6EF35F;

  for (S = seed, i = 0; i < SIZE; i++) {
    // Reinforcement
    G[M(i)] ^= (S * I - I ^ S) >> 16;
    G[M(i)] ^= (S * I + I ^ S) >> 00;

    // Finalization
    I ^= ((G[M(I - 1)] + G[M(i)]) << 16)
      ^  ((G[M(I + 1)] - G[M(i)]) << 00);
  }
}

uint32_t pull(void) {
  // Variebles
  a = G[M(I + 0)]; b = G[M(I + 1)];
  c = G[M(I - 2)]; d = G[M(I + 2)];

  // Initialization
  t = (a + I) * (b - S);

  // Allowance
  t ^= a ^ (b << 8) ^ (c << 16) ^ (d & 0xff) ^ ((d >> 8) << 24);

  // Mixing
  L(G[M(I + 0)], G[M(I - 2)]);
  L(G[M(I + 0)], G[M(I + 2)]);

  // Transformation
  G[M(I + 0)] = G[M(t - 1)] ^ R(c, M(t)) ^ R(d, M(t)) ^ a;
  G[M(I + 1)] = (b >> 1) ^ (-(b & 1u) & 0xB400u); // LFSR

  // Increment
  I += 2;

  return t;
}

void reset(void) {
  // Copying defaults
  memcpy(G, Q, 2 * SIZE);
}
```

## Pseudo-random number generator

This simple function will be generating a sequence of numbers whose properties approximate the properties of sequences of random numbers.

It is similar to ```/dev/urandom```, which is a special file that serves as an unblocking pseudo-random number generator.

<img src="/assets/images/prints/NCG_3.jpeg" alt="NCG" width="450px" />

### Implementation

```c
/*  NCG written in 2015 by Maciej A. Czyzewski

To the extent possible under law, the author has dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty.

See <http://creativecommons.org/publicdomain/zero/1.0/>.  */

void ncg(const uint32_t seed) {
  // Cleaning state matrix
  reset();

  // Push to NCG structure
  push(seed);
}
```

### Usage

```c
#include <stdio.h>
#include <stdlib.h>

#include "../src/ncg.c"
#include "../src/include/random.c"

int main (int argc, char const *argv[])
{
  if (argc < 2) {
    printf("usage: %s <number> \n", argv[0]);
    return 1;
  }

  ncg((uint32_t) atoi(argv[1]));

  while (1) {
    putc_unlocked(pull(), stdout);
  }

  return 0;
}
```

After compilation, we can enter the following command into console:

```bash
$ bin/random 1013904223 | head | xxd
```

That should return generated random blocks of bits.

```
0000000: 7b76 6c53 aa43 8986 3fbb 66f5 9b58 218d  {vlS.C..?.f..X!.
0000010: 1994 7790 2104 b70f 3e2f 4b59 bedb d179  ..w.!...>/KY...y
0000020: 9364 0d2d 9eb2 105b 0e66 b581 f49d 54a1  .d.-...[.f....T.
0000030: d0df 63be 6ff3 e623 cdaf 3c78 2b92 7270  ..c.o..#..<x+.rp
0000040: 04e2 d323 85d5 64c3 599e a61a 7612 f6d7  ...#..d.Y...v...
0000050: 959b 1979 e7c9 849f 08f5 39fa 0166 5921  ...y......9..fY!
0000060: 9160 2c6f ebbc 8ad2 0761 c768 742b d4b3  .`,o.....a.ht+..
0000070: 4ae8 9cfd 8300 3ada 8b82 6cce 4ced 5dde  J.....:...l.L.].
0000080: f23d 5023 16ab d497 618a f138 a46e 4a0b  .=P#....a..8.nJ.
0000090: c058 1e6e 48dc 114d 3d71 0726 fec4 2ae8  .X.nH..M=q.&..*.
00000a0: 8d02 584b 7fdc 39d3 bc16 8233 f3da 3a8d  ..XK..9....3..:.
00000b0: 261d a53a 55f2 016a da70 00bc 3bb6 9bca  &..:U..j.p..;...
00000c0: b433 09c1 998d 31d5 bc18 5b81 6571 cb1e  .3....1...[.eq..
00000d0: 37ae c0f1 c5f7 3f9f eedd e043 7497 600a  7.....?....Ct.`.
00000e0: ef55 8c84 8408 a372 4c58 b5ac 3565 dcb2  .U.....rLX..5e..
00000f0: 8cac b182 4985 da7c 8ad1 5c99 7868 2aae  ....I..|..\.xh*.
0000100: 256a 502c 699b e373 f693 afb2 af5e 582f  %jP,i..s.....^X/
0000110: c7c2 ffd1 486d f5cd dcc4 52c4 e85c e374  ....Hm....R..\.t
0000120: 3e46 2d8d 7c78 e7d8 044e b199 1b25 082b  >F-.|x...N...%.+
0000130: d855 df3a bf6b 3dcb 68b2 ed25 90cc 99de  .U.:.k=.h..%....
0000140: 3df0 cac5 fcfa 8be8 41f1 3944 a1c0 dc67  =.......A.9D...g
0000150: 0c34 8649 4fd4 0e51 d46c c47f ab9b e63f  .4.IO..Q.l.....?
0000160: 7bf5 ed31 8816 78f2 4e6d 0bd2 08f4 43b0  {..1..x.Nm....C.
0000170: 44a9 0429 1cd3 fd9d 732c d0f2 19dd 3b88  D..)....s,....;.
0000180: 709b f6dd 779c f30b 0eec a8de 04b7 70b5  p...w.........p.
0000190: ff25 a8df ed3a cde1 f06b 6931 9fd3 818a  .%...:...ki1....
00001a0: 56dc 6327 b740 3bbe 1499 41a9 0a92 b087  V.c'.@;...A.....
00001b0: d600 2cda 9b44 60ea dfd9 2e71 9b28 049e  ..,..D`....q.(..
00001c0: c8ac f86b 9899 a483 0607 583b 0f99 b0c2  ...k......X;....
00001d0: e9f0 b217 dfac 5781 63b1 d048 5c60 cbe4  ......W.c..H\`..
00001e0: 1370 1a42 5153 3ff9 2c50 4453 1cb9 03dd  .p.BQS?.,PDS....
00001f0: 4875 e19f dc76 a734 cfd4 6a59 783c b43a  Hu...v.4..jYx<.:
0000200: a03b 4444 9bdb 8d4e 8805 36c4 c357 90bd  .;DD...N..6..W..
0000210: 19aa 31f0 c491 c7af 2185 2e0c 5c6e 28e1  ..1.....!...\n(.
0000220: 0d5f 5122 9387 d467 c97c 0768 9616 b906  ._Q"...g.|.h....
0000230: 3350 7cd3 1741 27e8 2e42 d71b d3e6 e35f  3P|..A'..B....._
0000240: b28f 3a17 e924 d22d 7aea fcd3 e2ed bfe9  ..:..$.-z.......
0000250: 813a 01ec 5753 1e8f 0414 d83a 9222 f6d3  .:..WS.....:."..
0000260: 0790 0544 cbca 185d 7a2b 839d 32ec 8582  ...D...]z+..2...
0000270: dc81 9496 64e6 cfee 01b6 8eff a573 dae7  ....d........s..
0000280: a4e0 31b1 13b4 0e36 bb93 ad12 a08c c1ea  ..1....6........
0000290: 6fe8 1b5f 550c 0130 b030 3e4b 16af 71e5  o.._U..0.0>K..q.
00002a0: 4fb1 ef75 1b25 0781 e858 8743 f99c 63de  O..u.%...X.C..c.
00002b0: f14b e11c dc1c 3dfc 8ee2 c7ed 3997 da88  .K....=.....9...
00002c0: e0a2 78e4 83ad 7095 68b8 ba65 1ea6 4fca  ..x...p.h..e..O.
00002d0: b3ae 5c27 fd72 95aa 3bb7 1a10 cfae 3b97  ..\'.r..;.....;.
00002e0: f5ce e4ac d92e 6305 fb1f 5b50 ce16 6541  ......c...[P..eA
00002f0: 0e77 fc2c 212d f0a5 4c8f 4646 f9ea 6162  .w.,!-..L.FF..ab
0000300: c076 cb05 f421 f410 74fb 57a5 ca46 2d0b  .v...!..t.W..F-.
0000310: 9b6f dc93 fb89 2644 216a 3d5e 001b 3ab0  .o....&D!j=^..:.
0000320: 41cd e967 14e0 81b5 28e5 9eff 974a 2283  A..g....(....J".
0000330: 63f9 945e 83d2 23b3 d931 b37e 1576 badb  c..^..#..1.~.v..
0000340: 96c4 c0df 9765 ae5c efc4 eabf f626 49c0  .....e.\.....&I.
0000350: 149b b892 a4e0 5355 ff78 5e58 8f6c 14b1  ......SU.x^X.l..
0000360: 10f1 5e56 da8e ada5 65a9 7e2e ade5 b4fa  ..^V....e.~.....
0000370: 366e dc07 4661 f47b 9a51 76e2 b3c8 1cfb  6n..Fa.{.Qv.....
0000380: 9361 6c2b 7a9e cdb6 58bf 2225 c6c6 0a0f  .al+z...X."%....
0000390: 0010 03d2 aa4a 65f9 b1dc 5d6d c393 ecf7  .....Je...]m....
00003a0: 8616 56e1 3eef 4b38 9029 cf35 3d0c 7776  ..V.>.K8.).5=.wv
00003b0: 2930 5baa ee19 178c 8bc0 113e bd37 f3a9  )0[........>.7..
00003c0: 7096 7586 3a27 70df b806 b64a a852 e218  p.u.:'p....J.R..
00003d0: d967 7eda 9b48 b8fe c871 a9c4 dc6d 63c1  .g~..H...q...mc.
00003e0: c46f fd3d dd67 2a02 ef97 e49d eb8e 699c  .o.=.g*.......i.
00003f0: 2c98 2577 973e ceb8 7112 8af0 a70c 49fa  ,.%w.>..q.....I.
0000400: 7c46 7b65 111a 3a62 7c6d b7b3 11c9 d8b9  |F{e..:b|m......
0000410: 4ba9 bfe6 38e2 d52b 1d0a 17e8 46bd c900  K...8..+....F...
0000420: e108 d35e 138b 53ee d09f d6d3 8f8e e07f  ...^..S.........
0000430: d1bf 4fc5 273a 1342 9435 4956 7e97 a692  ..O.':.B.5IV~...
0000440: 8e1b 9b41 886d 7360 2340 c314 1a8d 7190  ...A.ms`#@....q.
0000450: 67a1 aabb 2814 396b cb7a 6478 c214 b412  g...(.9k.zdx....
0000460: 22aa 00aa 611d 7961 9274 7c47 4d3f 3f9e  "...a.ya.t|GM??.
0000470: e846 985b aa33 c363 a5b2 ca06 f370 18aa  .F.[.3.c.....p..
0000480: 2706 e26c 1db7 c0db 4023 9410 cdd1 1f3c  '..l....@#.....<
0000490: d21f 3fb0 4f35 f4af fa72 ff17 6db0 9432  ..?.O5...r..m..2
00004a0: 4e18 d8a2 ab73 12ee 2a33 630f 7d5e d4f8  N....s..*3c.}^..
00004b0: 6ef5 cd31 a831 d335 d257 f66e 91fc f777  n..1.1.5.W.n...w
00004c0: 0f62 1a28 77df 0977 9e70 6859 dcca f6bf  .b.(w..w.phY....
00004d0: fd0e 15c9 3109 b108 2233 7d8f f737 404d  ....1..."3}..7@M
00004e0: 8ec8 d401 9f05 90be aa9b 098b 6052 155e  ............`R.^
00004f0: b3ab 7d93 c940 cc61 5a73 947b 9ed7 dfd9  ..}..@.aZs.{....
0000500: 9015 d644 1da3 0cb3 a4ad b055 0121 b873  ...D.......U.!.s
0000510: 53a3 38ad 142d 3061 51db 0f87 9ba5 e171  S.8..-0aQ......q
0000520: 17e5 2a10 85fb bcdc d45c bbec 6aaf 23b3  ..*......\..j.#.
0000530: e15e e68c 2b9d cf0b 6533 e17e 6fed 3584  .^..+...e3.~o.5.
0000540: ac20 05c6 4ec8 c7a7 12f1 e0e7 7be4 243f  . ..N.......{.$?
0000550: 3ece 3432 43a7 96c3 0487 edca b040 e192  >.42C........@..
0000560: 17bd d36c 79fd 5312 c76b 2549 61e4 d09c  ...ly.S..k%Ia...
0000570: aa27 bf5f d634 7a31 2f0f dd8c c7ef 7fab  .'._.4z1/.......
0000580: cc82 5f38 84a2 9777 2c5b 37d2 90d4 912b  .._8...w,[7....+
0000590: 8c97 d3ba c565 2a7b 2ec7 7cef 378c 4d8b  .....e*{..|.7.M.
00005a0: aea0 e13f 48e1 b2f4 93a7 616f b4ae c886  ...?H.....ao....
00005b0: 81a9 501d a3a8 a9b6 f3ed ec49 5940 30ce  ..P........IY@0.
00005c0: 4081 cb32 4b52 9b8b a851 81a0 f6cd 96f7  @..2KR...Q......
00005d0: a3c4 65fe cd94 012b 5c51 d6d5 f30b cb75  ..e....+\Q.....u
00005e0: 149c 97ea 838c d9e8 c929 4ce3 a824 7f76  .........)L..$.v
00005f0: 843c 69a3 62f4 3cea f496 2ba5 dd5f 5cfb  .<i.b.<...+.._\.
0000600: de92 b522 e3f6 2cca 2b6f f80d 0751 d935  ..."..,.+o...Q.5
0000610: 44b6 5436 6e92 8389 8b9a bbe6 aca2 5afe  D.T6n.........Z.
0000620: f3df eb51 bd81 7599 4ca8 76ec 16af 59d9  ...Q..u.L.v...Y.
0000630: 29c7 5c1d 3fdd 14fd ea52 5050 76a8 2873  ).\.?....RPPv.(s
0000640: 2fa2 4b75 e05e 6f57 0f83 63ab 19c4 f0a0  /.Ku.^oW..c.....
0000650: ddd0 db75 2d4d ef3c f2f1 2eed 955d c72c  ...u-M.<.....].,
0000660: 87d2 b8b3 d368 9cc4 108d 4d2a 1cdd 1c65  .....h....M*...e
0000670: 7a8e c689 b5d0 698c 6627 98c7 5f27 7181  z.....i.f'.._'q.
0000680: a352 04b0 b77e 76a1 04bc 3f1a a6ab 551b  .R...~v...?...U.
0000690: 515a da82 6b09 6017 a8e0 d50f 5ead 855c  QZ..k.`.....^..\
00006a0: f08c f328 e5d7 a456 d031 7264 1b2a 8c3f  ...(...V.1rd.*.?
00006b0: 033f 2192 a132 5c33 a4ca 223f 6cf1 9434  .?!..2\3.."?l..4
00006c0: 0a11 e277 55c7 13d5 1f61 b1a9 40ad 7422  ...wU....a..@.t"
00006d0: 41cf 0e6a 86c9 eb8c 7654 5300 f99d 45e8  A..j....vTS...E.
00006e0: c94b f99b 8f4c 301e bd87 1986 1c12 3e74  .K...L0.......>t
00006f0: ecd6 dd77 95dd 5836 9135 3848 9fc9 6b0e  ...w..X6.58H..k.
0000700: 54fb f75a 1c0c 3caf f8a9 cf8a 06a3 d7bd  T..Z..<.........
0000710: 744e 2a41 c79b cbe3 f28e 2892 9c3f 93a2  tN*A......(..?..
0000720: f53b c747 78e4 1400 5752 c707 9c15 72c3  .;.Gx...WR....r.
0000730: e8bc 84ac b93c 76e0 c14b a0c5 3e59 d3b1  .....<v..K..>Y..
0000740: 40b9 3b4a 2032 9c57 1c46 bc98 983a 0304  @.;J 2.W.F...:..
0000750: 97af 7030 42df 8b94 9a11 cc9c 668c 3281  ..p0B.......f.2.
0000760: 94bd 03d6 b560 d194 4e97 0089 03dc b0dc  .....`..N.......
0000770: 5834 1d0d fd63 df91 1c36 6043 f3dd 5813  X4...c...6`C..X.
0000780: c3e2 cd5c d7f4 46c5 951f e6c5 d279 863d  ...\..F......y.=
0000790: a26d 2faa 1679 59c5 556e 6fdd ba60 1940  .m/..yY.Uno..`.@
00007a0: 588c a141 5efb bb09 4bde 784e f8ae 7428  X..A^...K.xN..t(
00007b0: f8a1 86ed f120 f374 8c6b 71ae c6d8 8c3a  ..... .t.kq....:
00007c0: 6a65 5b8d fb20 9bc3 70bc 175e 39f1 7049  je[.. ..p..^9.pI
00007d0: 24dc 5bac b320 84d2 6068 93d4 220c 84b5  $.[.. ..`h.."...
00007e0: a019 24fd 8fc7 2bf2 d5cf 8b1f 4f29 e472  ..$...+.....O).r
00007f0: 4cca 03ad b9ea 22f6 3b64 da25 523e a84f  L.....".;d.%R>.O
0000800: 31a0 d7d5 a017 65fa 3a37 81dc 2ac1 dd8c  1.....e.:7..*...
0000810: c315 f2d7 cd8f cf74 740e 4108 12c7 0b5a  .......tt.A....Z
0000820: c908 8551 aa1f a460 6c7a 66e5 da9f 040b  ...Q...`lzf.....
0000830: e565 56e7 d1de 56a9 6619 1a38 8d7a 6025  .eV...V.f..8.z`%
0000840: e43f 1d28 9abe c429 2d11 12ca fd30 3302  .?.(...)-....03.
0000850: 1e28 6216 6b3c 4064 e68a 5577 9961 b397  .(b.k<@d..Uw.a..
0000860: 454a 7442 9fc7 c484 5c89 2616 e4b8 3fe8  EJtB....\.&...?.
0000870: 771d b9ec ff18 782a a4aa 9bf2 181e 6858  w.....x*......hX
0000880: 13be 9114 0bdb 2e1a 3084 aaaa 38cc fd47  ........0...8..G
0000890: 7365 fecb dd31 ac57 4e7b 92f1 3979 0824  se...1.WN{..9y.$
00008a0: 256a 92a0 cc5f 98ad 1b06 ee53 df3b fddd  %j..._.....S.;..
00008b0: 908f 670d 4c02 1966 2df0 233b fa2b ab13  ..g.L..f-.#;.+..
00008c0: e414 e632 3ae5 a6df 0478 880d 5815 c480  ...2:....x..X...
00008d0: cb0e 66a8 5b14 86e3 9f17 628c 5cf0 b81c  ..f.[.....b.\...
00008e0: 4ced d61c 6fb7 b7db d7fe bcdc cf19 5015  L...o.........P.
00008f0: d4da 428c 035a da40 cf2b 57a1 0465 ed87  ..B..Z.@.+W..e..
0000900: c21f df9d 2957 88df c16e 3d84 9106 7cb0  ....)W...n=...|.
0000910: b1a7 b92c b464 84c9 fe1e c884 52b3 ceb8  ...,.d......R...
0000920: 63ae eab7 c45f 8935 787f f04b dddd 4371  c...._.5x..K..Cq
0000930: 9c4c b9f7 720e b9b9 309b a696 1f6e 2dea  .L..r...0....n-.
0000940: 4b88 75ae 7ba9 5be0 bfe5 821c b2d4 25a6  K.u.{.[.......%.
0000950: aafd 09a4 310a 78a4 7576 acc9 878d d864  ....1.x.uv.....d
0000960: 4fc6 8f80 e9e5 4b07 e771 7267 d682 1704  O.....K..qrg....
0000970: 9788 8534 f3cf 52be 2d0d d920 dc22 2947  ...4..R.-.. .")G
0000980: 6724 e4fb a15b 1871 1eef 7381 8d72 f7b0  g$...[.q..s..r..
0000990: 8eef f1e4 9117 b81f 291f 75d4 dce8 a6b3  ........).u.....
00009a0: f7a1 0a72 e5b4 1ef9 1022 8057 08c3 883a  ...r.....".W...:
00009b0: 797c b0c9 db13 4deb 7c22 a5af c18f 2320  y|....M.|"....#
00009c0: 392e e55b 3434 6e9a a360 c814 6133 4603  9..[44n..`..a3F.
00009d0: d7b8 d08a 60c4 6d56 85b2 c127 4faf 21c6  ....`.mV...'O.!.
00009e0: 90ce f3a8 04f9 2a02 217a 221b 8a4b 1864  ......*.!z"..K.d
00009f0: 7805 cd0d 514a b120 497d 083a b26a 4a30  x...QJ. I}.:.jJ0
0000a00: 0669 04ca 90dd fef1 5377 5818 8ab9 b911  .i......SwX.....
0000a10: 6140 0bd3 7ff2 96b6 a50f 6e14 71a6 b1d1  a@........n.q...
0000a20: 7e0e 6974 fa58 d156 3f13 7a4f ff62 91b9  ~.it.X.V?.zO.b..
0000a30: 8b6c a051 20ff e004 0cce 75ef 19aa 416e  .l.Q .....u...An
0000a40: a926 5b52 d1de 0440 a85d ee28 8be5 752c  .&[R...@.].(..u,
0000a50: 4be0 897b 21c4 a771 1b34 2739 44be e18a  K..{!..q.4'9D...
0000a60: 3ec5 c268 2689 bf41 5fef 57d1 99ba 477a  >..h&..A_.W...Gz
0000a70: 4308 f0b5 7536 e3e1 335f 41f6 709c 4b85  C...u6..3_A.p.K.
0000a80: 1275 1eab 6b64 23c9 c153 44a6 e514 020c  .u..kd#..SD.....
0000a90: bdc1 00f5 fdc4 61f3 00c1 e94a 52be 2fb0  ......a....JR./.
0000aa0: 8d33 7285 1f07 8426 2d96 5581 932a 354f  .3r....&-.U..*5O
0000ab0: 5496 0752 be90 262f ccbc 6c71 375f 1c27  T..R..&/..lq7_.'
0000ac0: c0b1 01ba 065e 2cdf 07ad fb32 2e08 32bb  .....^,....2..2.
0000ad0: e43c d51b 2cb0 0d8c c45c a1f5 7e61 b524  .<..,....\..~a.$
0000ae0: acb2 8ae5 31e8 6e86 be63 5184 5c20 946c  ....1.n..cQ.\ .l
0000af0: f02f 66cd 2b54 8a0c 8cdf 9982 bda1 da1d  ./f.+T..........
0000b00: 2c5b efd4 5acd 900b 7d26 2af3 2976 d838  ,[..Z...}&*.)v.8
0000b10: fe85 e82e 57fe 7abc ac5e ac11 bbb2 aa4d  ....W.z..^.....M
0000b20: 422f f271 f136 beff 37b1 5a70 f45d 566f  B/.q.6..7.Zp.]Vo
0000b30: 98a2 5191 cac2 0b22 6a82 2aa1 e1d1 c0ff  ..Q...."j.*.....
0000b40: 3bde 7a4f 3202 86f5 8c40 cd75 1df2 d0c1  ;.zO2....@.u....
0000b50: 0dc9 a757 3bed 6182 69a7 e194 8da5 af86  ...W;.a.i.......
0000b60: 3dff bc2a 7968 1484 5b39 4387 4200 3709  =..*yh..[9C.B.7.
0000b70: 9849 9da5 d015 403f c5ab 4bd2 3445 0be3  .I....@?..K.4E..
0000b80: daef e9b0 8256 1332 376c 6216 3f70 d659  .....V.27lb.?p.Y
0000b90: 0b3d 7edc 613f 31f7 75f5 7184 320c 9da0  .=~.a?1.u.q.2...
0000ba0: e27f 476b 8f4b 9e13 7c98 47c6 6c81 e16d  ..Gk.K..|.G.l..m
0000bb0: 6ab7 0d0e 82c6 b39c 8259 0754 2efd d45e  j........Y.T...^
0000bc0: 49ef 99d8 1a4c 12d4 de4d 23fd 44e1 e20a  I....L...M#.D...
0000bd0: 6cff be42 5eac dffa 780d 46b9 7023 452b  l..B^...x.F.p#E+
0000be0: d0f0 9459 1386 5d20 8c6e 0602 cdc5 1663  ...Y..] .n.....c
0000bf0: 0d06 0fdd 6546 b4ab d65a 8ccc 8e63 218b  ....eF...Z...c!.
0000c00: 9f4d 4994 4fc8 25d3 df65 759a 1923 d77d  .MI.O.%..eu..#.}
0000c10: d303 9016 ff20 717f 8fa5 9827 1d81 7387  ..... q....'..s.
0000c20: d82c 9ddd 6284 8c10 0551 8b86 45d4 e366  .,..b....Q..E..f
0000c30: a3ea 0f5f 0650 3108 32ea 3532 631b 6c8d  ..._.P1.2.52c.l.
0000c40: 435d 6272 bd00 f5fd 1b90 86d3 0c5b b4c5  C]br.........[..
0000c50: c084 03cd 81ea 8412 f0f3 f2ab 3dae 62bd  ............=.b.
0000c60: f435 736a 43b2 54bf 85a8 3e73 039a 8dcc  .5sjC.T...>s....
0000c70: cbdb 17f1 0edd cce1 f122 c383 073a 1df4  ........."...:..
0000c80: ac82 3a91 dab0 d8d8 22fe cfde de5c 2761  ..:....."....\'a
0000c90: eee4 698a 7393 ac31 9264 3598 2051 641f  ..i.s..1.d5. Qd.
0000ca0: 2faf c266 965d 32a8 99af 812b e6f2 eef0  /..f.]2....+....
0000cb0: 23c5 769e b4c1 ef76 4b2f 8872 a45e 5cbe  #.v....vK/.r.^\.
0000cc0: 4bad bf74 e9fd 0724 60fb f8eb 6544 d87a  K..t...$`...eD.z
0000cd0: 38ab d50b 28ca 4c2e c202 04ac fae6 20c2  8...(.L....... .
0000ce0: 2bda febc 1ae7 21bd 041f 5c42 984d 537b  +.....!...\B.MS{
0000cf0: 81b0 db61 cf58 39bc 67a1 ac76 b805 60f2  ...a.X9.g..v..`.
0000d00: 5bd7 7d3f 80fb d031 27bd a012 121e e537  [.}?...1'......7
0000d10: 1974 3d54 8843 11c0 4962 29dc c50f da49  .t=T.C..Ib)....I
0000d20: 157d 960a c0fe bf43 123b a11c 2f6d eede  .}.....C.;../m..
0000d30: 239a 8a22 83ac caf6 6cb7 845b 0430 8de2  #.."....l..[.0..
0000d40: e874 499e 0a                             .tI..
```

## Hash function

A hash function is any function that can be used to map digital data of arbitrary size to digital data of fixed size. In our example this fixed size will be able to change.

At the entrance we will bring the data into _8-bit_ chunks, pass it to function and receive _8-bit_ chunks of output, in such an amount which themselves want.

<img src="/assets/images/prints/NCG_1.jpeg" alt="NCG" width="450px" />

The input message is broken up into chunks of _32-bit_ blocks, the message is <u>padded</u> so that it’s length is divisible by 32. This blocks, using the “push” function will be added to the state matrix.

<img src="/assets/images/prints/NCG_2.jpeg" alt="NCG" width="400px" />

The <u>padding</u> works as follows: first a single bit, 1, is appended to the end of the message. This is followed by as many zeros as are required to bring the length of the message divisible by 32.

### Implementation

```c
/*  NCG written in 2015 by Maciej A. Czyzewski

To the extent possible under law, the author has dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty.

See <http://creativecommons.org/publicdomain/zero/1.0/>.  */

#define GET_32_INT(n, b, i)                           \
{                                                     \
  (n) = ( (unsigned long) (b)[(i)    ]       )        \
      | ( (unsigned long) (b)[(i) + 1] << 8  )        \
      | ( (unsigned long) (b)[(i) + 2] << 16 )        \
      | ( (unsigned long) (b)[(i) + 3] << 24 );       \
}

#define PUT_32_INT(n, b, i)                           \
{                                                     \
  (b)[(i)    ] = (unsigned char) ( (n)       );       \
  (b)[(i) + 1] = (unsigned char) ( (n) >> 8  );       \
  (b)[(i) + 2] = (unsigned char) ( (n) >> 16 );       \
  (b)[(i) + 3] = (unsigned char) ( (n) >> 24 );       \
}

void ncg(const uint8_t *initial_message, size_t initial_length,
               uint8_t *result, size_t result_length) {
  // Cleaning state matrix
  reset();

  // Declaration of variables
  size_t length, offset;

  // Declaration of message
  uint8_t *message = NULL, *buffer = NULL;

  // Declaration of message chunk
  uint32_t chunk;

  // Calculate new length
  for (length = initial_length;
       length % 4 != 0; length++);

  // Prepare message
  message = (uint8_t*) malloc(length * 8);

  // Copy block of memory
  memcpy(message, initial_message, initial_length);

  // Complement to the full blocks
  if (length - initial_length > 0) {
    // Append "1" bit
    message[initial_length] = 0x80;

    // Append "0" bits
    for (offset = initial_length + 1; offset < length; offset++)
      message[offset] = 0;
  }

  // Append the len in bits at the end of the buffer
  PUT_32_INT(initial_length * 8, message + length, 0);

  // Initial_len >> 29 == initial_len * 8 >> 32, but avoids overflow
  PUT_32_INT(initial_length >> 29, message + length + 4, 0);

  // Process the message in successive 32-bit chunks
  for (int i = 0; i < length; i += 4) {
    // Get little endian
    GET_32_INT(chunk, message + i, 0);

    // Push to NCG structure
    push(chunk);
  }

  // Releasing memory
  free(message);

  // Allocate memory for result
  buffer = (uint8_t*) malloc(result_length * 8);

  // Process the result in successive 32-bit chunks
  for (int i = 0; i < result_length / 4 + 1; i++)
    PUT_32_INT(pull(), buffer, i * 4);

  // Save it on the pointer
  for (int i = 0; i < result_length; i++)
    result[i] = buffer[i];

  // Releasing memory
  free(buffer);
}
```

### Usage

```c
#include <stdio.h>
#include <stdlib.h>

#include "../src/ncg.c"
#include "../src/include/hash.c"

int main (int argc, char const *argv[])
{
  const char *initial_message = argv[1];
  size_t initial_length = strlen(initial_message);

  if (argc < 3) {
    printf("usage: %s 'string' <number> \n", argv[0]);
    return 1;
  }

  size_t result_length = atoi(argv[2]);
  uint8_t *result = (uint8_t*) malloc(result_length * 8);

  printf(">> ");
  for (int i = 0; i < initial_length; i++)
    printf("%p ", initial_message[i]);
  printf("\n");

  ncg((uint8_t*) initial_message, initial_length, result, result_length);

  printf("<< ");
  for (int i = 0; i < result_length; i++)
    printf("%p ", result[i]);
  printf("\n");

  return 0;
}
```

The following command will hash my username and return 12 blocks of 8 bits.

```bash
$ bin/hash maciejczyzewski 12
```

It should look something like this:

```
>> 0x6d 0x61 0x63 0x69 0x65 0x6a 0x63 0x7a 0x79 0x7a 0x65 0x77 0x73 0x6b 0x69
<< 0xf2 0x7b 0x6c 0x34 0x22 0xd7 0x15 0xc4 0x31 0x4 0xf4 0xa7
```

## Analysis

Since __PRNGs__ are commonly used for cryptographic purposes, it is sometimes required that the transformation and output functions satisfy two additional properties:

- __unpredictability__ — given a sequence of output bits, the preceding and following bits shouldn’t be predictable
- __nonreversibility__ — given the current state of the generator, the previous states shouldn’t be computable

### Period

Half of the cells has a known period <span class="equation" data-expr="2^{16}"></span>, half unknown. It will be depending on seed. So we can approximately determine how much it is.

<div class="equation" data-expr="\prod_{}^{s/2} 2^{16} \leq  x  \leq \prod_{}^{s} 2^{16}"></div>
<div class="equation" data-expr="2^{8s} \leq  x  \leq 2^{16s}"></div>

In the reference implementation we have <span class="equation" data-expr="s = 16"></span> (the number of cells), which gives the period <span class="equation" data-expr="2^{128}"></span>, which can be up to <span class="equation" data-expr="2^{256}"></span>.

### Tests

Below I present the results of _Dieharder_ package.

```
#============================================================================#
#          dieharder version 3.31.1 Copyright 2003 Robert G. Brown           #
#============================================================================#
   rng_name    |rands/second|   Seed   |
stdin_input_raw|  1.44e+07  |1013904223|
#============================================================================#
        test_name   |ntup| tsamples |psamples|  p-value |Assessment
#============================================================================#
   diehard_birthdays|   0|       100|     100|0.68760491|  PASSED
      diehard_operm5|   0|   1000000|     100|0.60338392|  PASSED
  diehard_rank_32x32|   0|     40000|     100|0.72741893|  PASSED
    diehard_rank_6x8|   0|    100000|     100|0.40686281|  PASSED
   diehard_bitstream|   0|   2097152|     100|0.11114321|  PASSED
        diehard_opso|   0|   2097152|     100|0.68394748|  PASSED
        diehard_oqso|   0|   2097152|     100|0.32992622|  PASSED
         diehard_dna|   0|   2097152|     100|0.56163554|  PASSED
diehard_count_1s_str|   0|    256000|     100|0.71053127|  PASSED
diehard_count_1s_byt|   0|    256000|     100|0.89506062|  PASSED
 diehard_parking_lot|   0|     12000|     100|0.20530715|  PASSED
    diehard_2dsphere|   2|      8000|     100|0.26229756|  PASSED
    diehard_3dsphere|   3|      4000|     100|0.25539304|  PASSED
     diehard_squeeze|   0|    100000|     100|0.01187059|  PASSED
        diehard_sums|   0|       100|     100|0.01594921|  PASSED
        diehard_runs|   0|    100000|     100|0.70012571|  PASSED
        diehard_runs|   0|    100000|     100|0.85828519|  PASSED
       diehard_craps|   0|    200000|     100|0.53225310|  PASSED
       diehard_craps|   0|    200000|     100|0.80793088|  PASSED
 marsaglia_tsang_gcd|   0|  10000000|     100|0.77371790|  PASSED
 marsaglia_tsang_gcd|   0|  10000000|     100|0.21404231|  PASSED
         sts_monobit|   1|    100000|     100|0.13107313|  PASSED
            sts_runs|   2|    100000|     100|0.17077185|  PASSED
          sts_serial|   1|    100000|     100|0.36964981|  PASSED
          sts_serial|   2|    100000|     100|0.56554703|  PASSED
          sts_serial|   3|    100000|     100|0.17688201|  PASSED
          sts_serial|   3|    100000|     100|0.07354402|  PASSED
          sts_serial|   4|    100000|     100|0.20851101|  PASSED
          sts_serial|   4|    100000|     100|0.26800621|  PASSED
          sts_serial|   5|    100000|     100|0.36153060|  PASSED
          sts_serial|   5|    100000|     100|0.99332267|  PASSED
          sts_serial|   6|    100000|     100|0.51988325|  PASSED
          sts_serial|   6|    100000|     100|0.75304159|  PASSED
          sts_serial|   7|    100000|     100|0.54078846|  PASSED
          sts_serial|   7|    100000|     100|0.97449718|  PASSED
          sts_serial|   8|    100000|     100|0.98107892|  PASSED
          sts_serial|   8|    100000|     100|0.83144828|  PASSED
          sts_serial|   9|    100000|     100|0.98619491|  PASSED
          sts_serial|   9|    100000|     100|0.53830207|  PASSED
          sts_serial|  10|    100000|     100|0.32406139|  PASSED
          sts_serial|  10|    100000|     100|0.96536239|  PASSED
          sts_serial|  11|    100000|     100|0.80903975|  PASSED
          sts_serial|  11|    100000|     100|0.71929241|  PASSED
          sts_serial|  12|    100000|     100|0.88093693|  PASSED
          sts_serial|  12|    100000|     100|0.38976565|  PASSED
          sts_serial|  13|    100000|     100|0.91812042|  PASSED
          sts_serial|  13|    100000|     100|0.52045734|  PASSED
          sts_serial|  14|    100000|     100|0.59669668|  PASSED
          sts_serial|  14|    100000|     100|0.76896151|  PASSED
          sts_serial|  15|    100000|     100|0.95502691|  PASSED
          sts_serial|  15|    100000|     100|0.45080125|  PASSED
          sts_serial|  16|    100000|     100|0.70559702|  PASSED
          sts_serial|  16|    100000|     100|0.17087587|  PASSED
         rgb_bitdist|   1|    100000|     100|0.08849639|  PASSED
         rgb_bitdist|   2|    100000|     100|0.94691638|  PASSED
         rgb_bitdist|   3|    100000|     100|0.97190802|  PASSED
         rgb_bitdist|   4|    100000|     100|0.85030534|  PASSED
         rgb_bitdist|   5|    100000|     100|0.03848173|  PASSED
         rgb_bitdist|   6|    100000|     100|0.22623609|  PASSED
         rgb_bitdist|   7|    100000|     100|0.42042685|  PASSED
         rgb_bitdist|   8|    100000|     100|0.73694070|  PASSED
         rgb_bitdist|   9|    100000|     100|0.80886713|  PASSED
         rgb_bitdist|  10|    100000|     100|0.91299708|  PASSED
         rgb_bitdist|  11|    100000|     100|0.94595773|  PASSED
         rgb_bitdist|  12|    100000|     100|0.10891321|  PASSED
rgb_minimum_distance|   2|     10000|    1000|0.78051158|  PASSED
rgb_minimum_distance|   3|     10000|    1000|0.79599477|  PASSED
rgb_minimum_distance|   4|     10000|    1000|0.34006503|  PASSED
rgb_minimum_distance|   5|     10000|    1000|0.25582574|  PASSED
    rgb_permutations|   2|    100000|     100|0.87121393|  PASSED
    rgb_permutations|   3|    100000|     100|0.09680143|  PASSED
    rgb_permutations|   4|    100000|     100|0.92636360|  PASSED
    rgb_permutations|   5|    100000|     100|0.03545953|  PASSED
      rgb_lagged_sum|   0|   1000000|     100|0.32737258|  PASSED
      rgb_lagged_sum|   1|   1000000|     100|0.18272785|  PASSED
      rgb_lagged_sum|   2|   1000000|     100|0.48362806|  PASSED
      rgb_lagged_sum|   3|   1000000|     100|0.61443391|  PASSED
      rgb_lagged_sum|   4|   1000000|     100|0.19090452|  PASSED
      rgb_lagged_sum|   5|   1000000|     100|0.62513523|  PASSED
      rgb_lagged_sum|   6|   1000000|     100|0.12764951|  PASSED
      rgb_lagged_sum|   7|   1000000|     100|0.60169948|  PASSED
      rgb_lagged_sum|   8|   1000000|     100|0.98299752|  PASSED
      rgb_lagged_sum|   9|   1000000|     100|0.35120273|  PASSED
      rgb_lagged_sum|  10|   1000000|     100|0.94713041|  PASSED
      rgb_lagged_sum|  11|   1000000|     100|0.09391413|  PASSED
      rgb_lagged_sum|  12|   1000000|     100|0.38399912|  PASSED
      rgb_lagged_sum|  13|   1000000|     100|0.68551131|  PASSED
      rgb_lagged_sum|  14|   1000000|     100|0.51304472|  PASSED
      rgb_lagged_sum|  15|   1000000|     100|0.83854624|  PASSED
      rgb_lagged_sum|  16|   1000000|     100|0.69671933|  PASSED
      rgb_lagged_sum|  17|   1000000|     100|0.98210769|  PASSED
      rgb_lagged_sum|  18|   1000000|     100|0.62606279|  PASSED
      rgb_lagged_sum|  19|   1000000|     100|0.92413752|  PASSED
      rgb_lagged_sum|  20|   1000000|     100|0.35844485|  PASSED
      rgb_lagged_sum|  21|   1000000|     100|0.91379437|  PASSED
      rgb_lagged_sum|  22|   1000000|     100|0.49736261|  PASSED
      rgb_lagged_sum|  23|   1000000|     100|0.45986288|  PASSED
      rgb_lagged_sum|  24|   1000000|     100|0.83547935|  PASSED
      rgb_lagged_sum|  25|   1000000|     100|0.01019699|  PASSED
      rgb_lagged_sum|  26|   1000000|     100|0.97686674|  PASSED
      rgb_lagged_sum|  27|   1000000|     100|0.39102117|  PASSED
      rgb_lagged_sum|  28|   1000000|     100|0.90037515|  PASSED
      rgb_lagged_sum|  29|   1000000|     100|0.16237886|  PASSED
      rgb_lagged_sum|  30|   1000000|     100|0.24306862|  PASSED
      rgb_lagged_sum|  31|   1000000|     100|0.50767164|  PASSED
      rgb_lagged_sum|  32|   1000000|     100|0.42251956|  PASSED
     rgb_kstest_test|   0|     10000|    1000|0.44428889|  PASSED
     dab_bytedistrib|   0|  51200000|       1|0.84205570|  PASSED
             dab_dct| 256|     50000|       1|0.28600375|  PASSED
Preparing to run test 207.  ntuple = 0
        dab_filltree|  32|  15000000|       1|0.39995294|  PASSED
        dab_filltree|  32|  15000000|       1|0.05144073|  PASSED
Preparing to run test 208.  ntuple = 0
       dab_filltree2|   0|   5000000|       1|0.68907045|  PASSED
       dab_filltree2|   1|   5000000|       1|0.06778706|  PASSED
Preparing to run test 209.  ntuple = 0
        dab_monobit2|  12|  65000000|       1|0.82731255|  PASSED
```

And here’s an interesting clippings from _TestU01_.

```
========================= Summary results of Alphabit ========================

Version:                                                         TestU01 1.2.3
Generator:                                                                 NCG
Number of bits:                                                        1048576
Number of statistics:                                                       17
Total CPU time:                                                    00:00:00.03

                                                         All tests were passed
```

```
======================== Summary results of SmallCrush =======================

Version:                                                         TestU01 1.2.3
Generator:                                                                 NCG
Number of statistics:                                                       15
Total CPU time:                                                    00:00:07.25

                                                         All tests were passed
```

```
========================== Summary results of Crush ==========================

Version:                                                         TestU01 1.2.3
Generator:                                                                 NCG
Number of statistics:                                                      144
Total CPU time:                                                    00:51:15.84

                                                         All tests were passed
```

```
========================= Summary results of BigCrush ========================

Version:                                                         TestU01 1.2.3
Generator:                                                                 NCG
Number of statistics:                                                      160
Total CPU time:                                                    05:30:14.75

                                                         All tests were passed
```

```
====================== Summary results of pseudoDIEHARD ======================

Generator:                                                                 NCG
Number of statistics:                                                      126
Total CPU time:                                                    00:00:22.12

                                                         All tests were passed
```

```
========================== Summary results of Rabbit =========================

Version:                                                         TestU01 1.2.3
Generator:                                                                 NCG
Number of bits:                                                       10000000
Number of statistics:                                                       39
Total CPU time:                                                    00:00:06.54

                                                         All tests were passed
```

```
======================== Summary results of FIPS-140-2 =======================

Generator:                                                                 NCG
Number of bits:                                                          20000

                  Test          s-value        p-value    FIPS Decision
------------------------------------------------------------------------------
            Monobit              10027           0.35       Pass
            Poker                12.84           0.61       Pass

            0 Runs, length 1:     2559                      Pass
            0 Runs, length 2:     1246                      Pass
            0 Runs, length 3:      606                      Pass
            0 Runs, length 4:      312                      Pass
            0 Runs, length 5:      135                      Pass
            0 Runs, length 6+:     164                      Pass

            1 Runs, length 1:     2498                      Pass
            1 Runs, length 2:     1263                      Pass
            1 Runs, length 3:      660                      Pass
            1 Runs, length 4:      319                      Pass
            1 Runs, length 5:      131                      Pass
            1 Runs, length 6+:     150                      Pass

            Longest run of 0:       13           0.50       Pass
            Longest run of 1:       17           0.07       Pass
-----------------------------------------------------------------------------

                   All values are within the required intervals of FIPS-140-2
```

### Randomnessification

Mapping the result to bitmap shows how evenly the data is distributed.

<img src="/assets/images/prints/NCG.bmp" alt="NCG" width="400px" />

As seen above, generator does not form any pattern or lines. If you want to compare it with others, click [here](http://www.reedbeta.com/blog/2013/01/12/quick-and-easy-gpu-random-numbers-in-d3d11/).

### Attack

In this section we try to consider a simple attack. Let’s try to choose a different <span class="equation" data-expr="seed_1"></span> and <span class="equation" data-expr="seed_2"></span> which perform the same operations during the “push”.

In this function, we have two operations where the seed is multiplied by a constant which is 1013904223. In the first case it is an original seed, in the second case it is a square.

Also, we must remember that we are dealing with _32-bit_ values. So it will be modulate by <span class="equation" data-expr="2^{32}"></span> (default arithmetic).

Therefore, gathering this information together, we get:

<div style="margin-bottom:15px" class="equation" data-expr="(seed_1 * 1013904223) \space mod \space 2^{32} = (seed_2^2 * 1013904223) \space mod \space 2^{32}"></div>
<div class="equation" data-expr="(seed_2 * 1013904223) \space mod \space 2^{32} = (seed_1^2 * 1013904223) \space mod \space 2^{32}"></div>

Possible solutions: (where <span class="equation" data-expr="x"></span> is an arbitrary integer)

<p>[</p><div style="margin-bottom:15px" class="equation" data-expr="[\space seed_1 = \frac{1}{2}*x*\sqrt{3} - \frac{1}{2}, \space seed_2 = -\frac{1}{2}*x*\sqrt{3} - \frac{1}{2} \space],"></div>
<div style="margin-bottom:15px" class="equation" data-expr="[\space seed_1 = -\frac{1}{2}*x*\sqrt{3} - \frac{1}{2}, \space seed_2 = \frac{1}{2}*x*\sqrt{3} - \frac{1}{2} \space],"></div>
<div style="margin-bottom:15px" class="equation" data-expr="[\space seed_1 = 1, \space seed_2 = 1 \space],"></div>
<div style="margin-bottom:0px" class="equation" data-expr="[\space seed_1 = 0, \space seed_2 = 0 \space]"></div><p>]</p>

As you can see only the first two solutions have different values for seeds. But because these numbers are incomplete, they can not be written as _32-bit_ values. Consequently, you can not choose these seeds. So this type of attack is impossible.

## Collaboration

I’ve tested it as I could. I appeal to everyone willing, to help improve the generator. I will try to gain access to the supercomputer to be able to confirm the effectiveness of the algorithm.

<img src="/assets/images/prints/NCG_6.jpeg" alt="NCG" width="400px" />

Also it would be worth to write an implementation which is thread-save, or in some other languages.

## Appendix

If you are interested in full reference implementation, you can download it from [here](/assets/files/NCG.zip). The whole code is written in _ANSI C_.