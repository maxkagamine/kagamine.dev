---
title: GG, a bash function for faster git committing
date: 2018-03-18T20:07-0400
---

Perhaps the most frequent thing you'll do with git is stage all your changes and commit them, leading to a lot of `git add -A && git commit` (or `git commit -a` if there are no untracked files). You could alias this, but there are also times when you only want to commit specific files and wouldn't be able to use the same command. And typically commit messages are only a single line, so you can skip the editor and use `-m`, but then if you start your message with a single quote instead of a double and realize you need to say "they're", you have to do one of these awkward maneuvers: `they'\''re` (ending the quote, escpaing a single quote, and then returning to a quote all within the same argument).

Wouldn't it be nice if there were a single command that commits everything all in one go, allows you to commit only staged files using the same command, and also supports specifying the message _as a bare string_, all with only two characters?

Allow me to introduce my favorite bash function: `gg`! <!-- end --> GG stands for "good game", in reference to [D.Va's voice line](https://youtu.be/qewbLfCYEw0?t=22) from Overwatch (hence the banner image), and conveniently sits well alongside other common aliases such as `gd` (git diff), `gl` (git log), and just `g` for git itself.

## What it does

Say you've changed a file "foo" and created a file "bar". To commit all your changes, including the untracked file, simply do:

```shell
~/test (master)
$ echo changes > foo && touch bar

~/test (master *%)
$ gg Changed foo, added bar
[master dd7fe83] Changed foo, added bar
 2 files changed, 1 insertion(+)
 create mode 100644 bar

~/test (master)
$
```

_Using [git-prompt's](https://github.com/git/git/blob/041fe8fc83770f95b09db4aa9d9b3783789eab08/contrib/completion/git-prompt.sh#L38-L53) `GIT_PS1_SHOWDIRTYSTATE` and `GIT_PS1_SHOWUNTRACKEDFILES` here to show how git status is affected._

Notice the lack of quotes around the commit message! Of course, you still need to be mindful of special characters as with any argument (e.g. `they\'re`). If you leave the commit message out, you'll be presented with an editor as usual.

Now say we have a change to "bar" we want to commit, but not a change we made to "foo". If you have files staged, `gg` will only commit the staged files (VS Code calls this behavior "smart commit" in its settings):

```shell
~/test (master)
$ echo 'more changes' | tee foo bar

~/test (master *)
$ ga bar  # alias for git add

~/test (master *+)
$ gg Changed bar
Committing only staged changes.
[master 9ae0cca] Changed bar
 1 file changed, 1 insertion(+), 1 deletion(-)

~/test (master *)
$
```

Let's [undo that commit](https://git-scm.com/docs/git-reset#git-reset-Undoacommitandredo) but leave "bar" staged and say we instead want to commit both files, even though only one is staged, and **amend** our previous commit. Rather than unstage "bar", `gg` takes the familiar `-A` option from `git add` to commit everything even if files are staged. All other options are passed to `git commit` (\* see note in the explanation below), so we can do:

```shell
~/test (master *)
$ g reset --soft HEAD~

~/test (master *+)
$ gg -A --amend
[master 6b6a1cb] Changed foo, added bar
 Date: Sun Mar 18 21:43:29 2018 -0400
 2 files changed, 2 insertions(+)
 create mode 100644 bar

~/test (master)
$
```

Awesome! Now without further ado, _**behold:**_

## The function

I'll leave the full source here and then step through it below to explain what's going on:

```bash
gg() {
	# Usage: gg [-A] [<git commit options>] [bare message...]
	# Commits everything if -A or nothing staged
	# https://maxkagamine.com/blog/gg-a-bash-function-for-faster-git-committing
	git rev-parse --is-inside-work-tree > /dev/null || return
	local opts=()
	local staged=$(git diff --cached --quiet)$?
	while [[ ${1::1} == '-' ]]; do
		if [[ $1 == '--' ]]; then
			shift; break
		elif [[ $1 == '-A' ]]; then
			staged=0; shift
		else
			opts+=("$1"); shift
		fi
	done
	if (( $# > 0 )); then
		opts+=(-m "$*")
	fi
	if [[ $staged == 0 ]]; then
		git add -A || return
	elif [[ $(git diff-files; git ls-files -o --exclude-standard "$(git rev-parse --show-toplevel)") ]]; then
		# Only some changes staged
		echo 'Committing only staged changes.'
	fi
	git commit "${opts[@]}"
}
```

To get tab completion for `git commit`'s options:

```bash
. /usr/share/bash-completion/completions/git
__git_complete gg _git_commit
```

You'll need to find where git-completion.bash lives on your system, install it if it's a separate package, or [grab it here](https://github.com/git/git/blob/master/contrib/completion/git-completion.bash) (the above path is valid for Ubuntu / WSL). This can be used for aliases besides `gg`; the second parameter's values are named as you'd expect, but `git` by itself is `__git_main`. Also available [for zsh](https://github.com/git/git/blob/master/contrib/completion/git-completion.zsh).

## Explanation

```bash
git rev-parse --is-inside-work-tree > /dev/null || return
```

First off, we do a quick check to make sure we're in a git repo. `git rev-parse --is-inside-work-tree` will output the same error as most git commands to stderr if we're not, and we'll `return` then. Otherwise it exits with 0 and prints "true" to stdout which we throw away.

```bash
local opts=()
local staged=$(git diff --cached --quiet)$?
```

That aside, the first thing we do here is [define an array](http://wiki.bash-hackers.org/syntax/arrays) for any options to be passed to `git commit` and then determine if any files are staged, since we'll override this later if `-A` is given (and since we're in a function, we make these [`local`](http://tldp.org/LDP/abs/html/localvar.html)).

Using `git diff --cached` shows changes on the index, i.e. what's staged, rather than the working tree ([see here for a nice visual](https://stackoverflow.com/a/1587952)). It also takes an [`--exit-code`](https://git-scm.com/docs/git-diff#git-diff---exit-code) option which "exits with 1 if there were differences," together essentially giving us a boolean indicating if files are staged. Since all we care about is this value and not the diff itself, we use `--quiet` which implies `--exit-code`. To get this in a variable, we can do something interesting and _concatenate_ the output of that command (of which there is none) with `$?` which is the exit code of the last command. This gives us that nice one-liner.

```bash
while [[ ${1::1} == '-' ]]; do
```

Now we start parsing options. **Note:** I use "parsing" here loosely; `gg` doesn't actually know about all of `git commit`'s options, so it can't know which ones do and don't take a value. Luckily this doesn't cause much trouble, as those that do aren't used as often, but if need be, you can still pass the value using either the long form with an equals as the git docs show it, e.g. `--reuse-message=<commit>`, or using the short form without a space, e.g. `-C<commit>`.

`${1::1}` uses [substring expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) to extract the first character from `$1` (we could have also done `$1 == -*`, or with regex, `$1 =~ ^-`). This will loop over arguments until it finds one that doesn't look like an option, or until we break out of the loop (below). This means options must come before the commit message, but also means you can safely use hyphens in your message.

```bash
if [[ $1 == '--' ]]; then
  shift; break
```

Per standard Unix convention, the double dash is used to stop option parsing, in case you have a positional parameter (in this case, commit message) that begins with a dash. Shift it off and exit the loop.

```bash
elif [[ $1 == '-A' ]]; then
  staged=0; shift
```

The only "special" option to `gg` is the `-A` borrowed from `git add`. If given, we set `staged` to 0 as though `git diff` had indicated that nothing is staged. This will cause the logic below to stage everything using, naturally, `git add -A`.

```bash
  else
    opts+=("$1"); shift
  fi
done
```

Finally, all other options are [added](http://wiki.bash-hackers.org/syntax/arrays#storing_values) to the `opts` array.

```bash
if (( $# > 0 )); then
  opts+=(-m "$*")
fi
```

Since we used [`shift`](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_09_07.html) to remove all of the parsed options as we went, what's left now is just the commit message, if given. `$#` is the number of arguments, and `(( $# > 0 ))` performs an [arithmetic comparison](http://tldp.org/LDP/abs/html/dblparens.html) to check if `$#` is greater than zero, in which case we add an `-m` option along with _all remaining arguments_ as one.

Generally you _do not_ want to use `$*`, as it gives you everything as one string. Most often, `$@` should be used instead, as it gives an array of arguments, with `"$@"` expanding to each argument as if individually quoted, preserving any spaces. [See here for details.](http://wiki.bash-hackers.org/scripting/posparams#mass_usage) However, in this case, everything as one string is exactly what we want.

Note: `$*` normally joins arguments with a space, but this is dependent [on the `IFS` variable](https://unix.stackexchange.com/a/120578).

```bash
if [[ $staged == 0 ]]; then
  git add -A || return
```

The `staged` variable from before should now be `0` if either there are no staged changes or `-A` was given. In this case, we'll stage everything before committing. Since we're in a function and can't [`set -e`](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html) (without a subshell), a `|| return` is added to bail out if `git add` fails for whatever reason.

```bash
elif [[ $(git diff-files; git ls-files -o --exclude-standard "$(git rev-parse --show-toplevel)") ]]; then
  # Only some changes staged
  echo 'Committing only staged changes.'
fi
```

Otherwise, we're only going to commit the staged changes, so to avoid an unexpected situation where some files aren't committed because we'd forgotten something was staged, print a warning.

...but, it's also possible that _everything_ is staged. In this case, it doesn't make sense to print this warning since committing everything is the default behavior anyways. Thus, we should only show it if there are staged files _and_ either unstaged changes in the working tree or untracked files.

There isn't an easy command to check for both unstaged tracked and untracked files like `git diff`'s `--exit-code`, unfortunately. We also need this to work on new repos without any commits, which means we can't reference `HEAD`. It is also generally ill-advised to attempt to parse the output of git's so-called "porcelain", or user-facing, commands such as `git status`. One possibility, though, would be to use `git status --porcelain` [as seen here](https://stackoverflow.com/a/2658301) (despite the name, this option [per the docs](https://git-scm.com/docs/git-status#git-status---porcelainltversiongt) is intended for use by scripts).

Another option, inspired by [this SO answer](https://stackoverflow.com/a/2659808), is to use two of git's lower-level "plumbing" commands: [`diff-files`](https://git-scm.com/docs/git-diff#_raw_output_format) which compares the index (staged files) to the working tree and lists the changed (i.e. unstaged and tracked) files, and [`ls-files`](https://git-scm.com/docs/git-ls-files) with `-o` (`--others`) to list untracked files and `--exclude-standard` to apply the standard exclusions such as .gitignore files. The latter only looks in the current directory by default, so in case we're in a subdirectory, we need to pass it the repo root, obtained using [`rev-parse`](https://git-scm.com/docs/git-rev-parse). If either `diff-files` or `ls-files` outputs anything, then we know there are unstaged changes. Using double brackets, `[[ $foo ]]` [is equivalent to](https://stackoverflow.com/a/3870055) `[[ -n $foo ]]` (where `-n` [tests that](http://tldp.org/LDP/abs/html/comparison-ops.html) the string has a non-zero length) and quotes are not needed.

```bash
git commit "${opts[@]}"
```

Lastly, commit all the staged changes, [passing](http://wiki.bash-hackers.org/syntax/arrays#getting_values) along any options besides `-A`.

And that concludes my favorite bash function,

**[GG.](https://www.youtube.com/watch?v=dMfnnt6NuBw&list=PLRvds-tlTLABjrv_Q93zvD65TFUbgqOk7)**

https://giphy.com/gifs/overwatch-gg-dva-MBrmR7OrVNUVhsHt1R

_Banner image rendered in SFM by [SedimentarySocks](https://www.reddit.com/r/Overwatch/comments/46m0jm/sfm_dva_fanart/)._
