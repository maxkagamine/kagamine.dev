---
title: 'Nuke a git repo with unrelenting force: the FUS RO DAH command'
date: 2018-05-05T12:19-0400
---

`git clean` is for milk drinkers; delete your changes like a true Nord!

Yes, my terminal has sound effects.

<!-- end -->

https://youtu.be/KMKklzGifok

The function:

```bash
fus() {
  # https://kagamine.dev/en/fus-ro-dah/
  if [[ $* =~ ^ro\ dah ]]; then
    git nuke && sweetroll --sfx fusrodah
  else
    ( cd "$(git rev-parse --show-toplevel)" && # git clean operates in current dir
      git reset --hard && git clean -fd && sweetroll --sfx fus )
  fi
  sweetroll $?
}
```

This builds off the common `git nuke` alias, mine being `git reset --hard && git clean -fdx -e _stuff`:

- [`git reset`](https://git-scm.com/docs/git-reset#_description) sets the current branch head to a given commit which defaults to HEAD and thus has no effect here, but...
- `--hard` then resets the index and working tree to HEAD, nuking any changes to tracked files, after which...
- [`git clean -fd`](https://git-scm.com/docs/git-clean) removes any untracked files and (`-d`) directories, and...
- `-x` ignores all gitignores, nuking _everything_ and bringing us back to a clean repo as if just cloned, except...
- `-e _stuff` since, as a personal convention, I keep any related files/assets that aren't part of the repo in a "_stuff" directory in the repo root which is ignored by my global gitignore.

For the shorter shout, the same commands are run without `-x`.

The rest is powered by sweetrolls:

```text
Usage: sweetroll [exit code]
       sweetroll --sfx <sound>
       sweetroll --stat <name>

Without options, prints a random quote appropriate for the exit code (if any).
Sweetroll exits with whatever exit code is given.

With --sfx, plays the specified mp3 from ~/.local/share/sweetroll.
Available sounds:
  fus
  fusrodah
  levelup

With --stat, increments the stat identified by <name> and plays the levelup
sound effect on certain multiples. <name> must be a valid JSON property name.
```

[See the source on GitHub.](https://github.com/maxkagamine/dotfiles/blob/master/mods/git/.local/bin/sweetroll) (The sound effects [can be found here](https://github.com/maxkagamine/dotfiles/tree/master/mods/git/.local/share/sweetroll).)

The level up is accomplished using [this post-commit hook](https://github.com/maxkagamine/dotfiles/blob/old/home/git-hooks/post-commit.d/post-commit-sign-sweetroll#L24-L33) which is set globally [using `core.hooksPath`](https://github.com/maxkagamine/dotfiles/blob/old/home/.gitconfig#L7).

[No lollygaggin'.](https://www.youtube.com/watch?v=3dbE4v-u0mY&list=PLYooEAFUfhDfO3m_WQWkHdIB3Zh2kIXKp)

https://giphy.com/gifs/dance-skyrim-brodual-TdFN7Cys1G8mOTuwfg
