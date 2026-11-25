---
title: "Bash Pipes, Text Tools and Logic: Make Commands Work as a Team"
description: "Connect small commands with pipes, search and count text with grep, cut, sort and awk, control where output goes, and make scripts decide with exit codes and logic. Restaurant examples plus tested Bash."
topic: "Bash"
order: 3
level: "Beginner"
minutes: 50
date: 2026-11-25
free: true
---

In the [first article](/learn/bash-script-from-zero/) you wrote scripts. In the [second](/learn/bash-loops-and-functions/) you made them repeat work. Real scripts also **handle text**: read a log, count things, pick a column, and then decide what to do based on whether a step worked. By the end of this page you will connect commands with **pipes**, search and total up text, control **where output goes**, and use **exit codes and logic** (`&&`, `||`, `!`) so a script can decide for itself.

<div class="lab-cta">
<p class="lab-cta-title">🖥️ No terminal? Practise in a real Linux machine in your browser.</p>
<p><a class="btn" href="https://killercoda.com/playgrounds/scenario/ubuntu" target="_blank" rel="noopener">▶ Open the playground</a></p>
<p class="lab-cta-note"><strong>Note:</strong> you need a <strong>free</strong> Killercoda account (sign in with Google, GitHub or email). Nothing to install. A free session lasts about 60 minutes; paid accounts get up to 4 hours. Prefer your own computer? Open Terminal on a Mac or Linux, or use WSL on Windows. Everything on this page works there too.</p>
</div>

> Every command below was run by me on Bash 5.2 before I wrote this. The outputs you see are real, not made up. Each idea has the same parts as before: 🎯 Situation, 🍽️ Restaurant, 💻 Technical, 🧪 Try it.

## Before you start: two practice files

Run this once. It creates two small files we will use all through the page: `kitchen.log` (the kitchen's diary) and `orders.csv` (today's orders, one per line, columns separated by commas). Do not worry about the `<<'EOF'` parts yet. Section 5 explains them.

```bash
cat > kitchen.log <<'EOF'
2026-11-25 12:01:10 INFO  order 101 received (pasta)
2026-11-25 12:01:45 INFO  order 102 received (soup)
2026-11-25 12:03:02 WARN  stove 2 running hot
2026-11-25 12:04:30 ERROR order 101 burnt
2026-11-25 12:05:12 INFO  order 103 received (tea)
2026-11-25 12:06:40 ERROR order 102 out of salt
2026-11-25 12:07:15 INFO  order 104 received (pasta)
2026-11-25 12:07:50 WARN  oven needs cleaning
2026-11-25 12:08:20 WARN  fridge door open
EOF

cat > orders.csv <<'EOF'
table,dish,qty,price
4,pasta,2,250
2,soup,1,120
4,tea,3,40
7,pasta,1,250
2,tea,1,40
4,pasta,2,250
EOF

ls kitchen.log orders.csv
```

```text
kitchen.log
orders.csv
```

