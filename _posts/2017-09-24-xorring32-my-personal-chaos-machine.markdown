---
layout: article
title:  "xorring32: my personal chaos machine"
date:   2017-09-24 11:21:00
label:  bg-special
---

I don't have time to briefly explain an algorithm,
however I decided to publish it here.
Maybe in future I will write a paper on it.
Below ready to use snippet of code.

	Fast, cryptographic & secure. 2^n period.
	Passes all test cases: dieharder, testU01.
	Purpose: hashing, generating random numbers.

Bye, have a nice day.

## Implementation

{% highlight c++ %}
#include <bits/stdc++.h>
using namespace std;

#define FOR(i, a, b) for (int i = a; i <= b; ++i)
#define all(x) (x).begin(), (x).end()
#define REP(i, n) FOR(i, 0, n - 1)
#define VEC(e, v) for (auto &e: v)
#define num(x) ((int)(x).size())

typedef vector<int> vi;
typedef uint32_t u32;

// parameters /////////////////////////////////////////////////////////////////

int TIME = 3, SPACE = 9;
vector<u32> KEY = {0xbbe112c5, 0xa8354e67, 0x22c32ce1,
                   0xe5980656, 0xda49884, 0x34343434};

// xorring32 //////////////////////////////////////////////////////////////////

struct xorring32 {
	size_t X = 8, Y = 9, Z = 23; // other: 3, 13, 7
	deque<u32> buffer; int time, space;

	xorring32(vector<u32> key, int t = 1) : time(t)
	{ buffer.resize(space = num(key)); copy(all(key), buffer.begin()); }

	void push(const u32 &block) { REP(i, (int)this->time)
	{ u32 cache = this->pull(); buffer.front() += cache + block; }}

	u32 pull(void) { u32 a = buffer.front(), b = buffer.back(), c;
		buffer.pop_front(), c = (a ^ (a >> X));  // @1
		buffer.push_back(   c = (b ^ (b << Y))   // @2
		                      ^ (c ^ (c << Z))); // @3
	return (a + buffer[b % space]) ^ c; }
};

vector<u32> keygen(vector<u32> key, int s)
{ xorring32 box(key); vector<u32> ret(s);
	REP(i, s) { ret[i] = box.pull(); }
	return ret; }

typedef xorring32 xr32;

// test ///////////////////////////////////////////////////////////////////////

int main() {
	cout << "<<< xr32 (time:" << TIME ///////////////////// debug
	     << ", space:" << SPACE << ") >>>" << endl; /////// debug

	FOR(i, 0, num(KEY)-1) { printf("%10p ", KEY[i]); ////// debug
	if(i % 3 == 2) printf("\n"); }; cout << endl; ///////// debug

	cout << "[generating initial states]" << endl; //////// debug

	vector<u32> xrkey = keygen(KEY, SPACE); ////// key generation

	FOR(i, 0, num(xrkey)-1) { printf("%10p ", xrkey[i]); // debug
	if(i % 3 == 2) printf("\n"); }; cout << endl; ///////// debug

	xr32 gen(xrkey, TIME); ///////////// chaos machine: xorring32
	gen.push(24343443); gen.push(24434343); //// pushing 2 blocks

	cout << "[pulling 15 blocks of u32]" << endl; ///////// debug

	// .pull() generates new blocks
	REP(i, 15) { u32 blk = gen.pull(); bitset<32> bit(blk);
	cout << bit.to_string() << " : " << blk << endl; } //// debug
}
{% endhighlight %}

## Output

{% highlight c++ %}
<<< xr32 (time:3, space:9) >>>
0xbbe112c5 0xa8354e67 0x22c32ce1
0xe5980656  0xda49884 0x34343434

[generating initial states]
0xfc93e91a 0xd83d73fb 0x79db5a30
0x1de806fa 0xfa5f232c 0xccc6d0c0
0xadd55aed 0x42dc3776 0x8f87fb09

[pulling 15 blocks of u32]
01011110110000011110000110000010 : 1589764482
11000111001000111010000111011010 : 3341001178
11010101111101100100010010001000 : 3589686408
10010100110111111110000110000001 : 2497700225
00100010011000011101010010111100 : 576836796
01011110101010010101000111100111 : 1588154855
01010001000101100111010100111010 : 1360426298
00101110011110000100011010011000 : 779634328
11111001100111101000000001011110 : 4187914334
00000001001111010010111011111110 : 20786942
01100010110000001110111001110010 : 1656811122
01011110011111101110111000111101 : 1585376829
10101011000001010100000111111010 : 2869248506
00110100011001010101010000011000 : 879055896
11011111100111000100111111111101 : 3751563261
{% endhighlight %}
