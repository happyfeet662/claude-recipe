/* =========================================================
   Claude Recipe — かんたん課金（ソフトペイウォール）
   仕組み：Stripe決済リンクで購入 → 戻り先 unlock.html が
   grant() を呼び、ブラウザに「読み放題パス」を保存。
   有料本文は data-paywall="シリーズ名" の要素に入れておく。

   ★いまは全記事を無料公開中（FREE_MODE = true）。
     Stripeが開通したら FREE_MODE を false に戻すと課金が復活します。
   ========================================================= */
(function () {
  var FREE_MODE = true;   // ← 無料公開スイッチ。課金を始めるときは false に。

  var KEY = 'cr_pass_';

  function has(series) {
    if (FREE_MODE) return true;
    try { return localStorage.getItem(KEY + series) === '1'; }
    catch (e) { return false; }
  }
  function grant(series) {
    try { localStorage.setItem(KEY + series, '1'); return true; }
    catch (e) { return false; }
  }

  // unlock.html などから使えるよう公開
  window.CRPaywall = { has: has, grant: grant };

  function addFreeBanner(gate) {
    if (gate.querySelector('.freebanner')) return;
    var b = document.createElement('div');
    b.className = 'freebanner';
    b.textContent = 'いまだけ無料公開中！ この続きも最後まで読めます。';
    gate.insertBefore(b, gate.firstChild);
  }

  // 記事本文の解錠判定
  function applyGates() {
    var gates = document.querySelectorAll('[data-paywall]');
    for (var i = 0; i < gates.length; i++) {
      var series = gates[i].getAttribute('data-paywall');
      if (has(series)) {
        gates[i].classList.add('is-unlocked');
        if (FREE_MODE) addFreeBanner(gates[i]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGates);
  } else {
    applyGates();
  }
})();