## 1. Pipes: small tools, snapped together

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Your kitchen diary has thousands of lines and you want one answer: *how many errors happened today?* No single command does exactly that. But one command can find the error lines, and another can count lines.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A dish never goes straight from the stove to the guest. It passes through **stations**: the grill cooks it, the garnish station decorates it, the pass checks it. Each station does one small job and slides the plate through a hatch to the next. A **pipe** (`|`) is that hatch.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
grep ERROR kitchen.log | wc -l
```

```text
2
```

Read it left to right. `grep ERROR kitchen.log` finds the lines that contain `ERROR`. The `|` hands those lines to `wc -l`, which counts lines. Only the final answer reaches your screen.

This is the big idea of Linux: **many small tools, each good at one job, snapped together with pipes.** You will keep adding stations to the line.

</div>

<figure>
<img src="/img/learn/bash-pipe-flow.svg" alt="Four steps from top to bottom. The file kitchen.log is the kitchen diary. The command grep ERROR keeps only the problem lines. A pipe passes them to wc -l, which counts what is left. The answer, 2, reaches your screen." width="520" height="460" loading="lazy" />
<figcaption>A pipe passes the output of one command to the next, like a hatch between stations.</figcaption>
</figure>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Count the lines that say `INFO`, then the lines that say `WARN`:

```bash
grep INFO kitchen.log | wc -l
grep WARN kitchen.log | wc -l
```

```text
4
3
```

You should see `4` and then `3`. Same two stations, only the order slip (the word to search for) changed.

</div>

## 2. grep: find the lines you care about

<div class="story situation">

<p class="story-label">🎯 Situation</p>

A file has hundreds of lines and you only care about the ones that mention one word: an error, a user name, an order number.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The manager says: *"Show me every slip that says **no onions**."* You flick through the whole rail and pull out only the matching slips. The rest stay where they are. `grep` is that flicking.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

The basic form is `grep PATTERN FILE`. It prints every line that contains the pattern.

```bash
grep ERROR kitchen.log
```

```text
2026-11-25 12:04:30 ERROR order 101 burnt
2026-11-25 12:06:40 ERROR order 102 out of salt
```

Add a flag to change what it does:

```bash
grep -n WARN kitchen.log
```

```text
3:2026-11-25 12:03:02 WARN  stove 2 running hot
8:2026-11-25 12:07:50 WARN  oven needs cleaning
9:2026-11-25 12:08:20 WARN  fridge door open
```

`-n` shows the line number in front of each match.

```bash
grep -c ERROR kitchen.log
```

```text
2
```

`-c` prints only **how many lines** matched (lines, not words).

```bash
grep -v INFO kitchen.log
```

```text
2026-11-25 12:03:02 WARN  stove 2 running hot
2026-11-25 12:04:30 ERROR order 101 burnt
2026-11-25 12:06:40 ERROR order 102 out of salt
2026-11-25 12:07:50 WARN  oven needs cleaning
2026-11-25 12:08:20 WARN  fridge door open
```

`-v` flips it: show the lines that do **not** match.

```bash
grep -i warn kitchen.log
```

```text
2026-11-25 12:03:02 WARN  stove 2 running hot
2026-11-25 12:07:50 WARN  oven needs cleaning
2026-11-25 12:08:20 WARN  fridge door open
```

`-i` ignores upper and lower case. Our file says `WARN`, but `warn` still matched.

```bash
grep -E "ERROR|WARN" kitchen.log
```

```text
2026-11-25 12:03:02 WARN  stove 2 running hot
2026-11-25 12:04:30 ERROR order 101 burnt
2026-11-25 12:06:40 ERROR order 102 out of salt
2026-11-25 12:07:50 WARN  oven needs cleaning
2026-11-25 12:08:20 WARN  fridge door open
```

`-E` lets you use `|` to mean "this **or** that". Put the pattern in quotes, otherwise the shell thinks `|` is a pipe.

| Flag | What it does |
|---|---|
| `-n` | show line numbers |
| `-c` | count matching lines |
| `-v` | show lines that do **not** match |
| `-i` | ignore upper/lower case |
| `-E` | allow `a\|b` ("a or b") and other patterns |

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Find everything about order 101. Notice the quotes, because the pattern has a space:

```bash
grep "order 101" kitchen.log
```

```text
2026-11-25 12:01:10 INFO  order 101 received (pasta)
2026-11-25 12:04:30 ERROR order 101 burnt
```

You should see two lines: when it was received and when it burnt. Now try `grep -c "order" kitchen.log` and guess the number before you run it.

</div>

## 3. cut, sort, uniq: shape and count

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You have a sheet with columns and you want a ranking: *which dish sold the most today?*

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

At closing time you tally the day's slips. First you take only the **dish name** off each slip (ignore table number and price). Then you stack slips of the same dish into piles. Then you count each pile. Last, you put the biggest pile first. Four jobs, four stations.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Step by step, adding one station at a time. First, take only column 2 (the dish). `cut -d, -f2` means "split on commas (`-d,`), give me field 2 (`-f2`)":

```bash
cut -d, -f2 orders.csv
```

```text
dish
pasta
soup
tea
pasta
tea
pasta
```

The first line is the header, `dish`. Skip it with `tail -n +2` ("start from line 2"), then `sort` so equal dishes sit next to each other:

```bash
cut -d, -f2 orders.csv | tail -n +2 | sort
```

```text
pasta
pasta
pasta
soup
tea
tea
```

Now `uniq -c` collapses neighbours that are the same and puts a count in front. A last `sort -rn` puts the biggest number first (`-n` compares as numbers, `-r` reverses):

```bash
cut -d, -f2 orders.csv | tail -n +2 | sort | uniq -c | sort -rn
```

```text
      3 pasta
      2 tea
      1 soup
