---
title: "Your First Bash Script, From Zero"
description: "Write, save, run and debug a Bash script. Covers the shebang, variables, arrays and if-else, with every command tested."
topic: "Bash"
order: 1
level: "Beginner"
minutes: 25
date: 2026-10-12
free: true
---

By the end of this page you will have written, saved, run, **broken** and **fixed** real Bash scripts. No prior knowledge needed. You only need a terminal (Linux, macOS, or WSL on Windows).

> Every script below was run by me on Bash 5.2 before I wrote this. The outputs you see are real, not made up.

## 1. What is a Bash script?

A Bash script is a text file full of the same commands you would type in the terminal, saved so you can run them again and again.

Typing `ls`, then `pwd`, then `date` every morning? Put them in a file once. Run the file. Done.

## 2. Your first script

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

That's it. You wrote a program.

### What is that first line? (the shebang)

`#!/usr/bin/env bash` is called the **shebang**. It tells your system *which program should read this file*. Without it, the system has to guess.

- `#!` = "this file should be run by..."
- `/usr/bin/env bash` = "...whichever `bash` you have installed"

Always make it the very first line, with nothing before it.

> **Why `env bash` and not `/bin/bash`?** Both work. `env bash` finds Bash wherever it is installed (macOS and some servers keep it in different places), so it is the safer habit.

## 3. Saving and running: two ways

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

Not a bug. Linux doesn't trust new files to be programs. Grant permission with `chmod +x` (change mode, add *execute*):

```bash
chmod +x hello.sh
./hello.sh
```

```text
Hello from my first script!
```

Why `./`? It means "the file in *this* folder". Without it, the shell only looks in special system folders.

## 4. Variables: named boxes for values

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

### Break it on purpose

Add spaces around the `=`:

```bash
#!/usr/bin/env bash
name = "Mahendra"
echo "Hi $name"
```

```text
broken.sh: line 2: name: command not found
Hi 
```

Bash thought `name` was a *command* and `=` and `"Mahendra"` were its arguments. **Fix:** `name="Mahendra"`, with no spaces.

This is the number one beginner mistake. Now you know it on sight.

## 5. Arrays: one variable, many values

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

## 6. if / elif / else: making decisions

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

### Break it on purpose

Forget the `then`:

```bash
#!/usr/bin/env bash
count=3
if [ $count -gt 2 ]
  echo "big"
fi
```

```text
broken2.sh: line 5: syntax error near unexpected token `fi'
broken2.sh: line 5: `fi'
```

Read that carefully: Bash complains about line 5 (`fi`), but the real mistake is on line 3. When the error points at the *end* of a block, look at the *start* of it. **Fix:** add `; then` after the `]`.

## 7. A tiny real-world script

Put it together: check whether a folder exists and show its size.

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

```bash
bash disk.sh /nope
echo $?
```

```text
/nope is not a folder.
1
```

New idea: `${1:-/tmp}` means "use the first argument, or `/tmp` if none was given". And `exit 1` tells whoever ran your script that it **failed** (`0` means success). This is how automation tools like CI pipelines know something went wrong.

## 8. Debugging: three tools you will use forever

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

## 9. Your challenge

Write `greet.sh` that:

1. Asks the user for their name with `read`.
2. Stores favourite tools in an array (at least 3).
3. If the name is empty, prints `Please tell me your name` and exits with `exit 1`.
4. Otherwise prints `Hello, <name>!` and then loops over the array.

Hints: `[ -z "$name" ]` is true when `name` is empty. You have already seen everything else.

Stuck? Email me what you tried. The email is at the bottom of this page.

## Recap

- Shebang first: `#!/usr/bin/env bash`
- Run with `bash file.sh`, or `chmod +x file.sh` then `./file.sh`
- Variables: `name="x"` (no spaces), use `$name`
- Arrays: `arr=(a b c)`, `"${arr[@]}"`, counting starts at 0
- Decisions: `if [ ... ]; then ... elif ... else ... fi`
- Debug: `bash -x`, `set -euo pipefail`, ShellCheck

**Next up:** loops, functions, and reading files line by line.
