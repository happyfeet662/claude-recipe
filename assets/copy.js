/* =========================================================
   Claude Recipe — プロンプトの「コピー」ボタン
   .prompt__copy を押すと、同じカード内の .prompt__text を
   クリップボードにコピーします。
   ========================================================= */
(function () {
  function flash(btn) {
    var original = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', original);
    btn.textContent = 'コピーしました';
    btn.classList.add('is-done');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-done');
    }, 1600);
  }

  function legacyCopy(textEl, btn) {
    try {
      var range = document.createRange();
      range.selectNodeContents(textEl);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      flash(btn);
    } catch (e) { /* noop */ }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.prompt__copy');
    if (!btn) return;
    var box = btn.closest('.prompt');
    if (!box) return;
    var textEl = box.querySelector('.prompt__text');
    if (!textEl) return;
    var text = textEl.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(btn); }, function () { legacyCopy(textEl, btn); });
    } else {
      legacyCopy(textEl, btn);
    }
  });
})();