```

Pasta was ordered 3 times, tea 2, soup once. This one line, `sort | uniq -c | sort -rn`, is worth memorising. You will use it for logs, IPs, error messages, everything.

A few more small tools you will meet all the time:

| Tool | Its one job | Example |
|---|---|---|
| `head -n 3` | first 3 lines | `head -n 3 kitchen.log` |
| `tail -n 3` | last 3 lines | `tail -n 3 kitchen.log` |
| `wc -l` | count lines | `wc -l < kitchen.log` |
| `tr a-z A-Z` | swap characters | `echo hi \| tr a-z A-Z` gives `HI` |

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Which **table** ordered most often? Table number is column 1. Change one number in the pipeline:

```bash
cut -d, -f1 orders.csv | tail -n +2 | sort | uniq -c | sort -rn
```

```text
      3 4
      2 2
      1 7
```

Table 4 should be on top with 3 orders. Now a different cut: print **only the time** of each `ERROR` line in `kitchen.log`, nothing else. Hint: `cut -c12-19` keeps characters 12 to 19 of every line (the `HH:MM:SS`). You should get `12:04:30` and `12:06:40`.

</div>

## 4. sed and awk: just enough

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Sometimes you need to **change** text as it passes by, or do **maths** on a column. `cut` and `grep` cannot do that.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

`sed` is the waiter with an **eraser**: as each slip goes by, he crosses out *"chips"* and writes *"fries"*. `awk` is the **cashier with a calculator**: she reads each slip column by column, multiplies quantity by price, and keeps a running total.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

**sed** replaces text with `s/old/new/`:

```bash
grep ERROR kitchen.log | sed 's/ERROR/PROBLEM/'
```

```text
2026-11-25 12:04:30 PROBLEM order 101 burnt
2026-11-25 12:06:40 PROBLEM order 102 out of salt
```

And `sed -n '3p'` prints only line 3:

```bash
sed -n '3p' kitchen.log
```

```text
2026-11-25 12:03:02 WARN  stove 2 running hot
```

**awk** works on columns. `-F,` says the columns are separated by commas, and `$2` means column 2. `NR>1` means "from line 2 onwards", which skips the header (`NR` is the line number):

```bash
awk -F, 'NR>1 {print $2, $3}' orders.csv
```

```text
pasta 2
soup 1
tea 3
pasta 1
tea 1
pasta 2
```

Now the cashier's total. For each line, add `quantity × price` to `sum`. `END` runs once after the last line:

```bash
awk -F, 'NR>1 {sum += $3 * $4} END {print "Revenue:", sum}' orders.csv
```

```text
Revenue: 1530
```

And a tally per dish. `sold[$2]` is like a small board with one row per dish name:

```bash
awk -F, 'NR>1 {sold[$2] += $3} END {for (d in sold) print d, sold[d]}' orders.csv | sort
```

```text
pasta 5
soup 1
tea 4
```

The `for (d in sold)` loop gives the rows in no guaranteed order, so we pipe into `sort`.

> **Mac note.** macOS ships the BSD versions of `sed`, `grep` and friends. Everything on this page works there too, with one exception we avoid: `sed -i` (edit a file in place) needs `sed -i ''` on a Mac. Some outputs, like `wc -l`, may also have extra spaces in front.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Print the average price of a line item (add up column 4, divide by the number of lines). Hint: `NR` inside `END` is the total number of lines, header included, so use `NR-1`.

</div>

## 5. Redirects: where does the output go?

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Output flies past on the screen. You want to **save** it to a file, **silence** noisy errors, or keep normal output and error messages **apart**.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Every command has **two exits**. Finished dishes go out to the **guest's table** (this is called *standard output*). Complaints like *"we are out of salt!"* go to the **manager's box** (*standard error*). By default both end up on your screen, so you cannot tell them apart. Redirects send each exit somewhere else:

- `>` writes into the **order book**, erasing the old page first.
- `>>` **adds** to the end of the order book.
- `2>` puts the complaints in a **separate box**.
- `/dev/null` is the **bin**. Anything sent there disappears.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

A tiny script that uses both exits. `>&2` means "send this line to the complaints exit":

```bash
#!/usr/bin/env bash
echo "plate ready"
echo "out of salt!" >&2
```

Save it as `plates.sh`, run `chmod +x plates.sh`, then:

```bash
./plates.sh
```

```text
plate ready
out of salt!
```

Both lines appear and you cannot tell which is which. Now send the **normal** output to a file:

```bash
./plates.sh > out.txt
cat out.txt
```

```text
out of salt!
plate ready
```

Only the complaint reached the screen. The plate went into `out.txt`. Now the other way round, complaints into a file:

```bash
./plates.sh 2> errors.txt
cat errors.txt
```

```text
plate ready
out of salt!
```

Everything into one file, with `2>&1` ("send the complaints wherever the plates go"):

```bash
./plates.sh > all.txt 2>&1
cat all.txt
```

```text
plate ready
out of salt!
```

Throw the complaints in the bin:

```bash
./plates.sh 2> /dev/null
```

```text
plate ready
```

`>` erases, `>>` adds:

```bash
echo "one" > notes.txt
echo "two" >> notes.txt
cat notes.txt
```

```text
one
two
```

`<` goes the other way: it feeds a file **into** a command. And the `<<'EOF'` trick you used in the setup is a **here-document**: you "dictate" lines to a command, and it stops listening at the line that says `EOF`:

```bash
cat > menu.txt <<'EOF'
pasta 250
soup 120
EOF

