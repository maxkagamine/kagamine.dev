---
title: 揺るぎ無き力でGitの変更を消す！ Fus Ro Dahコマンド
date: 2018-05-14T21:52-0400
---

ミルク飲みのように`git clean`を使わないで、真のノルドのように変更を消す！（警告：たくさんのスカイリムの引用と下手な日本語がある）

<!-- end -->

**※音量を上げてください**

https://youtu.be/6uxOwzALvcc

## 当ててやろうか？　誰かにスイートロールを盗まれたかな？

```bash
fus() {
	if [[ $* =~ ^ro\ dah ]]; then
		git nuke && sweetroll --sfx fusrodah
	else
		( cd "$(git rev-parse --show-toplevel)" && # git cleanはカレントディレクトリで動作する
			git reset --hard && git clean -fd && sweetroll --sfx fus )
	fi
	sweetroll $?
}
```

これは一般的な`git nuke`というエイリアスから始まります (ここで、nukeとは[エクスプロージョン](https://www.youtube.com/watch?v=jar1LTxxAeM)のような意味です)。私のは`git reset --hard && git clean -fdx -e _stuff`です：

- [`git reset`](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E3%83%AA%E3%82%BB%E3%83%83%E3%83%88%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E8%A9%B3%E8%AA%AC)は現在のブランチのHEADが指定されたコミットを指すようになります。HEADがデフォルトのでこれは何もしませんけど、
- `--hard`はHEADでインデックスと作業ディレクトリを上書きしてすべての監視対象のファイルの変更を削除します。その後で、
- [`git clean -fd`](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%83%84%E3%83%BC%E3%83%AB-%E4%BD%9C%E6%A5%AD%E3%81%AE%E9%9A%A0%E3%81%97%E3%81%8B%E3%81%9F%E3%81%A8%E6%B6%88%E3%81%97%E3%81%8B%E3%81%9F)は追跡していないファイルと（`-d`）ディレクトリを削除します。
- `-x`オプションを使うと、gitignoreが無視されて全部が消されて、クローンしたばかりのようにきれいリポジトリになります。でも、私が削除したくないディレクトリがありますから、
- `-e _stuff`は私がリポジトリの一部じゃない関連ファイルとアセットを保存するリポジトリのルートの_stuffというディレクトリを削除から除外します (英語の[stuffとは](http://talking-english.net/stuff/)物事という意味です)。そのディレクトリは普通に私のグローバルgitignoreに無視されます。

短いシャウトなら、同じコマンドが`-x`なしで実行されます。

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
とある倍数ならレベルアップのサウンドエフェクトを再生する。＜名前＞は有効な
JSONプロパティ名になる必要がある。
```

**[GitHubでソースを見る](https://github.com/maxkagamine/dotfiles/blob/master/home/bin/sweetroll)**。サウンドエフェクトは[こちら](https://github.com/maxkagamine/dotfiles/tree/master/home/sfx)。

そのレベルアップは[`core.hooksPath`を使って](https://github.com/maxkagamine/dotfiles/blob/master/home/.gitconfig)グローバルで設定される[このpost-commitフック](https://github.com/maxkagamine/dotfiles/blob/master/home/git-hooks/post-commit.d/post-commit-sweetroll)で成し遂げられました。リポジトリのフックを無効にすることを避けるのために[このラッパースクリプト](https://github.com/maxkagamine/dotfiles/tree/master/home/git-hooks)が使われます。

…

[昔はお前みたいな冒険者だった～](https://www.youtube.com/watch?v=3dbE4v-u0mY&list=PLRvds-tlTLAC3z5ZuXw5ZB_p6oJc9rjpC)

https://giphy.com/gifs/dance-skyrim-brodual-TdFN7Cys1G8mOTuwfg
