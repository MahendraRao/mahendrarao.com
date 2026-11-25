---
title: "Bash Like a Pro: Arguments, Options, Safe Scripts and Scheduling"
description: "Make scripts reusable with arguments and getopts, use ${var} tricks and associative arrays, fail loudly and clean up with trap, and schedule it all with cron. Restaurant examples plus tested Bash."
topic: "Bash"
order: 4
level: "Intermediate"
minutes: 55
date: 2026-11-25
free: true
---

In the [first three articles](/learn/bash-pipes-text-and-logic/) you learned to write scripts, repeat work, handle text and make decisions. Now the step from "a script that works for me" to **"a script other people can trust"**. By the end of this page your scripts will take **arguments and options**, use **lookup tables**, **clean up after themselves**, fail with a clear message, and run on a **schedule** without you.

<div class="lab-cta">
<p class="lab-cta-title">🖥️ No terminal? Try it in a real one, right in your browser.</p>
<p><a class="btn" href="https://killercoda.com/mahendrarao/scenario/bash-like-a-pro" target="_blank" rel="noopener">▶ Open the hands-on lab</a></p>
<p class="lab-cta-note"><strong>Note:</strong> you need a <strong>free</strong> Killercoda account (sign in with Google, GitHub or email). Nothing to install. A free session lasts about 60 minutes; paid accounts get up to 4 hours. Prefer your own computer? Open Terminal on a Mac or Linux, or use WSL on Windows. Everything on this page works there too (see the Mac note in section 5).</p>
</div>

> Every command below was run by me on Bash 5.2 before I wrote this. The outputs you see are real, not made up. Each idea has the same parts as before: 🎯 Situation, 🍽️ Restaurant, 💻 Technical, 🧪 Try it.

## Before you start: a small practice folder

Run this once. It makes a `menu` folder with four files.

```bash
mkdir -p menu
echo "soup" > menu/starters.txt
echo "pasta" > menu/mains.txt
echo "cake" > menu/desserts.txt
echo "dish,price" > menu/prices.csv
ls menu
```

```text
desserts.txt
mains.txt
prices.csv
starters.txt
```

## 1. Arguments: tell your script what to work on

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Your script has a file name written inside it: `file="kitchen.log"`. A colleague wants to use it on a different file, so they must open the script and edit it. That does not scale. Better: let people say what to work on **when they run it**.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The recipe card says: *"Cook ____ for table ____."* The blanks are filled in by the waiter on every order slip. Same card, different dish, different table, every time. **Arguments are those blanks.**

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Whatever you type after the script name is available inside the script:

```bash
#!/usr/bin/env bash
echo "Script name: $0"
echo "First: $1"
echo "Second: $2"
echo "Count: $#"
for a in "$@"; do
  echo "  arg: [$a]"
done
```

Save it as `args.sh`, run `chmod +x args.sh`, then run it with three arguments. The middle one has a space, so it is in quotes:

```bash
./args.sh pasta "extra cheese" tea
```

```text
Script name: ./args.sh
First: pasta
Second: extra cheese
Count: 3
  arg: [pasta]
  arg: [extra cheese]
  arg: [tea]
```

| Variable | Holds |
|---|---|
| `$0` | the script's own name |
| `$1`, `$2`, ... | the first, second, ... argument |
| `$#` | how many arguments there are |
| `"$@"` | **all** arguments, each kept as one separate item |

Forget the arguments and nothing breaks. The variables are simply **empty**:

```bash
./args.sh
```

```text
Script name: ./args.sh
First: 
Second: 
Count: 0
```

Always write `"$@"` **with quotes**. Look at the difference when one argument contains a space:

```bash
#!/usr/bin/env bash
echo "without quotes:"
for a in $*; do
  echo "  [$a]"
done
echo "with quotes:"
for a in "$@"; do
  echo "  [$a]"
done
```

```bash
./star.sh "extra cheese" tea
```

```text
without quotes:
  [extra]
  [cheese]
  [tea]
with quotes:
  [extra cheese]
  [tea]
```

Without quotes, `extra cheese` was cut into two items. In the kitchen: the slip says "extra cheese" and the chef thinks it is two orders.

