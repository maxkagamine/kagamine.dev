---
title: 揺るぎ無き力で変更を取り消す！GitのFUS RO DAHコマンド
date: 2018-05-14T21:52-0400
---

ミルク飲みのように`git clean`を使わないで、真のノルドのように変更を取り消して！

はい、私のターミナルはサウンドエフェクトがある。

<!-- end -->

https://youtu.be/5sENmFKr7SA

その関数：

```bash
fus() {
  # https://kagamine.dev/ja/fus-ro-dah/
  if [[ $* =~ ^ro\ dah ]]; then
    git nuke && sweetroll --sfx fusrodah
  else
    ( cd "$(git rev-parse --show-toplevel)" && # git cleanはカレントディレクトリで動作する
      git reset --hard && git clean -fd && sweetroll --sfx fus )
  fi
  sweetroll $?
}
```

これは一般的な`git nuke`というエイリアスから始まる (英語でnukeとは原爆ですがこの使い方はつまり[リポジトリにこうする](https://www.youtube.com/watch?v=jar1LTxxAeM)と想像してね)。私のは`git reset --hard && git clean -fdx -e _stuff`です：

- [`git reset`](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E3%83%AA%E3%82%BB%E3%83%83%E3%83%88%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E8%A9%B3%E8%AA%AC)は現在のブランチのHEADが指定されたコミットを指すようにする。デフォルトのコミットはHEADなのでそれだけが何もしないけど、
- `--hard`はHEADでインデックスと作業ディレクトリを上書きしてすべての監視対象のファイルの変更を取り消す。その後、
- [`git clean -fd`](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E4%BD%9C%E6%A5%AD%E3%81%AE%E9%9A%A0%E3%81%97%E3%81%8B%E3%81%9F%E3%81%A8%E6%B6%88%E3%81%97%E3%81%8B%E3%81%9F)は追跡していないファイルもディレクトリ（`-d`）も削除する。
- `-x`オプションを使うと、gitignoreされているファイルも削除されるし、クローンしたばかりのようなきれいなリポジトリになる。でも、私が守りたいディレクトリがあるから、
- `-e _stuff`はリポジトリの一部ではない関連のファイルやアセットを保存して私のグローバルgitignoreに無視されてリポジトリのルートの_stuffというディレクトリを削除から除外する (英語で[stuffとは](http://talking-english.net/stuff/)物事という意味する)

小さいシャウトは同じコマンドを`-x`なしで実行する。

残りはスイートロールによって駆動される：

```text
使用：　sweetroll [終了コード]
　　　　sweetroll --sfx ＜サウンド＞
　　　　sweetroll --stat ＜名前＞

オプションが使わないと、ランダムで終了コードにふさわしい引用を出力する。
スイートロールは渡された終了コードで終了する。

--sfxオプションを使うと、指定された~/sfxのmp3を再生する。
入手可能なサウンドは：
  fus
  fusrodah
  levelup

--statオプションを使うと、＜名前＞で指定された統計をインクリメントして、
とある倍数でレベルアップのサウンドエフェクトを再生する。＜名前＞は有効な
JSONプロパティ名になる必要がある。
```

[GitHubでソースを見て](https://github.com/maxkagamine/dotfiles/blob/master/home/bin/sweetroll)。（サウンドエフェクトは[こちらです](https://github.com/maxkagamine/dotfiles/tree/master/home/sfx)）

そのレベルアップは[`core.hooksPath`を使って](https://github.com/maxkagamine/dotfiles/blob/master/home/.gitconfig)グローバルで設定される[このpost-commitフック](https://github.com/maxkagamine/dotfiles/blob/e921fdf9bd5f316d7adc46c89d6d585175ecfd06/home/git-hooks/post-commit.d/post-commit-sign-sweetroll#L24-L33)で成し遂げられました。リポジトリのフックを無効にすることを避けるために[このラッパースクリプト](https://github.com/maxkagamine/dotfiles/tree/master/home/git-hooks)が使われている。

[誰かにスイートロールを盗まれたかな？](https://www.youtube.com/watch?v=3dbE4v-u0mY&list=PLRvds-tlTLAC3z5ZuXw5ZB_p6oJc9rjpC)

https://giphy.com/gifs/dance-skyrim-brodual-TdFN7Cys1G8mOTuwfg