wc -l < menu.txt
```

```text
2
```

| Write this | It means |
|---|---|
| `cmd > file` | normal output into file (erase old content) |
| `cmd >> file` | normal output added to the end of file |
| `cmd < file` | feed the file into the command |
| `cmd 2> file` | error messages into file |
| `cmd > file 2>&1` | both into the same file |
| `cmd 2> /dev/null` | hide error messages |

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Save only the error lines of the diary into a new file, and count them:

```bash
grep ERROR kitchen.log > problems.txt
wc -l < problems.txt
```

```text
2
```

You should see `2`. Open `problems.txt` with `cat` and check it holds exactly the two `ERROR` lines.

</div>

## 6. Break it on purpose

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

**Mistake 1: count without sorting first.** Remove the `sort` before `uniq -c`:

```bash
cut -d, -f2 orders.csv | tail -n +2 | uniq -c
```

```text
      1 pasta
      1 soup
      1 tea
      1 pasta
      1 tea
      1 pasta
```

Every dish shows `1`, and pasta appears three times. `uniq` only merges **neighbours**. In the kitchen: you count "pasta" once, then see "soup", then count "pasta" again as if it were new, because you never piled the slips first. **Fix:** always `sort` before `uniq -c`.

**Mistake 2: sort a file into itself.** Make a small file, then sort it and write the result back into the same file:

```bash
printf 'b\na\n' > list.txt
sort list.txt > list.txt
wc -l < list.txt
```

```text
0
```

The file is now **empty**. The shell empties `list.txt` for the `>` *before* `sort` gets a chance to read it. In the kitchen: you tear out the order book page to write the sorted list on it, and only then try to read the old list from it. **Fix:** write to a different file, then rename.

```bash
printf 'b\na\n' > list.txt
sort list.txt > list.sorted && mv list.sorted list.txt
cat list.txt
```

```text
a
b
```

**Mistake 3: forget the quotes around a pattern with spaces.**

```bash
grep out of salt kitchen.log
```

```text
grep: of: No such file or directory
grep: salt: No such file or directory
kitchen.log:2026-11-25 12:06:40 ERROR order 102 out of salt
```

`grep` took `out` as the pattern and `of` and `salt` as **file names**. (The exact wording of the error may differ a little on your system.) **Fix:** `grep "out of salt" kitchen.log`.

</div>

## 7. Exit codes: every command says "worked" or "didn't"

<div class="story situation">

<p class="story-label">🎯 Situation</p>

A script must know whether the previous step **worked**, without reading any text. Did the backup succeed? Is that word in the file? Only then can it decide what to do next.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

After every dish, the chef calls out a **number**. **0** means *"Done, perfect."* Any other number means a problem, and different numbers can mean different problems: 1 for *"burnt"*, 2 for *"no ingredients"*. The waiter does not taste the dish. He just listens for the number.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Every command ends with a number called its **exit code**. Bash keeps the last one in `$?`. Try `grep` on a word that is there, a word that is not, and a file that does not exist:

```bash
grep -q ERROR kitchen.log
echo "found it: $?"
grep -q FIRE kitchen.log
echo "not there: $?"
grep -q ERROR missing.log
echo "broken call: $?"
```

```text
found it: 0
not there: 1
grep: missing.log: No such file or directory
broken call: 2
```

(`-q` means quiet: print nothing, just set the exit code.) Notice: for `grep`, **0 = found, 1 = not found, 2 = something went wrong**.

> **Careful, it feels backwards.** In Bash, **0 means success (true)** and anything else means failure (false). In most other languages it is the other way round.

Because `if` simply asks "did that command succeed?", you can put a command straight after it:

```bash
for word in ERROR FIRE; do
  if grep -q "$word" kitchen.log; then
    echo "$word: found"
  else
    echo "$word: not found"
  fi