One more tool: `shift` throws away `$1` and moves everything left. Handy for "process one argument, then the rest":

```bash
#!/usr/bin/env bash
while (( $# > 0 )); do
  echo "now: $1 (left: $#)"
  shift
done
```

```bash
./shift.sh a b c
```

```text
now: a (left: 3)
now: b (left: 2)
now: c (left: 1)
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write `hello.sh` that greets **every** argument: `./hello.sh Asha Ravi` should print `Hello, Asha!` and then `Hello, Ravi!`. You need a loop over `"$@"`.

</div>

## 2. Defaults, required values and a usage message

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Some arguments are optional (use a sensible default), others are required (stop with a clear message). Right now a forgotten argument gives you an empty value and a confusing failure later.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

If the guest does not say how spicy, the waiter writes **medium** (a default). If the guest does not say **which dish**, the waiter cannot write the slip at all. He goes back and asks. And he does not just say "error": he says *"Which dish, and for which table?"* (a usage message).

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Two small forms do the job. `${1:-guest}` means "use `$1`, or `guest` if it is missing". `${2:?message}` means "use `$2`, or **stop with this message** if it is missing":

```bash
#!/usr/bin/env bash
name="${1:-guest}"
echo "Hello, $name"
dish="${2:?please give a dish}"
echo "Dish: $dish"
```

```bash
./req.sh
echo "exit code: $?"
./req.sh Asha pasta
echo "exit code: $?"
```

```text
Hello, guest
./req.sh: line 4: 2: please give a dish
exit code: 1
Hello, Asha
Dish: pasta
exit code: 0
```

(The exact wording of the error line differs a little between Bash versions.) The same trick protects **environment variables**. A lone `:` is a command that does nothing, so this line only exists to run the check:

```bash
#!/usr/bin/env bash
: "${KITCHEN:?KITCHEN is not set}"
echo "Kitchen: $KITCHEN"
```

```bash
./kitchen.sh
echo "exit code: $?"
KITCHEN=north ./kitchen.sh
```

```text
./kitchen.sh: line 2: KITCHEN: KITCHEN is not set
exit code: 1
Kitchen: north
```

For friendlier messages, write a `usage` function and call it when the arguments are wrong. By convention a wrong-usage exit code is **2**:

```bash
#!/usr/bin/env bash
usage() {
  echo "Usage: $0 DISH TABLE" >&2
  exit 2
}

(( $# == 2 )) || usage
echo "Serving $1 to table $2"
```

```bash
./serve.sh pasta
echo "exit code: $?"
./serve.sh pasta 4
```

```text
Usage: ./serve.sh DISH TABLE
exit code: 2
Serving pasta to table 4
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write `discount.sh PRICE [PERCENT]`. The percent is optional and defaults to **10**. Print the price after the discount, using whole-number maths: `echo $(( price - price * percent / 100 ))`. Expected: `./discount.sh 250` prints `225`, and `./discount.sh 250 20` prints `200`. If no price is given, print a usage line and `exit 2`.

</div>

## 3. Options with getopts: `-v`, `-n name`

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Real tools take **options**: `-v` for verbose, `-n 5` for a number, in any order. Parsing them by hand with `shift` and `if` gets messy fast.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The slip has tick boxes and small fields: **☐ extra spicy** (just a tick), **☐ no onions** (just a tick) and **Table: ___** (needs a value). The waiter does not care in which order the guest says them. `getopts` is the waiter who reads the slip box by box.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
verbose=0
name="guest"

while getopts ":vn:" opt; do
  case $opt in
    v) verbose=1 ;;
    n) name=$OPTARG ;;
    :) echo "Option -$OPTARG needs a value" >&2; exit 2 ;;
    \?) echo "Unknown option -$OPTARG" >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))

