---
title: "Your First Bash Script, From Zero"
description: "Write, save, run and debug a Bash script. Every idea comes with a restaurant example and a tested technical example."
topic: "Bash"
order: 1
level: "Beginner"
minutes: 30
date: 2026-10-12
free: true
---

By the end of this page you will have written, saved, run, **broken** and **fixed** real Bash scripts. No prior knowledge needed. You only need a terminal (Linux, macOS, or WSL on Windows).

> Every script below was run by me on Bash 5.2 before I wrote this. The outputs you see are real, not made up.

**How each section works.** Every idea comes in the same four parts, so you always know where you are:

<div class="story situation">

<p class="story-label">🎯 Situation</p>

The everyday problem this idea solves.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The same idea in a kitchen. Read this if the technical part feels heavy.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

The real commands, with real output.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Do it yourself, and see what you should see.

</div>

The kitchen is our map for the whole page. Keep this picture in mind:

<figure>
<img src="/img/learn/bash-kitchen-map.svg" alt="Five pairs. A recipe card is the script file hello.sh. The head chef is the bash program. A box labelled TOMATO is a variable, tomato=5. A tray with numbered slots is an array, tools=(a b c). A stop-service alarm is exit 1." width="520" height="450" loading="lazy" />
<figcaption>Kitchen on the left, Bash on the right.</figcaption>
</figure>

## 1. What is a Bash script?

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Every morning you type `ls`, then `pwd`, then `date`. Same three commands, every day. Boring, and easy to forget one.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A chef does not remember every dish from memory. The kitchen keeps a **recipe card**: step 1, step 2, step 3. Anyone can follow the card and get the same dish every time. A Bash script is that recipe card, and the computer is the chef who follows it.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

A Bash script is a text file full of the same commands you would type in the terminal, saved so you can run them again and again. Put the three commands in a file once, run the file, done.

</div>

## 2. Your first script

<div class="story technical">

<p class="story-label">💻 Technical</p>

Create a file called `hello.sh`:

```bash
#!/usr/bin/env bash
echo "Hello from my first script!"
```

Run it:

```bash
bash hello.sh
```

```text
Hello from my first script!
```

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Create the file, run it, and check that you see exactly one line: `Hello from my first script!`. If you see `command not found`, you are probably not in the folder where you saved the file. Run `pwd` and `ls` to check.

</div>

That's it. You wrote a program.

### What is that first line? (the shebang)

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

At the top of a recipe card the kitchen writes *"Italian section, pizza chef reads this."* Without that line, nobody knows which chef should cook it.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

`#!/usr/bin/env bash` is called the **shebang**. It tells your system *which program should read this file*. Without it, the system has to guess.

- `#!` = "this file should be run by..."
- `/usr/bin/env bash` = "...whichever `bash` you have installed"

Always make it the very first line, with nothing before it.

> **Why `env bash` and not `/bin/bash`?** Both work. `env bash` finds Bash wherever it is installed (macOS and some servers keep it in different places), so it is the safer habit.

</div>

## 3. Saving and running: two ways

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A new card from outside the restaurant is not trusted yet. The head chef must stamp it **"approved to cook"** before the kitchen will follow it by itself. But you can always hand the card to a chef directly and say "cook this one".

</div>

<figure>
<img src="/img/learn/bash-run-flow.svg" alt="Five steps from left to right. One, write the file hello.sh. Two, give permission with chmod plus x. Three, the shebang line picks the bash program. Four, bash runs the lines one at a time. Five, you get output and an exit code. Exit code 0 means success, anything else means something went wrong." width="520" height="560" loading="lazy" />
<figcaption>What happens, in order, when you run a script.</figcaption>
</figure>

<div class="story technical">

<p class="story-label">💻 Technical</p>

**Way 1: tell Bash to run it** (always works)

```bash
bash hello.sh
```

**Way 2: make the file executable, then run it directly**

If you try to run it directly *before* giving permission, you get this:

```bash
./hello.sh
```

```text
bash: ./hello.sh: Permission denied
```

Not a bug. Linux doesn't trust new files to be programs. Grant permission with `chmod +x` (change mode, add *execute*), which is the "approved" stamp:

```bash
chmod +x hello.sh
./hello.sh
```

```text
Hello from my first script!
```

Why `./`? It means "the file in *this* folder". Without it, the shell only looks in special system folders.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Run `./hello.sh` **before** `chmod +x`. You should see `Permission denied`. (On a Mac the wording is slightly different: `zsh: permission denied: ./hello.sh`. Same problem, same fix.) Then run `chmod +x hello.sh` and try again. Seeing the error first is the point: next time you meet it, you will know the fix in five seconds.

