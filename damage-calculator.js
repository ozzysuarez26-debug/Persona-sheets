/* Damage Calculator template */
(function () {
  'use strict';

  var diceInput = document.getElementById('damageDice');
  var bonusInput = document.getElementById('damageBonus');
  var totalOutput = document.getElementById('damageTotal');
  var formula = document.getElementById('damageFormula');

  if (!diceInput || !bonusInput || !totalOutput || !formula) return;

  var conditions = {
    critTech: false,
    mercilessCrits: false,
    tarukaja: false,
    rakukaja: false,
    tarunda: false,
    rakunda: false,
    weakness: false
  };

  function numberFrom(input) {
    var value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function format(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }

  function applyModifiers(baseDamage) {
    var damage = baseDamage;

    // TODO: Add your damage rules here.
    // Example:
     if (conditions.weakness) damage *= 2;
     if (conditions.tarukaja && !conditions.rakunda) damage *= 1.5;
     if (conditions.rakunda && !conditions.tarukaja) damage *= 0.5;
    

    return damage;
  }

  function calculate() {
    var dice = numberFrom(diceInput);
    var bonus = numberFrom(bonusInput);
    var baseDamage = (dice * (conditions.critTech && !conditions.mercilessCrits ? 2 : 1)) + bonus;
    var total = applyModifiers(baseDamage);

    totalOutput.textContent = format(total);
    formula.textContent =
      'Base Damage (' + format(baseDamage) +
      ') → Modified Total (' + format(total) + ')';
  }

  document.querySelectorAll('[data-damage-condition]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      conditions[checkbox.dataset.damageCondition] = checkbox.checked;
      calculate();
    });
  });

  diceInput.addEventListener('input', calculate);
  bonusInput.addEventListener('input', calculate);

  calculate();
})();