echo "verbose=$verbose name=$name"
echo "left over: $*"
```

Read the string `":vn:"` like this: the leading `:` means "I will handle errors myself". `v` is a **tick box** (no value). `n:` is a **field**: the colon after it means "this option takes a value", which lands in `$OPTARG`. After the loop, `shift $((OPTIND - 1))` removes the options so only the real arguments are left in `$1`, `$2`, ...

```bash
./opts.sh -v -n Asha pasta soup
```

```text
verbose=1 name=Asha
left over: pasta soup
```

Options can be bundled and given in any order, and all of them are optional:

```bash
./opts.sh -vn Asha
./opts.sh
```

```text
verbose=1 name=Asha
left over: 
verbose=0 name=guest
left over: 
```

And the two error cases we handled ourselves:

```bash
./opts.sh -n
echo "exit code: $?"
./opts.sh -x
echo "exit code: $?"
```

```text
Option -n needs a value
exit code: 2
Unknown option -x
exit code: 2
```

One rule to remember: parsing **stops at the first non-option**. Options placed after the file name are treated as plain arguments:

```bash
./opts.sh pasta -v
```

```text
verbose=0 name=guest
left over: pasta -v
```

| Piece | Meaning |
|---|---|
| `getopts ":vn:" opt` | allowed options: `-v` (tick) and `-n value` (field) |
| `$OPTARG` | the value that came with the current option |
| `$OPTIND` | the position of the next argument to look at |
| `shift $((OPTIND - 1))` | remove the parsed options |

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Extend `opts.sh` with `-s` (a tick, meaning "spicy") and `-t TABLE` (a field). Print `Table 4, spicy` for `./opts.sh -s -t 4`. Then try `./opts.sh -t` and read your own error message.

</div>

## 4. `${var}` tricks: cut, replace and slice text

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You have a path like `menu/main-course.csv` and need just the file name, or the name without `.csv`, or the extension. Starting an `awk` or `sed` process for that is heavy. Bash can do it **inside the variable**.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Labels on jars: *"Table-4-pasta"*. To read the dish you **cut off the front** ("Table-4-"). To file the card you **cut off the end** (".csv"). To fix a typo you **replace a word**. You do it with scissors right on the label, without rewriting it.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
file="menu/main-course.csv"
dish="pasta alfredo"

echo "length:      ${#dish}"
echo "file name:   ${file##*/}"
echo "folder:      ${file%/*}"
echo "no .csv:     ${file%.csv}"
echo "extension:   ${file##*.}"
echo "first word:  ${dish%% *}"
echo "replace:     ${dish/alfredo/arrabbiata}"
echo "uppercase:   ${dish^^}"
echo "first 5:     ${dish:0:5}"
echo "fallback:    ${nothing:-none}"
```

```text
length:      13
file name:   main-course.csv
folder:      menu
no .csv:     menu/main-course
extension:   csv
first word:  pasta
replace:     pasta arrabbiata
uppercase:   PASTA ALFREDO
first 5:     pasta
fallback:    none
```

| Write | What it does |
|---|---|
| `${#v}` | length of the text |
| `${v#pattern}` / `${v##pattern}` | cut from the **front** (shortest / longest match) |
| `${v%pattern}` / `${v%%pattern}` | cut from the **end** (shortest / longest match) |
| `${v/old/new}` / `${v//old/new}` | replace the first / every match |
| `${v^^}` / `${v,,}` | UPPER / lower case (Bash 4+) |
| `${v:0:5}` | slice: start at 0, take 5 characters |
| `${v:-x}` | use `x` if `v` is empty or unset |

A memory trick: on a keyboard `#` sits to the **left** of `$`, and `%` to the **right**. So `#` cuts from the left (front) and `%` cuts from the right (end). One symbol means the **shortest** match, two mean the **longest**.

A real use: renaming many files. First print what you *would* do (a "dry run"), then remove the `echo` when it looks right. The quotes around each name keep file names with spaces safe, and they are already in the right place for the real `mv`:

```bash
for f in menu/*.txt; do
  echo mv "$f" "${f%.txt}.bak"
done
```

```text
mv menu/desserts.txt menu/desserts.bak
mv menu/mains.txt menu/mains.bak
mv menu/starters.txt menu/starters.bak
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Given `path="/home/chef/reports/sales-2026.csv"`, print only `sales-2026` (no folder, no extension) using two `${...}` tricks. Hint: first cut the front, then the end. You need two steps, so use two variables.

</div>

## 5. Associative arrays: a menu board with names, not numbers

<div class="story situation">

<p class="story-label">🎯 Situation</p>

In the first article you met arrays where items are found by **position** (0, 1, 2). Often you want to look things up by **name**: the price of a dish, the count of each word, the owner of each server.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A numbered tray ("take item 2") is an ordinary array. The **menu board** is different: you look up *"pasta"* and read *"250"*. You never ask for "the third row". An **associative array** is that board: names on the left, values on the right.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Declare it with `declare -A` (capital A):

```bash
declare -A price=([pasta]=250 [soup]=120 [tea]=40)

