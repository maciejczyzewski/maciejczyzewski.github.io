---
layout: article
title:  "Making use of chaos theory in cryptography"
date:   2016-10-05 9:15:02

label:  bg-special
---

<u>Have you ever been fascinated by chaotic maps, fractals or something connected with disorder or randomness?</u>

It turns out that pseudo-random function can be easily enriched by [chaotic system](https://en.wikipedia.org/wiki/Chaos_theory), creating something completely new. It's interesting that this scheme allows specification by three parameters that control: _execution time_, _period/memory required_, _initial secret key_.

Therefore it could be in future an alternative to such algorithms like: [Mersenne Twister](http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html), [Argon2](https://password-hashing.net/#argon2) or [Keccak](http://keccak.noekeon.org/).

Idea is to create a universal tool (design pattern) with modular design and customizable parameters, that can be applied where __randomness__ and __sensitiveness__ is needed:

- [Randomness extractor](https://en.wikipedia.org/wiki/Randomness_extractor) is a function, which being applied to output from a weakly random entropy source, together with a short, uniformly random seed, generates a highly random output that appears independent from the source and uniformly distributed.
- [Pseudo-random function family](https://en.wikipedia.org/wiki/Pseudorandom_function_family) is a collection of efficiently-computable functions which emulate a random oracle.
- [Cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) is a special class of hash function that has certain properties which make it suitable for use in cryptography.

<img src="https://lh3.googleusercontent.com/sIXy4jX7VMgY0ZGlSlO70HIhxVsyghO8azVFVHVxh_HLzIh873LvEL63ZfvCybfv8YoNokkeHw=w1520-h1406-no" style="width:25em" alt="modern way"/>

In this blog post, I want only to promote the idea of using chaos... why some things are written in informal way. At the end I have implemented an example as [proof of concept](#implementation), <u>that passes all the Dieharder,
NIST and TestU01 test sets.</u>

## Purpose

<https://eprint.iacr.org/2016/468.pdf>

In this article it's described a theoretical model of <u>chaos machine</u>, which combines the benefits of [hash function](https://en.wikipedia.org/wiki/Hash_function) and [pseudo-random function](https://en.wikipedia.org/wiki/Pseudo-random_function), forming flexible __one-way__ push-pull interface, where the construction and selection of parameters determines usage. It generates sequences of pseudo-random numbers that are unique and sensitive to the initial conditions and inputs.

Therefore, machine can be used to implement many cryptographic primitives, including cryptographic hashes, message authentication codes and pseudo-random number generators.

## Background

A lot of research has gone into chaos and randomness theory. Development in computer software and applications continues to be very dynamic. Each software problem requires different tools and algorithms to solve it effectively and achieve best results. As a consequence, we witness the announcement of new projects in quick succession with multiple updates. <u>Engineer's problem is how to decide which method will suit his needs best. </u>

Random numbers have been one of the most useful objects in statistics, computer science, cryptography, modeling, simulation, and other applications though it is very difficult to construct true randomness. Many applications of randomness have led to the development of several methods for generating random data. The generation of pseudo-random numbers is an important and common task in computer programming. Cryptographers design algorithms such as RC4 and DSA, and protocols such as SET and SSL, with the assumption that random numbers are available.

Hash is the term basically originated from computer science where it means chopping up the arbitrary length message into fixed length output. Hash tables are popular data structures for storing key-value pairs. A hash function is used to map the key value to array index, because it has numerous applications from indexing, with hash tables and bloom filters; to spell-checking, compression, password hashing and cryptography. They are used in many different kinds of settings and accordingly their security requirement changes.

> Hash functions were designed for uniqueness, while pseudo-random functions for randomness. There is a tendency for people to avoid learning anything about such subroutines.
<span>-- Donald Knuth</span>

Quite often we find that some old method that is comparatively unsatisfactory has blindly been passed down from one programmer to another, and today's users have no understanding of its limitations.

Therefore, appears the idea to create a universal tool (design pattern) with modular design and customizable parameters, that can be applied where __randomness__ and __sensitiveness__ is needed ([random oracle](https://en.wikipedia.org/wiki/Random_oracle)), and where appropriate construction determines case of application and selection of parameters provides preferred properties and security level. It should be so easy to use that an intelligent, careful programmer with no background in cryptography has some reasonable chance of using such tool in secure way.

## Overview

Chaos theory started more than thirty years ago and changed our world view regarding the role of randomness and determinism, these theories present some interesting aspects in cryptography:

- *Chaotic systems* are highly sensitive to initial conditions and exhibits chaotic behavior. The main characteristics of chaotic systems make them intuitively interesting for their application in cryptography. Edward Lorenz used to say "Chaos: When the present determines the future, but the approximate present does not approximately determine the future.".

- *Randomness* is the lack of pattern or predictability in events, a phenomenon located at a single point in spacetime. A pseudo-random process is a process that appears to be random but is not. Pseudo-random sequences typically exhibit statistical randomness while being generated by an entirely deterministic causal process.

### Chaotic maps

The chaotic systems are inherently deterministic given the initial state of the system. The chaotic behavior is a result of the exponential sensitivity of the system to the initial state that can not be exactly determined in practice. To create such system we can use [chaotic map](https://en.wikipedia.org/wiki/List_of_chaotic_maps) - evolution function that exhibits some sort of chaotic behavior.

<br/>

<style>.img-of-system{padding:0.5em}</style>

<div class="grid grid--center">
	<div class="grid__cell grid--1of4 img-of-system">
		<img src="https://upload.wikimedia.org/wikipedia/commons/0/03/Henon_Multifractal_Map_movie.gif" alt="Hénon map"/>
	</div>
	<div class="grid__cell grid--1of4 img-of-system">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/GBM.png/440px-GBM.png" alt="Gingerbreadman map"/>
	</div>
	<div class="grid__cell grid--1of4 img-of-system">
		<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bogdanov_takens_bifurcation.svg/700px-Bogdanov_takens_bifurcation.svg.png" alt="Bogdanov map"/>
	</div>
	<div class="grid__cell grid--1of4 img-of-system">
		<img src="https://lh3.googleusercontent.com/LWL680_ZwFN5v2MH0LJx1Q5Dqib5ultrm5JCSfL_HjRxmYAgia3Kr_JxzPr_lP1GQJoQsp_aI5JWSsCfrj2szI0tYVQ484tlk9HREMyv4PPUAFZTKWjEXCoyLsXMu2OFsqRR46VtFyhiiO_KSeSI4k5uKfX1eUjlRZs8chvNadES4SwfQNPhOI3m7T-15waM_NopIYcme8shzQNlSmLbvjT2t9CwJ0ztwVQ_cPYP88WFoWch70Px_iJb0eIZSjuuNWI7cq6Z3iUWLgfuPAPxzO526f0gRzZL2jn3YB3x7aanD76LjUQt-PxjafzgoXfoD68dKxTE-zSlpNfg8_Ph3Abmogo4r6P_T3WD7i6jYPbn3_5ayFVhx7s3HA-f6_WMDZ60nbeVE83-8VUgWuX4i0a2uiaE2xw_HXWeWEXyrIQvJWQRS_uLaFR6juOgLYvn-nCEwV9b6cxYrC8Y86z0NSFGefPZCfjCe2gD-iGph1Tift1BVTCMS7GLVPJVG2004KeVF0HizWABds4pJFrpXt1Lpy-jJp3Idd-YE1rozb602JT8Ax6ujqdOMxhpbioNZgeg6wSlSajXwcd-WquOZJeelrmZi7YndTeLk-BwFMNVU3ra=w640-h480-no" alt="Lorenz system"/>
	</div>
</div>

<br/>

Name | Math
--- | ---
[Hénon map](https://en.wikipedia.org/wiki/H%C3%A9non_map) | $$\begin{cases} x_{n+1} = 1 - a x_n^2 + y_n\\ y_{n+1} = b x_n \end{cases}$$
[Gingerbreadman map](https://en.wikipedia.org/wiki/Gingerbreadman_map) | $$\begin{cases} x_{n+1} = 1 - y_n + \|x_n\|\\ y_{n+1} = x_n \end{cases}$$
[Bogdanov map](https://en.wikipedia.org/wiki/Bogdanov_map) | $$\begin{cases} x_{n+1} = x_n + y_{n+1}\\ y_{n+1} = y_n + \epsilon y_n + k x_n (x_n - 1) + \mu x_n y_n \end{cases}$$
[Lorenz equations](https://en.wikipedia.org/wiki/Lorenz_system) | $$\begin{cases}\frac{\mathrm{d}x}{\mathrm{d}t} = \sigma (y - x)\\ \frac{\mathrm{d}y}{\mathrm{d}t} = x (\rho - z) - y\\ \frac{\mathrm{d}z}{\mathrm{d}t} = x y - \beta z\end{cases}$$

### Control theory

> NOT READY... JUST WAIT

### Chaos machine

> NOT READY... JUST WAIT

## Application

{% highlight cpp %}
// #1: default secret key
chaos::machine<chaos::engines::ncg> x_machine;

// #2: set own secret key (vector of uint8_t)
chaos::machine<chaos::engines::ncg> x_machine(y_vector);

// setting parameters
x_machine.set_time(y_integer);  // integer > 0
x_machine.set_space(y_integer); // integer > 0
x_machine.set_key(y_vector);    // vector of uint8_t

// single I/O
x_machine.push(y_integer);      // uint8_t
x_machine.pull();               // uint8_t

// multiple I/O
x_machine.message(y_vector);    // vector of uint8_t
x_machine.digest(y_integer);    // vector of uint8_t * y_integer

/* code is in section @implementation */
{% endhighlight %}

### Pseudo-random function family

{% highlight cpp %}
#include <ctime>
#include <iostream>

#include "chaos.hpp" // library header

// create seed on the base of time
uint8_t seed = static_cast<uint8_t>(time(NULL));

// initialize chaos machine using NCG algorithm/engine
chaos::machine<chaos::engines::ncg> x_machine;

int main(void) {
	// configure machine with parameters (t=2, m=256)
	x_machine.set_time(2); x_machine.set_space(256);

	// initialize with seed (still pseudo-randomness)
	x_machine.push(seed); // can be anything

	// serve like /dev/random
	while (true)
		putc_unlocked(x_machine.pull(), stdout);
}
{% endhighlight %}

Execute and stop after 1024 octets:

```
./fake_dev_random | xxd -l 1024
```

### Cryptographic hash function

{% highlight cpp %}
#include <iostream>
#include <string>
#include <vector>

#include "chaos.hpp" // library header

// allocate std::vector (our starting variable)
std::vector<uint8_t> y_secret = {0x14, 0x15, 0x92, 0x65,
																 0x35, 0x89, 0x79, 0x32};

// initialize chaos machine using NCG algorithm/engine
chaos::machine<chaos::engines::ncg> x_machine(y_secret);

int main(int argc, char** argv) {
	// allocate std::vector (our message/bitstrings)
	std::string y_string = argv[1]; // "Lorem ipsum dolor sit..."
	std::vector<uint8_t> y_vector(y_string.begin(), y_string.end());

	// make use of chaos machine (push/pull interface)
	x_machine.message(y_vector);                           // push
	std::vector<uint8_t> y_result = x_machine.digest(256); // pull

	// print values in hexadecimal format
	for (size_t i = 0; i < y_result.size(); i++)
		printf("%02x", y_result[i]);
}
{% endhighlight %}

Simple comparison to check [avalanche effect](https://en.wikipedia.org/wiki/Avalanche_effect):

```
cmp -bl <(./fake_hash_function "Lorem ipsum dolor sit...") \
        <(./fake_hash_function "Lorem ipsum bolor sit...")
```

## Implementation

The NCG algorithm is a sample implementation of chaos machine. Emphasis has been placed on period that is calculable, but also on high sensitivity to initial conditions and quality of output. Algorithm passes all the Dieharder,
NIST and TestU01 test sets. In addition, it shows resistance to common cryptographic attacks.

{% highlight cpp %}
#ifndef CHAOS_HH
#define CHAOS_HH

#include <iostream>
#include <stdexcept>
#include <vector>

namespace chaos { //::chaos ////////////////////////////////////////////////////
namespace engines { //::chaos::engines /////////////////////////////////////////

/*  NCG written in 2015 by Maciej A. Czyzewski
To the extent possible under law, the author has dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty.
See <http://creativecommons.org/publicdomain/zero/1.0/>.  */

class ncg {
public:
	// metadata
	static const std::string name, authors;

	// typename
	const size_t __size_push = 32, __size_pull = 32;

	// defaults
	const size_t __default_space = 8, __default_time = 1;
	const std::vector<uint8_t> __default_key = {0x14, 0x15, 0x92, 0x65,
	                                            0x35, 0x89, 0x79, 0x32};

	// interface
	void __push(uint32_t);
	uint32_t __pull(void);

	// cleaning
	void __reset(void);

protected:
	// costs
	size_t __cost_space = 0, __cost_time = 0;

	// methods
	virtual void __set_key(std::vector<uint8_t> value) {
		// resize key if needed
		value.resize(this->__cost_space);
		// set starting variable
		for (std::vector<uint8_t>::size_type i = 0; i != value.size(); i++) {
			// in NCG one hybrid system is build upon two cells in buffer
			this->buffer[i * 2] = (value[i] >> 4) & 0x0F;
			this->buffer[i * 2 + 1] = (value[i] >> 0) & 0x0F;
		}
	}
	virtual void __set_space(size_t value) {
		// set new space parameter
		this->__cost_space = value;
		// resize machine spaces if needed
		this->buffer.resize(this->__cost_space * 2);
	}
	virtual void __set_time(size_t value) {
		// set new time parameter
		this->__cost_time = value;
	}

private:
	// spaces in algorithm
	std::vector<uint16_t> buffer, params = {0, 0};
	// variables in the algorithm
	uint16_t a, b, Y;
	// S - seed, I - increment, X - mask, i - temporary
	uint32_t S, I, X, i;
};

////////////////////////////////////////////////////////////////////////////////

// metadata
const std::string ncg::name = "NCG (Naive Czyzewski Generator)";
const std::string ncg::authors = "Maciej A. Czyzewski";

// @1: abbreviation for getting values from the tape
#define M(i) ((i) % (this->__cost_space * 2))

// @2: bits rotation formula
#define R(x, y) (((x) << (y)) | ((x) >> (16 - (y))))

void ncg::__push(uint32_t block) {
	// preparation
	I = block * 0x3C6EF35F;

	for (S = block, i = 0; i < this->__cost_space * 2; i++) {
		// reinforcement
		buffer[M(i)] ^= ((I * (S + 1)) ^ S) >> 16;
		buffer[M(i)] ^= ((I * (S - 1)) ^ S) >> 00;

		// finalization
		I ^= ((buffer[M(I - 1)] + buffer[M(i)]) << 16) ^
		     ((buffer[M(I + 1)] - buffer[M(i)]) << 00);
	}
}

uint32_t ncg::__pull(void) {
	// variables
	a = buffer[M(I + 0)];
	b = buffer[M(I + 1)];

	// initialization
	X = (a + I) * (b - S);

	// chaos
	Y = (buffer[M(X - b)] << (a % 9)) ^ (buffer[M(X + a)] >> (b % 9));

	// rounds
	for (i = 0; i < this->__cost_time * 2; i += 2) {
		// absorption
		params[0] ^= buffer[M(I + i - 2)];
		params[1] ^= buffer[M(I + i + 2)];

		// mixing + modification
		params[0] ^= (params[1] ^= R(Y, params[0] % 17));
		buffer[M(I + i - 2)] -= (params[1] += (X & params[0]));
		params[1] += (params[0] += R(X, params[1] % 17));
		buffer[M(I + i + 2)] += (params[0] += (Y & params[1]));
	}

	// transformation
	buffer[M(I + 0)] = // chaotic map
	    R(params[0], X % 17) ^ R(params[1], X % 17) ^ (X & a) ^ (Y & b);
	buffer[M(I + 1)] = (b >> 1) ^ (-(b & 1u) & 0xB400u); // LFSR

	// finalization
	X += params[0] ^ (b << 8) ^ (params[1] << 16) ^ (a & 0xFF) ^ ((a >> 8) << 24);

	// cleaning
	params[0] = params[1] = 0xFFFF;

	// increment
	I += 2;

	return X;
}

void ncg::__reset(void) {
	// clear parameters space
	std::fill(params.begin(), params.end(), 0);
	S = 0x19660D00; // seed is not defined (prime)
	I = 0x3C6EF35F; // increment should be set
}

#undef M // @1
#undef R // @2

} //::chaos::engines ///////////////////////////////////////////////////////////

template <class algorithm> class machine : public virtual algorithm {
private:
	// memory
	std::vector<uint8_t> key;

	// cache
	uint_fast64_t cache[2] = {0, 0};
	size_t padding[2] = {0, 0};

public:
	explicit machine(std::vector<uint8_t> key = {});

	// configuration
	void set_key(std::vector<uint8_t>);
	void set_space(size_t);
	void set_time(size_t);

	// I/O single
	void push(uint8_t);
	uint8_t pull(void);

	// I/O stream
	void message(std::vector<uint8_t> &);
	std::vector<uint8_t> digest(size_t);

	// cleaning
	void reset(void);
};

/// methods ////////////////////////////////////////////////////////////////////

template <class algorithm>
machine<algorithm>::machine(std::vector<uint8_t> key) {
	// check if algorithm is supported by this container
	if (!(this->__size_push == 8 || this->__size_push == 16 ||
	      this->__size_push == 32 || this->__size_push == 64))
		throw std::invalid_argument("wrong __size_push data type. Supported "
		                            "types: uint8_t, uint16_t, uint32_t, uint64_t");
	if (!(this->__size_pull == 8 || this->__size_pull == 16 ||
	      this->__size_pull == 32 || this->__size_pull == 64))
		throw std::invalid_argument("wrong __size_pull data type. Supported "
		                            "types: uint8_t, uint16_t, uint32_t, uint64_t");
	// check if there is a initial secret key
	this->key = key.size() != 0 ? key : this->__default_key;
	// configure space and time parameter
	this->set_space(this->key.size());
	this->set_time(this->__default_time);
	// set starting variable
	this->reset();
}

template <class algorithm>
void machine<algorithm>::set_key(std::vector<uint8_t> key) {
	// check if received key is not empty
	this->key = key.size() != 0 ? key : this->__default_key;
	this->set_space(this->key.size()); // set new space parameter
	this->__set_key(key);              // pass via algorithm
};

template <class algorithm> void machine<algorithm>::set_time(size_t value) {
	this->__set_time(value); // pass via algorithm
};

template <class algorithm> void machine<algorithm>::set_space(size_t value) {
	this->__set_space(value); // pass via algorithm
};

template <class algorithm> void machine<algorithm>::push(uint8_t block) {
	// do not use cache if 8 bit
	if (this->__size_push == 8)
		return this->__push(block);
	// add block to cache variable
	this->cache[0] ^= block << (this->__size_push - (this->padding[0] + 1) * 8);
	if (this->__size_push == (this->padding[0] + 1) * 8) {
		// clear cache and push to engine
		this->__push(this->cache[0]);
		this->padding[0] = this->cache[0] = this->padding[1] = 0;
	} else {
		this->padding[0]++; // increment
	}
}

template <class algorithm> uint8_t machine<algorithm>::pull(void) {
	// do not use cache if 8 bit
	if (this->__size_pull == 8)
		return this->__pull();
	// if input cache is not full
	if (this->padding[0] > 0) {
		this->__push(this->cache[0]); // push to engine
		this->padding[0] = this->cache[0] = this->padding[1] = 0;
	}
	// if there is empty cache
	if (this->padding[1] == 0 || this->__size_pull == this->padding[1] * 8) {
		this->cache[1] = this->__pull();
		this->padding[1] = 0; // reset padding
	}
	this->padding[1]++; // increment
	return (uint8_t)(this->cache[1] >>
	                 (this->__size_pull - this->padding[1] * 8));
}

template <class algorithm>
void machine<algorithm>::message(std::vector<uint8_t> &blocks) {
	if (blocks.size() == 0)
		return; // empty vector, nothing to do
	// try to predict left padding (cache module)
	size_t left_padding = this->__size_push / 8 - this->padding[0];
	// if input cache is not full
	if (this->padding[0] > 0) {
		for (size_t i = this->padding[0]; i < this->__size_push / 8; i++) {
			this->cache[0] ^= blocks[i - this->padding[0]]
			                  << (this->__size_push - (i + 1) * 8);
		} // send cached bytes
		this->__push(this->cache[0]);
	} else { // if there is no need to pad
		left_padding = 0;
	}
	// calculate marginal/right padded blocks
	size_t right_padding =
	    (((blocks.size() - left_padding) * 8) % this->__size_push) / 8;
	// choose correct datatype used by __push()
	switch (this->__size_push) {
	case 8:
		for (size_t i = left_padding; // pass via algorithm's engine
		     i < blocks.size() - left_padding - right_padding; i += 1)
			this->__push((uint8_t)(blocks[i]));
		break;
	case 16:
		for (size_t i = left_padding; // pass via algorithm's engine
		     i < blocks.size() - left_padding - right_padding; i += 2)
			this->__push(((uint16_t)blocks[i + 1]) | ((uint16_t)blocks[i] << 8));
		break;
	case 32:
		for (size_t i = left_padding; // pass via algorithm's engine
		     i < blocks.size() - left_padding - right_padding; i += 4)
			this->__push(((uint32_t)blocks[i + 3]) | ((uint32_t)blocks[i + 2] << 8) |
			             ((uint32_t)blocks[i + 1] << 16) |
			             ((uint32_t)blocks[i] << 24));
		break;
	case 64:
		for (size_t i = left_padding; // pass via algorithm's engine
		     i < blocks.size() - left_padding - right_padding; i += 8)
			this->__push(
			    ((uint64_t)blocks[i + 7]) | ((uint64_t)blocks[i + 6] << 8) |
			    ((uint64_t)blocks[i + 5] << 16) | ((uint64_t)blocks[i + 4] << 24) |
			    ((uint64_t)blocks[i + 3] << 32) | ((uint64_t)blocks[i + 2] << 40) |
			    ((uint64_t)blocks[i + 1] << 48) | ((uint64_t)blocks[i] << 56));
		break;
	}
	// reset local cache environment
	this->padding[0] = this->cache[0] = this->padding[1] = 0;
	// blocks that couldn't be used by algorithm __push() function
	for (size_t i = 0; i < right_padding; i++)
		this->push(blocks[blocks.size() + i - right_padding]);
}

template <class algorithm>
std::vector<uint8_t> machine<algorithm>::digest(size_t length) {
	// pass via interface
	std::vector<uint8_t> blocks(length);
	for (size_t i = 0; i < length; i++)
		blocks[i] = this->pull();
	return blocks;
}

template <class algorithm> void machine<algorithm>::reset(void) {
	// remove cache and padding
	this->cache[0] = this->cache[1] = this->padding[0] = this->padding[1] = 0;
	// replace memory with our key
	this->__set_key(this->key);
	// call reset function in algorithm
	this->__reset();
}

} //::chaos ////////////////////////////////////////////////////////////////////

#endif // CHAOS_HH
{% endhighlight %}

> Currently I am working on library [libchaos](https://github.com/maciejczyzewski/libchaos) that will hold all stuff connected with chaos machines... if you want, join! <u>This article is not finished... update in next friday... be patient!</u>
<span>-- Maciej A. Czyzewski</span>