</div>

## 4. Variables: named boxes for values

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Your script uses the same name, city or folder in ten places. When it changes, you do not want to edit ten lines.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The kitchen has a box with a label: **TOMATO**. Today it holds 5 kg, tomorrow 8 kg. Every recipe says "use the TOMATO box" instead of "use 5 kg". Change what is inside the box, and every recipe follows.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
name="Mahendra"
age=11
echo "My name is $name and I have $age years of experience."
echo "Today is $(date +%A)."
echo "Script name: $0"
echo "First argument: $1"
```

Save as `vars.sh` and run `bash vars.sh Pune`:

```text
My name is Mahendra and I have 11 years of experience.
Today is Monday.
Script name: vars.sh
First argument: Pune
```

(Your day name will differ.) Four things to learn here:

| You write | It means |
|---|---|
| `name="Mahendra"` | Store a value. **No spaces around `=`.** |
| `$name` | Use the value |
| `$(date +%A)` | Run a command, use its output |
| `$0`, `$1`, `$2`… | The script's own name, then the arguments you typed after it |

</div>

### Break it on purpose

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Imagine writing on the box *"TOMATO = 5"* with gaps, and the chef reads it as an order: "do the thing called TOMATO, using ingredients `=` and `5`". The chef has no idea what that dish is. That is exactly what Bash does with spaces.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Add spaces around the `=`:

```bash
#!/usr/bin/env bash
name = "Mahendra"
echo "Hi $name"
```

You should see this error, and a greeting with no name:

```text
broken.sh: line 2: name: command not found
Hi 
```

Bash thought `name` was a *command* and `=` and `"Mahendra"` were its arguments. **Fix:** `name="Mahendra"`, with no spaces.

This is the number one beginner mistake. Now you know it on sight.

</div>

## 5. Arrays: one variable, many values

<div class="story situation">

<p class="story-label">🎯 Situation</p>

You have a list: five servers to check, or three tools to install. One variable per item would be messy.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

A tray with numbered slots: slot 0 holds the bread, slot 1 the soup, slot 2 the rice. Kitchens (and Bash) start counting at **0**, so the first slot is slot 0, not slot 1. You can ask "what is in slot 1?", "how many slots are filled?", or "add one more dish at the end".

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
tools=("bash" "docker" "kubectl")
echo "First tool : ${tools[0]}"
echo "All tools  : ${tools[@]}"
echo "How many   : ${#tools[@]}"
tools+=("terraform")
for tool in "${tools[@]}"; do
  echo "- $tool"
done
```

Output:

```text
First tool : bash
All tools  : bash docker kubectl
How many   : 3
- bash
- docker
- kubectl
- terraform
```

| Syntax | Meaning |
|---|---|
| `tools=(a b c)` | Make an array |
| `${tools[0]}` | Item number 0. **Counting starts at 0.** |
| `${tools[@]}` | All items |
| `${#tools[@]}` | How many items |
| `tools+=("x")` | Add an item |

Always wrap `"${tools[@]}"` in double quotes inside loops. It keeps items with spaces in them intact.

</div>

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Change the array to hold your own four tools. Before you run it, guess two things. What will the "How many" line print? (`4`.) How many lines will the loop print? (`5`, because `terraform` is added before the loop runs.)

</div>

## 6. if / elif / else: making decisions

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Your script should behave differently depending on what it finds: a file is there or not, a number is big or small.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The waiter asks: *"Spicy?"* **If** the guest says "very", add extra chilli. **Else if** they say "medium", add a little. **Else**, cook it mild. The kitchen does not guess: it checks the answer and follows one path.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
read -p "Enter your marks (0-100): " marks
if [ "$marks" -ge 75 ]; then
  echo "Distinction!"
elif [ "$marks" -ge 40 ]; then
  echo "Pass."
else
  echo "Try again, you will get it."
fi
```

Typing `90`, `50`, `10` on three separate runs gives:

```text
Distinction!
Pass.
Try again, you will get it.
```

Cheat-sheet for the part inside `[ ]`:

| Test | True when |
|---|---|
| `-eq`, `-ne` | numbers equal / not equal |
| `-gt`, `-ge` | greater than / greater or equal |
| `-lt`, `-le` | less than / less or equal |
| `"$a" = "$b"` | text is equal |
| `-d path` | it's a folder |
| `-f path` | it's a file |

Spaces matter here: `[ "$x" -ge 5 ]` needs a space after `[` and before `]`.

</div>

### Break it on purpose

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Forget the `then`:

```bash
#!/usr/bin/env bash
count=3
if [ $count -gt 2 ]
  echo "big"