echo "tea costs ${price[tea]}"

price[coffee]=60
echo "dishes on the board: ${#price[@]}"

for dish in "${!price[@]}"; do
  echo "$dish ${price[$dish]}"
done | sort
```

```text
tea costs 40
dishes on the board: 4
coffee 60
pasta 250
soup 120
tea 40
```

`${price[tea]}` reads one value, `price[coffee]=60` adds one, `${#price[@]}` counts them, and `${!price[@]}` gives all the **keys**. The order of keys is not guaranteed, so pipe into `sort` when you want a stable list.

To ask "is this dish on the board?" use `-v`. A missing key gives an empty value, so give it a fallback:

```bash
declare -A price=([pasta]=250 [tea]=40)

[[ -v price[tea] ]] && echo "tea is on the menu"
[[ -v price[pizza] ]] || echo "pizza is not on the menu"
echo "pizza costs: ${price[pizza]:-not available}"
unset 'price[tea]'
echo "dishes left: ${#price[@]}"
```

```text
tea is on the menu
pizza is not on the menu
pizza costs: not available
dishes left: 1
```

The classic use is **counting**: one counter per name. Here are today's order slips, one dish per line. The line `seen[$dish]=$(( ${seen[$dish]:-0} + 1 ))` means "take the current count (or 0), add 1, store it back":

```bash
cat > slips.txt <<'EOF'
pasta
soup
tea
pasta
tea
pasta
EOF

declare -A seen
while read -r dish; do
  seen[$dish]=$(( ${seen[$dish]:-0} + 1 ))
done < slips.txt

for dish in "${!seen[@]}"; do
  echo "${seen[$dish]} $dish"
done | sort -rn
```

```text
3 pasta
2 tea
1 soup
```

Same result as the `sort | uniq -c | sort -rn` line from the last article, but now you can use the counts **inside** your script.

> **Mac note: this needs Bash 4 or newer.** Associative arrays arrived in Bash 4. macOS still ships Bash **3.2** as `/bin/bash`, so `declare -A` fails there with "invalid option". Check what you have with `echo $BASH_VERSION`. A newer Bash is one command away with Homebrew (`brew install bash`). On Linux, WSL and the Killercoda machine you already have Bash 5. A careful script checks this at the top, and you will see how in section 9.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Make a board of server names and tables: `declare -A table=([asha]=4 [ravi]=7)`. Print `asha serves table 4` for every name, sorted. Then add a third waiter and print how many waiters there are.

</div>

## 6. Safe scripts: fail loudly, clean up always

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Your script creates temporary files, then fails halfway. Next morning there is junk in `/tmp`, or worse, a half-written file that another job reads. A professional script **cleans up no matter how it ends** and **fails with a clear message**.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The rule in the kitchen: *"Whatever happens tonight (a rush, a burnt dish, a power cut) the chef **always wipes the counter before leaving**."* He does not remember to do it on good days only. It is written on the wall as a standing promise. In Bash that promise is called a **trap**.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

You met `set -euo pipefail` in the first article. In plain words: `-e` stop when a command fails, `-u` treat an unset variable as an error, `-o pipefail` do not hide a failure in the middle of a pipeline. Now add the cleanup promise. `mktemp -d` makes a private scratch folder with a random name, and `trap '...' EXIT` runs your cleanup when the script ends, **however** it ends:

```bash
#!/usr/bin/env bash
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"; echo "cleaned up"' EXIT

echo "working in a scratch folder"
[[ -d $tmp ]] && echo "scratch folder exists"
exit 3
```

```bash
./scratch.sh
echo "exit code: $?"
```

```text
working in a scratch folder
scratch folder exists
cleaned up
exit code: 3
```

The script ended with `exit 3` (a failure), and the trap still ran. It also runs on a normal finish and when `set -e` stops the script. (The one thing no script can catch is being killed with `kill -9`.)

To see **which line** failed, add an `ERR` trap. `$LINENO` is the current line number:

```bash
#!/usr/bin/env bash
set -euo pipefail
trap 'echo "failed at line $LINENO" >&2' ERR

echo "step 1"
false
echo "step 2"
```

```bash
./oops.sh
echo "exit code: $?"
```

```text
step 1
failed at line 6
exit code: 1
```

Step 2 never ran, and you know exactly where it stopped.

**A sneaky gotcha: `local x=$(command)` hides failures.** The `local` command itself succeeds, so Bash never sees the failure of the command inside:

```bash
#!/usr/bin/env bash
set -euo pipefail

check() {
  local out=$(false)
  echo "still running after a failure"
}

check
echo "end"
```

```bash
./masked.sh
echo "exit code: $?"
```

```text
still running after a failure
end
exit code: 0
```

The script carried on as if nothing happened. **Fix:** declare first, assign on the next line:

```bash
#!/usr/bin/env bash
set -euo pipefail

check() {
  local out
  out=$(false)
  echo "never printed"
}

check
echo "end"
```

```bash
./unmasked.sh
echo "exit code: $?"
```

```text
exit code: 1
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write `report-tmp.sh`: make a scratch folder with `mktemp -d`, set an `EXIT` trap that deletes it and prints `scratch removed`, write `grep ERROR kitchen.log > "$tmp/errors.txt"` (use the file from the last article, or any file), print how many lines it has, then run `false` on purpose. Check that `scratch removed` still appears.

</div>

## 7. Break it on purpose

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

**Mistake 1: spaces around `=`.** Everyone does this once, because it looks natural:

```bash
#!/usr/bin/env bash
name = "Asha"
echo "Hi $name"
```

```bash
./vars.sh
```

```text
./vars.sh: line 2: name: command not found
Hi 
```

Bash read `name` as a **command** and `=` and `"Asha"` as its arguments. It found no command called `name`, and then printed `Hi` with an empty name. In the kitchen: the slip says "table = 4" and the chef goes looking for a dish called "table". **Fix:** no spaces on either side of `=`: `name="Asha"`.

**Mistake 2: a missing key under `set -u`.** A missing key in an associative array is an error when `set -u` is on:

```bash
declare -A price=([pasta]=250)
set -u
echo "pizza costs ${price[pizza]}"
```

```text
bash: line 3: price[pizza]: unbound variable
```

**Fix:** give a fallback, `${price[pizza]:-not on the menu}`, or check with `[[ -v price[pizza] ]]` first.

**Mistake 3: the `ERR` trap that stays silent inside a function.** You set a trap to report the failing line, but the failure happens inside a function:

```bash
#!/usr/bin/env bash
set -euo pipefail
trap 'echo "failed at line $LINENO" >&2' ERR

work() { false; }
work
```

```bash
./quiet-trap.sh
echo "exit code: $?"
```

```text
exit code: 1
```

The script failed (exit code 1) but the trap said nothing. By default, functions do not inherit the `ERR` trap. **Fix:** add the `-E` flag, `set -Eeuo pipefail`:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "failed at line $LINENO" >&2' ERR

work() { false; }
work
```

```bash
./loud-trap.sh
echo "exit code: $?"
```

```text
failed at line 5
exit code: 1
```

**Mistake 4: `pipefail` plus `head`.** When the reader at the end of a pipe (`head`) quits early, the writer (`yes`, a log reader, a big `grep`) gets a "broken pipe" signal and counts as **failed**:

```bash
set -o pipefail
yes | head -n 1
echo "status: $?"
```

```text
y
status: 141
```

`head` got its one line and left, `yes` was still talking, and the whole pipeline reports **141** (128 plus signal 13, SIGPIPE). Nothing is actually wrong. If you ever see exit code 141 in a script, this is the first thing to suspect. **Fix:** if you are sure it is harmless, add `|| true` after the pipeline, or avoid `head` on endless or very large streams in strict scripts.

</div>

## 8. Scheduling with cron

<div class="story situation">

<p class="story-label">🎯 Situation</p>

A script that you must remember to run is not automation. You want it to run **every night at 11 pm**, or **every 5 minutes**, with nobody there.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A **bell on the wall** rings at 11 pm every night, and the closing chef starts the closing checklist without being asked. Nobody has to remember. The bell is **cron**, the checklist is your script, and the schedule is written on a card: *"at 23:00, every day."*

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

Cron reads a table called a **crontab**. Open yours with `crontab -e`, list it with `crontab -l`. Each line is **five time fields, then the command**:

```text
# ┌───────── minute (0-59)
# │ ┌─────── hour (0-23)
# │ │ ┌───── day of month (1-31)
# │ │ │ ┌─── month (1-12)
# │ │ │ │ ┌─ day of week (0-6, Sunday is 0)
# │ │ │ │ │
  0 23 * * *   /home/chef/bin/backup.sh
```

A `*` means "every". Some schedules you will actually write:

| Schedule | Meaning |
|---|---|
| `*/5 * * * *` | every 5 minutes |
| `0 23 * * *` | every day at 23:00 |
| `30 2 * * 1-5` | at 02:30, Monday to Friday |
| `0 9 1 * *` | at 09:00 on the 1st of every month |

(These lines are for your crontab. We do not run cron here, because you would have to wait for the clock.)

**The one thing that bites everyone:** a script that works perfectly by hand fails under cron. Cron does **not** load your usual settings. Per the `crontab(5)` manual, its `PATH` is just `/usr/bin:/bin`, and it does not read your `.bashrc`. Cron also starts in your home folder, not in the folder you were in. Two commands imitate that situation:

```bash
mkdir -p bin
printf '#!/usr/bin/env bash\necho "hello from the tool"\n' > bin/hello-tool
chmod +x bin/hello-tool

PATH=/usr/bin:/bin hello-tool
(cd / && ./bin/hello-tool)
```

```text
bash: line 5: hello-tool: command not found
bash: line 6: ./bin/hello-tool: No such file or directory
```

The first fails because `hello-tool` is not on the short `PATH`. The second fails because a **relative** path only works from the folder you were standing in. (Wording of these errors varies a little between systems.) The rules that follow:

- Use **absolute paths** for the script and for every command or file it needs, or set `PATH=` at the top of the crontab.
- **Save the output**, because cron has no screen: `0 23 * * * /home/chef/bin/backup.sh >> /home/chef/backup.log 2>&1`.
- Test the script by hand first, and run it from a different folder, like we did above.
- In a crontab, a bare `%` means "new line". Write `\%` if your command needs one (for example in a `date +%F` call).
- On Linux, `flock -n /tmp/backup.lock /home/chef/bin/backup.sh` stops two copies from running at once when a job takes longer than its interval.

Modern Linux also has **systemd timers**, a more powerful way to schedule. Cron is still everywhere, and a great thing to know first.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write the crontab line (do not install it) that runs `/home/chef/bin/report.sh` **every Monday at 8:15** and appends its output to `/home/chef/report.log`. Check your five fields against the table above.

</div>

## 9. Put it together: a professional backup script

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Every night you want to pack the `menu` folder into one compressed file, with these options: which folder (`-s`), where to put the backup (`-d`), an optional name tag (`-t`), a dry-run mode that changes nothing (`-n`), and a chatty mode (`-v`). It must refuse bad input and leave no junk behind.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The closing chef gets a clear slip: **which shelf to pack, where to store it, what label to put on the box**. If any blank is empty, he asks. If the shelf does not exist, he says so. He packs on a scratch table, moves the finished box to the store room, and **always wipes the scratch table** at the end. Also, he can do a "pretend run" where he says what he would do, without touching anything.

</div>

<figure>
<img src="/img/learn/bash-pro-skeleton.svg" alt="Five steps from top to bottom. The getopts loop reads the options. Checks make sure the inputs are valid. A scratch folder is made and a cleanup promise is set with trap. The tar command does the work. The cleanup always runs when the script exits." width="520" height="540" loading="lazy" />
<figcaption>The skeleton of a professional script: read, check, prepare, work, always clean up.</figcaption>
</figure>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
set -euo pipefail

if (( BASH_VERSINFO[0] < 4 )); then
  echo "This script needs Bash 4 or newer" >&2
  exit 1
fi

usage() {
  echo "Usage: $0 [-v] [-n] -s SOURCE_DIR -d DEST_DIR [-t TAG]" >&2
  exit 2
}

verbose=0
dry=0
tag="daily"
src=""
dest=""

while getopts ":vns:d:t:" opt; do
  case $opt in
    v) verbose=1 ;;
    n) dry=1 ;;
    s) src=$OPTARG ;;
    d) dest=$OPTARG ;;
    t) tag=$OPTARG ;;
    :) echo "Option -$OPTARG needs a value" >&2; usage ;;
    \?) echo "Unknown option -$OPTARG" >&2; usage ;;
  esac