done
```

```text
ERROR: found
FIRE: not found
```

**Pipes hide failures.** The exit code of a pipeline is the exit code of its **last** station. Look at this:

```bash
grep FIRE kitchen.log | wc -l
echo "status: $?"
```

```text
0
status: 0
```

`grep` found nothing (that is a failure, code 1), but `wc` counted zero lines happily, so the whole line reports success. Turn on `pipefail` and the failure is no longer hidden:

```bash
set -o pipefail
grep FIRE kitchen.log | wc -l
echo "status: $?"
```

```text
0
status: 1
```

That is why the debugging line `set -euo pipefail` from the first article contains `pipefail`.

Your own scripts give back a code too: `exit 0` for success, `exit 1` (or any other number) for a problem.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write a loop that checks three words (`ERROR`, `WARN`, `FIRE`) against `kitchen.log` and prints `found` or `not found` for each. You have everything you need above. Then run `grep -q WARN kitchen.log && echo "kitchen needs attention"` and see what the `&&` does (the next section explains it).

</div>

## 8. Logic: and, or, not

<div class="story situation">

<p class="story-label">🎯 Situation</p>

One condition is rarely enough. *Run this only if the folder exists **and** is not empty. Warn if disk is full **or** memory is low. Continue only if the file is **not** already there.*

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The door sign says: *"Open **if** the chef is in **and** the gas is on."* Both must be true. The payment desk says: *"We take cash **or** card."* One is enough. The waiter says: *"If the guest is **not** vegetarian, offer the chicken."* The word **not** flips the answer.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

**Between commands.** `&&` means "and **then**, but only if that worked". `||` means "**otherwise**, if that failed":

```bash
mkdir -p tmpdir && echo "folder ready"
grep -q FIRE kitchen.log || echo "No fire today"
```

```text
folder ready
No fire today
```

**Inside conditions.** Use `[[ ... ]]` with `&&`, `||` and `!`:

```bash
qty=3
price=40
dish=tea

if [[ $qty -ge 3 && $price -lt 100 ]]; then
  echo "Bulk discount"
fi

if [[ $dish == tea || $dish == coffee ]]; then
  echo "Hot drink"
fi

if [[ ! -f missing.txt ]]; then
  echo "missing.txt does not exist"
fi
```

```text
Bulk discount
Hot drink
missing.txt does not exist
```

| A | B | `A && B` | `A \|\| B` |
|---|---|---|---|
| true | true | true | true |
| true | false | false | true |
| false | true | false | true |
| false | false | false | false |

`!` simply flips one value: `! true` is false, `! false` is true.

**Which brackets?** Bash has three, and each has its own job:

| Brackets | Use it for | Example |
|---|---|---|
| `[ ... ]` | the old, portable test (works in plain `sh` too) | `[ "$x" -gt 5 ]` |
| `[[ ... ]]` | **text and files** in Bash: safer, and allows `&&`, `\|\|`, patterns and regex | `[[ $dish == p* ]]` |
| `(( ... ))` | **numbers**: real maths and comparisons, no `$` needed | `(( qty * price >= 100 ))` |

Two things `[[ ]]` can do that `[ ]` cannot: match a **pattern**, and match a **regular expression** with `=~`. That makes it perfect for checking input. Here is a function that says whether something is a whole number:

```bash
is_number() { [[ $1 =~ ^[0-9]+$ ]]; }