fi
```

You should see:

```text
broken2.sh: line 5: syntax error near unexpected token `fi'
broken2.sh: line 5: `fi'
```

Read that carefully: Bash complains about line 5 (`fi`), but the real mistake is on line 3. When the error points at the *end* of a block, look at the *start* of it. **Fix:** add `; then` after the `]`.

In kitchen words: the chef reads "if the guest wants spicy" and then, with no "then do this", is told "end of question". He stops and complains at the *end*, though the card was missing words in the *middle*.

</div>

## 7. A tiny real-world script

<div class="story situation">

<p class="story-label">🎯 Situation</p>

Before running a backup, you want to check that the folder exists and see how big it is, and you want automation to **know** if it failed.

</div>

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

The opening checklist: "Is the cold room there? How full is it?" If the cold room is missing, the checker does not quietly carry on. He rings the **alarm** so the manager knows service cannot start. That alarm is `exit 1`.

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

```bash
#!/usr/bin/env bash
folder="${1:-/tmp}"
if [ -d "$folder" ]; then
  echo "$folder exists. Size:"
  du -sh "$folder" 2>/dev/null | cut -f1
else
  echo "$folder is not a folder."
  exit 1
fi
```

```bash
bash disk.sh /etc
```

```text
/etc exists. Size:
8.0M
```

(Your size will differ.)

```bash
bash disk.sh /nope
echo $?
```

```text
/nope is not a folder.
1
```

New idea: `${1:-/tmp}` means "use the first argument, or `/tmp` if none was given". And `exit 1` tells whoever ran your script that it **failed** (`0` means success). This is how automation tools like CI pipelines know something went wrong.

</div>

## 8. Debugging: three tools you will use forever

<div class="story restaurant">

<p class="story-label">🍽️ Restaurant</p>

Three helpers every kitchen uses. A **CCTV camera** that lets you replay what the chef actually did (`bash -x`). A rule that says **"stop service the moment a dish burns"** instead of serving the rest (`set -euo pipefail`). And a **food inspector** who reads your recipe card before opening day and says "step 4 will go wrong" (ShellCheck).

</div>

<div class="story technical">

<p class="story-label">💻 Technical</p>

**Tool 1: `bash -x`. Watch every step.**

```bash
#!/usr/bin/env bash
a=5
b=$((a * 2))
echo "b is $b"
```

```bash
bash -x debug.sh
```

```text
+ a=5
+ b=10
+ echo 'b is 10'
b is 10
```

Lines starting with `+` are what Bash is *actually doing*, with values filled in. When something behaves strangely, this shows you why.

**Tool 2: stop on the first error.** By default Bash keeps going after a failure, which can be dangerous. Add this line under the shebang:

```bash
set -euo pipefail
```

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "Step 1"
ls /folder/that/does/not/exist
echo "Step 2 (never reached)"
```

```text
Step 1
ls: cannot access '/folder/that/does/not/exist': No such file or directory
```

"Step 2" never prints. In plain words: `-e` stops on errors, `-u` stops if you use a variable you never set (catches typos like `$nme`), and `pipefail` catches failures inside `a | b` chains.

**Tool 3: ShellCheck.** A free tool that reads your script and tells you what's wrong, like a spell-checker for Bash. Try it online at [shellcheck.net](https://www.shellcheck.net/) by pasting your script, or install it with `sudo apt install shellcheck` and run `shellcheck myscript.sh`.

</div>

## 9. Your challenge

<div class="story tryit">

<p class="story-label">🧪 Try it</p>

Write `greet.sh` that:

1. Asks the user for their name with `read`.
2. Stores favourite tools in an array (at least 3).
3. If the name is empty, prints `Please tell me your name` and exits with `exit 1`.
4. Otherwise prints `Hello, <name>!` and then loops over the array.

Hints: `[ -z "$name" ]` is true when `name` is empty. You have already seen everything else.

Stuck? Email me what you tried. The email is at the bottom of this page.

</div>

## Recap

- Shebang first: `#!/usr/bin/env bash` (the card says which chef reads it)
- Run with `bash file.sh`, or `chmod +x file.sh` then `./file.sh` (the "approved" stamp)
- Variables: `name="x"` (no spaces), use `$name` (a labelled box)
- Arrays: `arr=(a b c)`, `"${arr[@]}"`, counting starts at 0 (a numbered tray)
- Decisions: `if [ ... ]; then ... elif ... else ... fi` (the spicy question)
- Failure signal: `exit 1` (the alarm)
- Debug: `bash -x`, `set -euo pipefail`, ShellCheck (CCTV, stop-service rule, inspector)

**Next up:** loops, functions, and reading files line by line.
