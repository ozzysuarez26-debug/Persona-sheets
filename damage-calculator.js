/* Damage Calculator template */
(function () {
  'use strict';

  var diceInput = document.getElementById('damageDice');
  var bonusInput = document.getElementById('damageBonus');
  var totalOutput = document.getElementById('damageTotal');
  var formula = document.getElementById('damageFormula');
  var baseOutput = document.getElementById('damageBase');

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

  var opposingConditions = {
    tarukaja: 'tarunda',
    tarunda: 'tarukaja',
    rakukaja: 'rakunda',
    rakunda: 'rakukaja'
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

    if (conditions.weakness && !conditions.mercilessCrits) damage *= 2;
    if (conditions.mercilessCrits) damage *= 3;
    if (conditions.tarukaja && !conditions.rakunda) damage *= 1.5;
    if (conditions.rakunda && !conditions.tarukaja) damage *= 1.5;
    if (conditions.rakunda && conditions.tarukaja) damage *= 2;
    if (conditions.rakukaja && !conditions.tarunda) damage *= 0.7;
    if (conditions.tarunda && !conditions.rakukaja) damage *= 0.7;
    if (conditions.tarunda && conditions.rakukaja) damage *= 0.4;

    return damage;
  }

  function updateConditionLabels() {
    document.querySelectorAll('[data-damage-condition]').forEach(function (checkbox) {
      var option = checkbox.closest('.damage-option');
      if (option) option.classList.toggle('is-active', checkbox.checked);
    });
  }

  function calculate() {
    var dice = numberFrom(diceInput);
    var bonus = numberFrom(bonusInput);
    var baseDamage = (dice * (conditions.critTech && !conditions.mercilessCrits ? 2 : 1)) + bonus;
    var total = applyModifiers(baseDamage);

    totalOutput.textContent = format(total);
    if (baseOutput) baseOutput.textContent = format(baseDamage);
    formula.textContent = 'Dice ' + format(dice) + '  ×  2  +  Bonus ' + format(bonus) + '  =  ' + format(baseDamage);

    if (conditions.critTech) formula.textContent = 'Critical / Tech: Dice ' + format(dice) + '  ×  2  +  Bonus ' + format(bonus) + '  =  ' + format(baseDamage);
    if (total !== baseDamage) formula.textContent += '  →  Modified total ' + format(total);

    updateConditionLabels();
  }

  document.querySelectorAll('[data-damage-condition]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var condition = checkbox.dataset.damageCondition;
      conditions[condition] = checkbox.checked;

      if (checkbox.checked && opposingConditions[condition]) {
        var opposite = opposingConditions[condition];
        conditions[opposite] = false;
        document.querySelectorAll('[data-damage-condition]').forEach(function (otherCheckbox) {
          if (otherCheckbox.dataset.damageCondition === opposite) {
            otherCheckbox.checked = false;
          }
        });
      }

      calculate();
    });
  });

  diceInput.addEventListener('input', calculate);
  bonusInput.addEventListener('input', calculate);

  calculate();
})();
