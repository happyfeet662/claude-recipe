/* =========================================================
   Claude Recipe — かんたん課金（ソフトペイウォール）
   仕組み：Stripe決済リンクで購入 → 戻り先 unlock.html が
   このスクリプトの grant() を呼び、ブラウザに「読み放題パス」を保存。
   有料本文は data-paywall="シリーズ名" の要素に入れておく。
   ※静的サイト向けの簡易方式。安価な情報記事向けの想定です。
   ========================================================= */
(function () {
  var KEY = 'cr_pass_';

  function has(series) {
    try { return localStorage.getItem(KEY + series) === '1'; }
    catch (e) { return false; }
  }
  function grant(series) {
    try { localStorage.setItem(KEY + series, '1'); return true; }
    catch (e) { return false; }
  }

  // unlock.html などから使えるよう公開
  window.CRPaywall = { has: has, grant: grant };

  // 記事本文の解錠判定
  function applyGates() {
    var gates = document.querySelectorAll('[data-paywall]');
    for (var i = 0; i < gates.length; i++) {
      var series = gates[i].getAttribute('data-paywall');
      if (has(series)) gates[i].classList.add('is-unlocked');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGates);
  } else {
    applyGates();
  }
})();
