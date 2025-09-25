To fulfill the request, we'll create a JavaScript function that takes a number, determines if it's prime, and if not,
returns all its factors.

The function will return an object with an `isPrime` boolean property. If `isPrime` is `false`, it will also include a
`factors` array. We'll also handle edge cases like non-integer inputs, negative numbers, 0, and 1.

```javascript
/**
* Checks if a number is prime and, if not, returns all its factors.
*
* @param {number} num The integer to check.
* @returns {object} An object containing:
* - `isPrime`: {boolean} True if the number is prime, false otherwise.
* - `factors`: {number[]} (Optional) An array of all factors if the number is not prime.
* - `error`: {string} (Optional) An error message if the input is invalid.
*/
function checkPrimeAndFactors(num) {
// 1. Input Validation: Ensure the input is a positive integer.
if (typeof num !== 'number' || !Number.isInteger(num) || num < 1) { return { error: "Input must be a positive integer."
    }; } // 2. Handle Special Case: 1 is not prime. Its only factor is 1. if (num===1) { return { isPrime: false,
    factors: [1] }; } // 3. Handle Special Case: 2 is the only even prime number. if (num===2) { return { isPrime: true
    }; } // 4. Check for Non-Prime Even Numbers: Any even number greater than 2 is not prime. if (num % 2===0) { return
    { isPrime: false, factors: getAllFactors(num) }; } // 5. Check for Odd Divisors: Iterate from 3 up to the square
    root of 'num' , // incrementing by 2 (checking only odd numbers). for (let i=3; i * i <=num; i +=2) { if (num %
    i===0) { // If a divisor is found, the number is not prime. return { isPrime: false, factors: getAllFactors(num) };
    } } // 6. If no divisors were found, the number is prime. return { isPrime: true }; } /** * Helper function to find
    all factors of a given positive integer. * @param {number} n The positive integer for which to find factors. *
    @returns {number[]} An array of all factors, sorted in ascending order. */ function getAllFactors(n) { const
    factors=new Set(); // Use a Set to automatically handle duplicate factors (e.g., for perfect squares) // Iterate
    from 1 up to the square root of n. // If 'i' divides 'n' , then 'i' is a factor, and 'n/i' is also a factor. for
    (let i=1; i * i <=n; i++) { if (n % i===0) { factors.add(i); factors.add(n / i); } } // Convert the Set to an Array
    and sort numerically. return Array.from(factors).sort((a, b)=> a - b);
    }

    // --- Examples ---

    // Prime Numbers
    console.log("7:", checkPrimeAndFactors(7)); // Expected: { isPrime: true }
    console.log("13:", checkPrimeAndFactors(13)); // Expected: { isPrime: true }
    console.log("2:", checkPrimeAndFactors(2)); // Expected: { isPrime: true }
    console.log("17:", checkPrimeAndFactors(17)); // Expected: { isPrime: true }

    // Non-Prime Numbers
    console.log("1:", checkPrimeAndFactors(1)); // Expected: { isPrime: false, factors: [1] }
    console.log("4:", checkPrimeAndFactors(4)); // Expected: { isPrime: false, factors: [1, 2, 4] }
    console.log("12:", checkPrimeAndFactors(12)); // Expected: { isPrime: false, factors: [1, 2, 3, 4, 6, 12] }
    console.log("9:", checkPrimeAndFactors(9)); // Expected: { isPrime: false, factors: [1, 3, 9] }
    console.log("100:", checkPrimeAndFactors(100)); // Expected: { isPrime: false, factors: [1, 2, 4, 5, 10, 20, 25, 50,
    100] }
    console.log("15:", checkPrimeAndFactors(15)); // Expected: { isPrime: false, factors: [1, 3, 5, 15] }

    // Invalid Inputs
    console.log("0:", checkPrimeAndFactors(0)); // Expected: { error: "Input must be a positive integer." }
    console.log("-5:", checkPrimeAndFactors(-5)); // Expected: { error: "Input must be a positive integer." }
    console.log("2.5:", checkPrimeAndFactors(2.5)); // Expected: { error: "Input must be a positive integer." }
    console.log("abc:", checkPrimeAndFactors("abc")); // Expected: { error: "Input must be a positive integer." }
    ```

    ### Explanation:

    1. **`checkPrimeAndFactors(num)` Function:**
    * **Input Validation:** It first checks if the input `num` is a number, an integer, and positive (`num < 1`). If
        not, it returns an error object. Primality is typically defined for positive integers greater than 1. *
        **Special Case for 1:** The number `1` is explicitly defined as not prime. Its only factor is `1`. * **Special
        Case for 2:** The number `2` is the smallest and only even prime number. * **Even Numbers> 2:** Any even number
        greater than `2` is not prime (it's divisible by `2`). In this case, it calls `getAllFactors()` to find all its
        factors.
        * **Odd Divisor Check:** For odd numbers, it iterates from `i = 3` up to the square root of `num`, incrementing
        `i` by `2` in each step (since we only need to check odd divisors).
        * If `num` is divisible by any `i` in this loop, it means `num` is not prime, and `getAllFactors()` is called.
        * **Prime Conclusion:** If the loop completes without finding any divisors, the number is prime, and `{ isPrime:
        true }` is returned.

        2. **`getAllFactors(n)` Helper Function:**
        * This function efficiently finds all positive factors of a given number `n`.
        * It iterates from `1` up to the square root of `n`.
        * If `i` is a factor of `n` (i.e., `n % i === 0`), then both `i` and `n / i` are factors.
        * A `Set` is used to automatically handle cases where `i * i === n` (perfect squares), ensuring each factor is
        added only once.
        * Finally, the factors are converted to an array and sorted in ascending order.