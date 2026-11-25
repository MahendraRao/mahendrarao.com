---
title: "Bash Loops and Functions: Stop Repeating Yourself"
description: "Do the same job 100 times with a loop, and name a job once with a function. Restaurant examples plus tested Bash, including how to read a file line by line."
topic: "Bash"
order: 2
level: "Beginner"
minutes: 35
date: 2026-11-25
free: true
---

In the [first article](/learn/bash-script-from-zero/) you wrote scripts that run top to bottom, once. Real work repeats: ten servers, a hundred files, a thousand log lines. By the end of this page you will make Bash repeat things for you (**loops**), name a job once and reuse it (**functions**), and read a file line by line.

> Every script below was run by me on Bash 5.2 before I wrote this. The outputs you see are real, not made up. Each idea has the same parts as before: 🎯 Situation, 🍽️ Restaurant, 💻 Technical, 🧪 Try it.

## 1. The for loop: do it for each item

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You have three dishes to cook, or 200 files to rename. Writing the same line 200 times is slow and one typo ruins it.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Orders hang on the rail above the stove. The chef does the same routine for **each** slip: take it, cook it, serve it. When the rail is empty, he stops. A `for` loop is that routine.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
for dish in soup pasta tea; do
  echo "Cooking $dish"
done
```

```text
Cooking soup
Cooking pasta
Cooking tea
```

Read it as: "for each `dish` in this list, do what is between `do` and `done`". Each time round, `$dish` holds the next item.

Three handy ways to make the list:

```bash
for i in {1..3}; do
  echo "Table $i is ready"
done
```

```text
Table 1 is ready
Table 2 is ready
Table 3 is ready
```

```bash
for ((i = 10; i <= 30; i += 10)); do
  echo "Batch of $i"