for input in 42 abc 4x; do
  if is_number "$input"; then
    echo "$input: ok"
  else
    echo "$input: not a number"
  fi
done
```

```text
42: ok
abc: not a number
4x: not a number
```

A function hands back the exit code of its last command, so `is_number` works like any test. And `(( ))` for maths:

```bash
qty=3
price=40
if (( qty * price >= 100 )); then
  echo "Big bill: $((qty * price))"
fi
```

```text
Big bill: 120
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write `is_open.sh` with `hour=14`. Print `Open` if the hour is **between 9 and 21** (use `&&`), print `Closed` otherwise. Run it with `hour=8`, `hour=14`, `hour=23`. Then change the rule to *"closed between 15 and 17 for the afternoon break"*, which needs a `!` or an `||`.

</div>

## 9. Break it on purpose, part 2

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

**Mistake 1: `A && B || C` is not an if/else.** It looks like one:

```bash
true && false || echo "the else part ran, even though the first test passed"
```

```text
the else part ran, even though the first test passed
```

`true` succeeded, so `false` ran. But `false` failed, so the `||` part ran as well. The `||` listens to the **last** command, not the first. In the kitchen: the chef says "if the stove is on, cook the dish, otherwise light it", but the dish burns, so he lights the stove too. **Fix:** when you mean "if ... else", write `if ... then ... else ... fi`.

**Mistake 2: an empty variable inside `[ ]`.**

```bash
name=""
[ $name = "asha" ] && echo "hello asha"
echo "exit code: $?"
```

```text
bash: line 2: [: =: unary operator expected
exit code: 2
```

With no quotes, the empty `$name` vanishes and Bash sees `[ = "asha" ]`, which makes no sense. (The wording of the error can differ between Bash versions.) **Fix:** quote it, `[ "$name" = "asha" ]`, or use `[[ $name == asha ]]`, which handles empty values safely.

**Mistake 3: `set -e` plus a `grep` that finds nothing.** With `set -e`, any command that fails ends the script. And "found nothing" is a failure for `grep`:

```bash
cat > nofire.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
fires=$(grep -c FIRE kitchen.log)
echo "Fires today: $fires"
EOF
chmod +x nofire.sh
./nofire.sh
echo "exit code: $?"
```

```text
exit code: 1
```

The script printed **nothing** and stopped. No error message at all. That is the most confusing way for a script to fail. **Fix:** tell Bash that "no match" is fine here with `|| true`:

```bash
cat > nofire.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
fires=$(grep -c FIRE kitchen.log || true)
echo "Fires today: $fires"
EOF
./nofire.sh
echo "exit code: $?"
```

```text
Fires today: 0
exit code: 0
```

</div>

## 10. Put it together: a kitchen report

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Every evening you want a quick health report of the kitchen diary: how many errors and warnings, which kind of line is most common, and a **failing exit code** if there were errors, so another tool can raise an alarm.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The manager asks the closing chef for a one-page summary. The chef first checks the diary is actually on the desk. If it is missing, he says so and stops. Otherwise he counts the problem notes, ranks the types of note, and if there were problems he hands over the list and says *"not a smooth day"* (exit code 1).

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
set -euo pipefail

file="${1:-kitchen.log}"

if [[ ! -f "$file" ]]; then
  echo "Cannot find $file" >&2
  exit 1
fi

count_level() {
  grep -c "$1" "$file" || true
}

errors=$(count_level ERROR)
warnings=$(count_level WARN)

echo "File:     $file"
echo "Errors:   $errors"
echo "Warnings: $warnings"
echo "Lines by level:"
awk '{print $3}' "$file" | sort | uniq -c | sort -rn