done

[[ -n $src && -n $dest ]] || usage
[[ -d $src ]] || { echo "No such folder: $src" >&2; exit 1; }

log() {
  if (( verbose )); then
    echo "$*"
  fi
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"; log "cleaned up"' EXIT

declare -A kinds=()
for f in "$src"/*; do
  [[ -f $f ]] || continue
  name="${f##*/}"
  ext="${name##*.}"
  [[ $name == *.* && -n $ext ]] || ext="none"
  kinds[$ext]=$(( ${kinds[$ext]:-0} + 1 ))
done

for ext in "${!kinds[@]}"; do
  log "found ${kinds[$ext]} file(s) of type: $ext"
done | sort

archive="$tmp/kitchen-$tag.tar.gz"
tar -czf "$archive" -C "$src" .

if (( dry )); then
  echo "Dry run: would write $dest/kitchen-$tag.tar.gz"
  exit 0
fi

mkdir -p "$dest"
mv "$archive" "$dest/"
echo "Backed up to $dest/kitchen-$tag.tar.gz"
```

Save it as `backup.sh` and run `chmod +x backup.sh`. First a **dry run** with chatty output:

```bash
./backup.sh -v -n -s menu -d backups
```

```text
found 1 file(s) of type: csv
found 3 file(s) of type: txt
Dry run: would write backups/kitchen-daily.tar.gz
cleaned up
```

Nothing was written (check: there is no `backups` folder), and `cleaned up` shows the trap ran even on the early `exit 0`. Now the real thing, with a tag, and a look inside the archive:

```bash
./backup.sh -v -s menu -d backups -t monday
tar -tzf backups/kitchen-monday.tar.gz | sort
```

```text
found 1 file(s) of type: csv
found 3 file(s) of type: txt
Backed up to backups/kitchen-monday.tar.gz
cleaned up
./
./desserts.txt
./mains.txt
./prices.csv
./starters.txt
```

And the ways it protects itself from bad input:

```bash
./backup.sh -s menu
echo "exit code: $?"
./backup.sh -s nope -d backups
echo "exit code: $?"
./backup.sh -x
echo "exit code: $?"
```

```text
Usage: ./backup.sh [-v] [-n] -s SOURCE_DIR -d DEST_DIR [-t TAG]
exit code: 2
No such folder: nope
exit code: 1
Unknown option -x
Usage: ./backup.sh [-v] [-n] -s SOURCE_DIR -d DEST_DIR [-t TAG]
exit code: 2
```

Every piece comes from this page:

| Piece | Section |
|---|---|
| `BASH_VERSINFO[0] < 4` | the Mac note in section 5: refuse to run on a Bash that is too old |
| `usage` and exit code 2 | section 2 |
| `getopts ":vns:d:t:"` | section 3: ticks `-v -n`, fields `-s -d -t` |
| `${f##*/}` and `${name##*.}` | section 4: cut the front to get the file name, then the extension (a name with no extension, or ending in a dot, becomes `none` so it never breaks the array) |
| `declare -A kinds` | section 5: a counter per file type |
| `mktemp -d` and `trap ... EXIT` | section 6: private scratch folder, always cleaned |
| `if (( verbose ))` instead of `a && b` | section 7: no `&&`/`||` surprises under `set -e` |

And to run it every night at 23:00, you now know the crontab line:

```text
0 23 * * * /home/chef/bin/backup.sh -s /home/chef/menu -d /home/chef/backups >> /home/chef/backup.log 2>&1
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Add a `-k NUMBER` option ("keep") that, **only when it is given**, prints `Keeping the last NUMBER backups` after a successful backup (you do not need to delete anything yet). Reject a value that is not a whole number with a message and `exit 2`, using the regex check from the last article.

</div>

## 10. Your challenge

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Use the `slips.txt` from section 5 (one dish per line: pasta three times, tea twice, soup once). Write `tally.sh` that prints the **top dishes** by count:

1. `-n NUMBER` sets how many dishes to show. The default is **3**.
2. The last argument is the file. If it is missing, print a usage line and `exit 2`.
3. If `-n` is not a whole number, print `-n needs a number` and `exit 2`.
4. If the file does not exist, print `Cannot find <name>` and `exit 1`. Error messages go to the **error** exit (`>&2`).
5. Count with an **associative array**, print each line as `COUNT DISH`, biggest first.


When it works, `./tally.sh slips.txt` should print exactly this:

```text
3 pasta
2 tea
1 soup
```

`./tally.sh -n 2 slips.txt` shows only the top two:

```text
3 pasta
2 tea
```

and the three error cases, with their exit codes:

```text
-n needs a number
exit code: 2
Cannot find nofile.txt
exit code: 1
Usage: ./tally.sh [-n NUMBER] FILE
exit code: 2
```

Hints: `while getopts ":n:" opt` takes `-n` with a value. After the loop, `shift $((OPTIND - 1))` leaves the file name in `$1`. Use `[[ $top =~ ^[0-9]+$ ]]` to check the number. For the output, loop over `"${!count[@]}"`, print `"${count[$dish]} $dish"`, and finish with `sort -rn | head -n "$top"` (with this tiny file, the `head` warning from section 7 does not bite).

Stuck? Email me what you tried. The email is at the bottom of this page.

</div>

<div class="lab-cta">
<p class="lab-cta-title">🏁 Ready to practise for real?</p>
<p><a class="btn" href="https://killercoda.com/mahendrarao/scenario/bash-like-a-pro" target="_blank" rel="noopener">▶ Open the hands-on lab (25 min)</a></p>
<p class="lab-cta-note"><strong>Note:</strong> you need a <strong>free</strong> Killercoda account (sign in with Google, GitHub or email). Nothing to install. A free session lasts about 60 minutes; paid accounts get up to 4 hours. The lab checks your work and gives hints when something is wrong.</p>
</div>

## Recap

- `$1 $2 ... $# "$@" $0`: arguments (always quote `"$@"`); `shift` moves them along
- `${1:-default}` gives a default, `${1:?message}` demands a value; `usage()` plus `exit 2` for wrong use
- `getopts ":vn:" opt` reads options (`v` is a tick, `n:` takes a value in `$OPTARG`), then `shift $((OPTIND - 1))`
- `${v#x}`, `${v##x}`, `${v%x}`, `${v%%x}`, `${v/a/b}`, `${v^^}`, `${v:0:5}`: edit text inside the variable
- `declare -A board=([key]=value)`: look up by name. Keys are `${!board[@]}`, count is `${#board[@]}`. Needs Bash 4 or newer (macOS has 3.2)
- `set -euo pipefail`, `mktemp -d`, `trap '...' EXIT` (always clean up), `trap '...' ERR` (with `set -E` for functions)
- Declare first, assign next: `local x` then `x=$(cmd)`, so a failure is not hidden
- Exit code 141 means a broken pipe (`pipefail` plus an early-quitting `head`)
- cron: five fields (`minute hour day month weekday`), absolute paths, save output with `>> file 2>&1`, test from another folder

You now have the full working set of Bash. More tracks are coming: Linux, Git, YAML, Docker and Kubernetes, with the same format and a hands-on lab for each.

**Sources used for the Mac and cron notes:** [Bash maintainer on macOS `/bin/bash` and associative arrays](https://lists.gnu.org/archive/html/help-bash/2022-02/msg00149.html), [crontab(5) manual (Debian)](https://manpages.debian.org/testing/cron/crontab.5), [Crontab guide (Linuxize)](https://linuxize.com/post/scheduling-cron-jobs-with-crontab/).
