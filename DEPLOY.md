# Claude Recipe 公開手順メモ

サイトは完全な静的HTML/CSS（ビルド不要）。姉妹サイト SUBGRADE と同じ方式。

## いま決まっていること
- 公開方法：まず **GitHub Pages の github.io サブパス**で無料公開
- 想定URL：`https://happyfeet662.github.io/<リポジトリ名>/`
- 現状の仮リポジトリ名 = `claude-recipe`（サイト名・リポジトリ名は未確定。変える場合は下記「置換」参照）

## 公開までの流れ
1. GitHubで新しい空リポジトリを作成（例：`claude-recipe`）
2. このフォルダ（`04_Webサイト`）で git 初期化 → コミット → push
   ```
   git init && git add -A && git commit -m "init: Claude Recipe 雛形"
   git branch -M main
   git remote add origin git@github.com:happyfeet662/<リポジトリ名>.git
   git push -u origin main
   ```
3. GitHub の Settings → Pages で「Branch: main / root」を指定 → 保存
4. 数分後 `https://happyfeet662.github.io/<リポジトリ名>/` で公開

## 公開前チェックリスト
- [ ] サイト名を確定（「Claude Recipe」を全ファイル一括置換）
- [ ] リポジトリ名を確定し、canonical / og:url / robots.txt / sitemap.xml の `claude-recipe` を実際の名前に置換
      ```
      # 例：リポジトリ名を myrepo にする場合（フォルダ直下で実行）
      grep -rl 'claude-recipe' . --include='*.html' --include='*.xml' --include='*.txt' | xargs sed -i '' 's#/claude-recipe/#/myrepo/#g'
      ```
- [ ] about.html の運営者名・連絡先を記入
- [ ] X / note の実URL（各ページの `href="#"`）を差し替え
- [ ] AdSense：姉妹サイトと同一アカウント（ca-pub-5746304162931871）にこのサイトを「サイト追加」→承認後、各HTMLの `<head>` のローダーのコメントを外す。承認後 `ads.txt` も設置
- [ ] 記事を追加したら articles.html のグリッドと index.html の新着、sitemap.xml も更新

## 広告（AdSense）の貼り方
- 各記事の本文中と本文末に「広告スペース」枠（`.ad-slot`）を設置済み。
- AdSense承認後の手順：①各HTMLの `<head>` のローダー（`ca-pub-5746304162931871`）のコメントを外す ②`.ad-slot__box` を実際の広告タグ `<ins class="adsbygoogle" ...></ins>` ＋ `(adsbygoogle=window.adsbygoogle||[]).push({})` に置き換え ③`ads.txt` を設置。

## 有料記事（読み放題パス）の設定 — Stripe
確定申告シリーズは「1〜3が無料／4以降が有料・読み放題」。仕組みは静的サイト向けのソフト課金（購入→戻り先ページ `unlock.html` がブラウザに解錠フラグを保存→有料本文を表示）。

**セットアップ（1回だけ）：**
1. Stripe（[stripe.com](https://stripe.com)）でアカウント作成（個人事業主OK）。
2. 商品「確定申告シリーズ 読み放題パス」を作り、**Payment Link（決済リンク）**を発行（買い切り／価格は任意。記事の表示は現在 ¥980）。
3. Payment Link の設定で「支払い後のリダイレクト先」を次にする（ドメインは実際の公開URLに）：
   `https://（公開URL）/unlock.html?series=zeitax&to=articles/kakuteishinkoku-04-aoiro.html`
4. `articles/kakuteishinkoku-04-aoiro.html` 内の
   `href="https://buy.stripe.com/REPLACE_WITH_YOUR_LINK"` を、発行した決済リンクに差し替え。
5. 価格を変える場合は同ファイルの `¥980` も直す。

**仕組みのポイント：**
- 有料本文は `<div class="paywall" data-paywall="zeitax"> … <div class="paywall__body">本文</div></div>` の中。`assets/paywall.js` が解錠判定。
- **同じ `data-paywall="zeitax"` を付ければ、今後の確定申告の有料記事も1回の購入で全部読める（＝読み放題）。**
- 解錠はブラウザ（localStorage）単位。別端末では、購入後の `unlock.html?...` リンクをその端末でも開けば解錠。
- 注意：静的サイトのため厳密な保護ではない（技術的には回避可能）。安価な情報記事向けの想定。より堅くするなら Netlify/Cloudflare の関数や note マガジンへ。

## メモ
- パスはすべて相対（`assets/...`, `index.html`）。サブパス公開でもそのまま動く。
- 独自ドメインへ移行する場合は SUBGRADE と同様に CNAME を追加し、canonical等のドメインを置換。