if (( errors > 0 )); then
  echo "Problems found:"
  grep ERROR "$file"
  exit 1
fi

echo "All calm."
```

Save it as `report.sh`, run `chmod +x report.sh`, then run it:

```bash
./report.sh
echo "exit code: $?"
```

```text
File:     kitchen.log
Errors:   2
Warnings: 3
Lines by level:
      4 INFO
      3 WARN
      2 ERROR
Problems found:
2026-11-25 12:04:30 ERROR order 101 burnt
2026-11-25 12:06:40 ERROR order 102 out of salt
exit code: 1
```

Every piece comes from this page or the last two:

| Piece | What it does |
|---|---|
| `${1:-kitchen.log}` | use the first argument, or `kitchen.log` if none was given |
| `[[ ! -f "$file" ]]` | logic: is the file **not** there? |
| `>&2` and `exit 1` | complain on the error exit, then stop with a failure code |
| `grep -c ... \|\| true` | count lines, and do not die when the count is zero |
| `awk ... \| sort \| uniq -c \| sort -rn` | the ranking pipeline from section 3 |
| `(( errors > 0 ))` | number comparison |

Now a calm day, and a missing file:

```bash
grep INFO kitchen.log > quiet.log
./report.sh quiet.log
echo "exit code: $?"
./report.sh nope.log
echo "exit code: $?"
```

```text
File:     quiet.log
Errors:   0
Warnings: 0
Lines by level:
      4 INFO
All calm.
exit code: 0
Cannot find nope.log
exit code: 1
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Add a rule: if there are **3 or more warnings**, print `Too hot in here`, even when there are no errors. Our diary has exactly 3 warnings, so the new line should appear when you run `./report.sh`. Which section covers the `&&` or `||` you may need?

</div>

## 11. Your challenge

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Use `orders.csv`. Write `sales.sh` that takes the file name as its first argument (default `orders.csv`) and:

1. If the file does not exist, prints `Cannot find <name>` to the **error** exit and stops with `exit 1`.
2. Prints the **revenue** (quantity × price, added up).
3. Prints the **best seller** by quantity sold.
4. Prints `Great day!` only if revenue is **over 1000**.


When it works, `./sales.sh` should print exactly this:

```text
Revenue: 1530
Best seller: pasta (5 sold)
Great day!
```

and `./sales.sh nofile.csv; echo "exit code: $?"` should print:

```text
Cannot find nofile.csv
exit code: 1
```

Hints: the `awk` tally from section 4 gives you the per-dish totals. Put the quantity **first** (`print sold[d], d`), then `sort -rn | head -n 1` leaves the best seller on one line. Split that line into two variables with `read -r count dish <<< "$best"` (the `<<<` feeds a variable into `read`).

Stuck? Email me what you tried. The email is at the bottom of this page.

</div>

## Recap

- `cmd1 | cmd2`: the output of one command becomes the input of the next (the hatch between stations)
- `grep` finds lines (`-n` numbers, `-c` counts, `-v` inverts, `-i` ignores case, `-E` allows "or")
- `cut -d, -f2` picks a column, `sort | uniq -c | sort -rn` ranks things, `head`, `tail`, `wc -l`, `tr` are the small helpers
- `sed 's/old/new/'` replaces text, `awk -F, '{...}'` does columns and maths
- `>` replaces, `>>` adds, `<` feeds in, `2>` catches errors, `2>&1` joins both, `/dev/null` is the bin
- Never write a file back into the same file you are reading from
- Every command ends with an exit code: **0 is success**, anything else is failure (`grep`: 1 = no match, 2 = error)
- `if cmd; then`, `cmd1 && cmd2` (only if it worked), `cmd1 || cmd2` (only if it failed)
- `[[ ]]` for text and files with `&&`, `||`, `!`, patterns and `=~`; `(( ))` for numbers
- `A && B || C` is **not** an if/else; `set -e` stops the script when `grep` finds nothing; quote your variables
- `set -o pipefail` stops a pipeline from hiding a failure in the middle

**Next up:** Bash like a pro: script arguments and options (`$@`, `shift`, `getopts`), safe scripts (`trap`, temp files), arrays that work like dictionaries, `${var}` tricks, and running scripts on a schedule with `cron`.