done
```

```text
Batch of 10
Batch of 20
Batch of 30
```

And the one you will use most: **every file that matches a pattern**.

```bash
for file in menu/*.txt; do
  echo "Found: $file"
done
```

```text
Found: menu/desserts.txt
Found: menu/mains.txt
Found: menu/starters.txt
```

(This assumes a folder `menu` with those three files. The order follows your system's sorting, so it may differ slightly.)

| Form | Use it when |
|---|---|
| `for x in a b c` | you have a short list |
| `for i in {1..10}` | you want to count |
| `for ((i=0; i<n; i++))` | you want full control of the counter |
| `for f in *.txt` | you want every file that matches |

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Make a folder with three files: `mkdir menu && touch menu/starters.txt menu/mains.txt menu/desserts.txt`. Run the file loop. You should see three `Found:` lines. Now add a fourth file and run it again. You change nothing in the script, and the loop notices the new file by itself. That is the point of loops.

</div>

## 2. The while loop: keep going until a condition changes

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You do not know in advance how many times to repeat: wait until a service is up, or process lines until the file ends.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

*"Keep stirring while the sauce is still thin."* The chef does not count stirs. He checks the sauce each time, and stops when it is thick. A `while` loop checks a condition before every round.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
count=1
while [ "$count" -le 3 ]; do
  echo "Round $count"
  count=$((count + 1))
done
echo "Done after $((count - 1)) rounds"
```

```text
Round 1
Round 2
Round 3
Done after 3 rounds
```

The condition inside `[ ]` is the same kind you used with `if`. The line `count=$((count + 1))` changes the number, so the condition eventually becomes false.

> **If you forget to change `count`, the loop never ends.** Press `Ctrl+C` to stop it. In the kitchen, that is a chef stirring a sauce that is never allowed to thicken.

</div>

### break and continue

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

`continue` = "skip this slip, take the next one" (the guest cancelled). `break` = "stop the whole rail now" (the kitchen is closing).

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
for n in 1 2 3 4 5; do
  if [ "$n" -eq 2 ]; then continue; fi
  if [ "$n" -eq 4 ]; then break; fi
  echo "n is $n"
done
```

```text
n is 1
n is 3
```

`2` was skipped, and the loop stopped at `4`, so `5` never ran.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Before you run the `break`/`continue` script, guess the output. Then change `break` to `continue` for `4`. What prints now? (`n is 1`, `n is 3`, `n is 5`.)

</div>

## 3. Reading a file line by line

<div class="story situation">

<p class="story-label">🎯 Situation</p>

A list of servers, customers or orders sits in a text file. You want to handle each line.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The waiter hands the chef a pad of order slips. The chef reads **one slip at a time**, cooks it, then reads the next, until the pad is finished.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Create `orders.txt` with one dish per line:

```text
tea
samosa
pasta
```

```bash
#!/usr/bin/env bash
n=0
while IFS= read -r order; do
  n=$((n + 1))
  echo "Order $n: $order"
done < orders.txt
echo "Total orders: $n"
```

```text
Order 1: tea
Order 2: samosa
Order 3: pasta
Total orders: 3
```

Two things to notice:
- `< orders.txt` at the end feeds the file into the loop. `read` takes one line each round, and the loop stops when the file runs out.
- `IFS= read -r` is a safe habit. `-r` keeps backslashes as they are, and `IFS=` keeps spaces at the start of a line.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Create `orders.txt` yourself, run the script, and check that the last line says `Total orders: 3`. Add a fourth dish to the file and run again, and the count changes to 4 with no edit to the script.

</div>

## 4. Break it on purpose

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

**Mistake 1: forget `done`.**

```bash
#!/usr/bin/env bash
for dish in soup pasta tea; do
  echo "Cooking $dish"
```

You should see (the wording is from Bash 5.2, yours may differ slightly):

```text
broken3.sh: line 4: syntax error: unexpected end of file
```

Bash reached the end of the file still waiting for `done`. Same lesson as the missing `then`: when the error is at the end, the real mistake is where the block started. **Fix:** add `done`.

**Mistake 2: loop over `$(ls)` when names have spaces.** Imagine a file called `main course.txt` in `menu`:

```bash
#!/usr/bin/env bash
for f in $(ls menu); do
  echo "Item: $f"
done
```

```text
Item: desserts.txt
Item: main
Item: course.txt
Item: mains.txt
Item: starters.txt
```

`main course.txt` was split into two items. The kitchen version: the slip says "main course" and the chef thinks it is two orders, "main" and "course". **Fix:** let Bash match the files itself, and quote the variable:

```bash
for f in menu/*; do
  echo "Item: $f"
done
```

```text
Item: menu/desserts.txt
Item: menu/main course.txt
Item: menu/mains.txt
Item: menu/starters.txt
```

</div>

## 5. Functions: name a job once, use it many times

<div class="story situation">

<p class="story-label">🎯 Situation</p>

The same five lines appear in four places in your script. When you fix a bug, you must fix it four times, and you will miss one.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A recipe card for **"make masala tea"** lives in the kitchen. Any other recipe just says "make masala tea" and the chef follows that card. Fix the card once, and every recipe using it is fixed.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
greet() {
  echo "Welcome to $1!"
}
greet "Spice Hub"
greet "Pasta Corner"
```

```text
Welcome to Spice Hub!
Welcome to Pasta Corner!
```

`greet() { ... }` defines the function. Writing `greet "Spice Hub"` runs it. Inside the function, `$1` is the first thing you passed in, just like script arguments in the first article.

</div>

### Break it on purpose

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Call the function **before** you define it:

```bash
#!/usr/bin/env bash
greet "Spice Hub"
greet() {
  echo "Welcome to $1!"
}
```

```text
fn4.sh: line 2: greet: command not found
```

Bash reads top to bottom, so at line 2 it has never heard of `greet`. In the kitchen: a recipe says "make masala tea", but the card has not been pinned up yet. **Fix:** define functions first, call them after.

Another one. Pass a name with a space and forget the quotes:

```bash
name="Spice Hub"
touch_file() { echo "got: [$1]"; }
touch_file $name
touch_file "$name"
```

```text
got: [Spice]
got: [Spice Hub]
```

Without quotes, Bash splits it into two words and the function only sees the first one as `$1`. Quote your variables.

</div>

### Giving something back from a function

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A function can come back with two kinds of answer. Either it **hands you the dish** (a value, like "12"), or it just says **"yes, we are open"** or **"no, closed"** (a success or failure).

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

**Kind 1: a value.** Print it with `echo`, and capture it with `$(...)`:

```bash
#!/usr/bin/env bash
add() {
  echo $(( $1 + $2 ))
}
total=$(add 5 7)
echo "Total: $total"
```

```text
Total: 12
```

**Kind 2: yes or no.** The function's last command decides success (`0`) or failure (anything else), and `if` can use that directly:

```bash
#!/usr/bin/env bash
is_open() {
  [ "$1" -ge 9 ] && [ "$1" -lt 22 ]
}
if is_open 14; then echo "14:00 open"; else echo "14:00 closed"; fi
if is_open 23; then echo "23:00 open"; else echo "23:00 closed"; fi
is_open 23
echo "status code: $?"
```

```text
14:00 open
23:00 closed
status code: 1
```

`$?` holds the status of the last command: `0` means yes, `1` means no.

</div>

### local: keep a function's variables to itself

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Every chef has his own **station**, and there is a shared **pantry**. If a chef uses an item from his own station, the pantry is untouched. If he reaches into the pantry and changes it, every other chef sees the change. `local` means "use my own station".

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

With `local`, the outside variable is safe:

```bash
#!/usr/bin/env bash
table=10
seat_guest() {
  local table=1
  table=$((table + 1))
  echo "inside : table=$table"
}
seat_guest
echo "outside: table=$table"
```

```text
inside : table=2
outside: table=10
```

Without `local`, the function silently changes the outside variable:

```bash
#!/usr/bin/env bash
table=10
seat_guest() {
  table=$((table + 1))
  echo "inside : table=$table"
}
seat_guest
echo "outside: table=$table"
```

```text
inside : table=11
outside: table=11
```

Rule of thumb: **use `local` for every variable you create inside a function.**

</div>

## 6. Put it together: a restaurant bill

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You have a file of orders with quantities, and you want a priced bill with a total.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The cashier reads each slip, looks the dish up on the **menu board**, multiplies by how many were ordered, and keeps a running total on the till. At the end she prints the bill.

</div>

<figure>
<img src="/img/learn/bash-bill-flow.svg" alt="Five steps from top to bottom. The file bill.txt holds three order slips. A while read loop takes one slip at a time. The price function looks up the price like a menu board. The total is added up like a till. The final bill, Total 185, is printed. Steps two to four repeat for every slip." width="520" height="560" loading="lazy" />
<figcaption>The same idea in code: a loop, a function and a running total.</figcaption>
</figure>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Create `bill.txt` (dish and quantity on each line):

```text
tea 2
samosa 3
pasta 1
```

New idea: **`case`** is a menu board. It checks one value against several choices, like a tidy `if`/`elif` chain. `*)` is "anything else", and `;;` ends each choice.

```bash
#!/usr/bin/env bash
price() {
  case "$1" in
    tea)    echo 10 ;;
    samosa) echo 15 ;;
    pasta)  echo 120 ;;
    *)      echo 0 ;;
  esac
}
total=0
while read -r item qty; do
  cost=$(( $(price "$item") * qty ))
  echo "$item x$qty = $cost"
  total=$((total + cost))
done < bill.txt
echo "Total: $total"
```

```text
tea x2 = 20
samosa x3 = 45
pasta x1 = 120
Total: 185
```

Notice how it reuses everything: a **loop** reads the file, a **function** knows the prices, and a **variable** keeps the total. `read -r item qty` splits each line into two variables at the space.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Run it, then add `coffee 4` to `bill.txt` **without** adding coffee to the function. What happens? (It prints `coffee x4 = 0`, because `*)` catches anything unknown.) Now add `coffee) echo 25 ;;` to the function and run again.

</div>

## 7. Your challenge

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Create `students.txt`:

```text
asha 82
ravi 55
meena 30
```

Write `grades.sh` that reads the file line by line. It should use a **function** `grade` that takes marks and gives back `Distinction` (75 or more), `Pass` (40 or more) or `Try again`, using the `if/elif/else` from the first article. Print each student's result, and at the end print how many students passed.

When it works you should see exactly this:

```text
asha: Distinction
ravi: Pass
meena: Try again
Passed: 2
```

Hints: capture the function's answer with `result=$(grade "$marks")`, and count passes with `passed=$((passed + 1))`.

Stuck? Email me what you tried. The email is at the bottom of this page.

</div>

## Recap

- `for x in list; do ... done`: repeat for each item (the order rail)
- `for f in *.txt`: every matching file. Do not parse `ls`, and quote your variables
- `while [ condition ]; do ... done`: repeat until the condition changes (stir until thick)
- `continue` skips one round, `break` leaves the loop
- `while IFS= read -r line; do ... done < file`: read a file line by line
- `name() { ... }`: define a function first, call it after. `$1` is its first argument
- Give back a value with `echo` and `$(...)`, or a yes/no with the status (`$?`)
- `local` keeps a function's variables from leaking out
- `case "$x" in a) ... ;; *) ... ;; esac`: a menu board for many choices

**Next up:** working with text (grep, cut, sort), and checking whether things worked.
