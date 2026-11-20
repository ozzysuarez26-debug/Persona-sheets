/* Damage Calculator: CSV sample is Dice Damage 60 + Bonus 40 = 100. */
(function () {
  'use strict';

  var diceInput = document.getElementById('damageDice');
  var bonusInput = document.getElementById('damageBonus');
  var totalOutput = document.getElementById('damageTotal');
  var formula = document.getElementById('damageFormula');
  if (!diceInput || !bonusInput || !totalOutput || !formula) return;

  var style = document.createElement('style');
  style.textContent = '.damage-grid{display:grid;grid-template-columns:repeat(3,minmax(130px,1fr));gap:12px;align-items:end}.damage-grid input{width:100%;max-width:220px}.damage-result{display:flex;flex-direction:column;gap:4px;min-height:70px}.damage-result output{font-size:1.55rem;font-weight:700;color:var(--good);font-variant-numeric:tabular-nums}.damage-options{display:flex;flex-wrap:wrap;gap:8px 18px;margin:16px 0 0;padding:12px;border:1px solid var(--line);border-radius:8px}.damage-options legend{padding:0 6px;font-size:.85rem;color:var(--muted)}.damage-options label{display:flex;align-items:center;gap:6px;margin:0;color:var(--ink)}.damage-options input{width:18px;height:18px;accent-color:var(--accent)}.damage-formula{margin:12px 0 0;font-weight:700;font-variant-numeric:tabular-nums}@media(max-width:700px){.damage-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.damage-result{grid-column:1/-1}}';
  document.head.appendChild(style);

  function numberFrom(input) {
    var value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
  }
  function format(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  }
  function calculate() {
    var dice = numberFrom(diceInput);
    var bonus = numberFrom(bonusInput);
    var total = dice + bonus;
    totalOutput.textContent = format(total);
    formula.textContent = 'Total Damage = Dice Damage (' + format(dice) + ') + Bonus (' + format(bonus) + ') = ' + format(total);
  }
  diceInput.addEventListener('input', calculate);
  bonusInput.addEventListener('input', calculate);
  calculate();
})();
