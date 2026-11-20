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

  // Tarukaja / Tarunda (attack) and Rakukaja / Rakunda (defense) combine as ONE multiplier,
  // exactly as in the spreadsheet's IFS(...). They are not multiplied separately, because
  // some pairs cancel out (Tarukaja + Rakukaja = x1) and others are not a plain product
  // (Tarukaja + Rakunda = x2, not x2.25; Tarunda + Rakukaja = x0.4, not x0.49).
  function buffMultiplier() {
    var tarukaja = conditions.tarukaja, tarunda = conditions.tarunda;
    var rakukaja = conditions.rakukaja, rakunda = conditions.rakunda;

    if (tarukaja && rakunda) return 2;
    if (tarukaja && !rakunda && !tarunda && !rakukaja) return 1.5;
    if (rakunda && !tarukaja && !rakukaja && !tarunda) return 1.5;
    if (rakukaja && tarukaja) return 1;
    if (tarunda && rakukaja) return 0.4;
    if (tarunda && !rakukaja && !tarukaja && !rakunda) return 0.7;
    if (rakukaja && !tarunda) return 0.7;
    if (rakunda && tarunda) return 1;
    return 1;
  }

  // Same order as the spreadsheet:
  //   ( dice x critMultiplier + bonus ) x merciless x weakness x buffs, rounded DOWN.
  function totalDamage(dice, bonus) {
    // Crit/Tech doubles the dice only when it is not replaced by Merciless Crits or Weakness.
    var critMultiplier = (conditions.critTech && !conditions.mercilessCrits && !conditions.weakness) ? 2 : 1;
    var merciless = conditions.mercilessCrits ? 3 : 1;
    var weakness = (conditions.weakness && !conditions.mercilessCrits) ? 2 : 1;

    var damage = (dice * critMultiplier + bonus) * merciless * weakness * buffMultiplier();

    // Round down like the spreadsheet. The tiny extra stops decimal error (e.g. 69.99999999) from losing a point.
    return Math.floor(damage + 1e-9);
  }

  function calculate() {
    var dice = numberFrom(diceInput);
    var bonus = numberFrom(bonusInput);
    var baseDamage = Math.floor(dice + bonus);      // the spreadsheet's "Base Damage" (no multipliers)
    var total = totalDamage(dice, bonus);

    totalOutput.textContent = format(total);
    formula.textContent =
      'Base Damage (' + format(baseDamage) +
      ') → Modified Total (' + format(total) + ')';
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

/* Replace preset HP/SP +/- buttons with fields for entering exact damage amounts. */
(function () {
  'use strict';

  [['hp', 'HP'], ['sp', 'SP']].forEach(function (resource) {
    var kind = resource[0];
    var label = resource[1];
    var oldBox = document.querySelector('[data-v="' + kind + '"]');
    if (!oldBox) return;

    // Clone the container without its old click listener, which handled fixed increments.
    var box = oldBox.cloneNode(false);
    oldBox.parentNode.replaceChild(box, oldBox);

    var labelElement = box.parentNode.querySelector('.lab');
    if (labelElement) labelElement.textContent = label + ' damage';

    box.innerHTML =
      '<input class="b resource-damage" type="number" min="0" step="1" inputmode="numeric" placeholder="Amount" aria-label="' + label + ' damage amount">' +
      '<button class="b" type="button">Apply damage</button>';

    box.querySelector('button').addEventListener('click', function () {
      var amountInput = box.querySelector('input');
      var amount = Number(amountInput.value);
      var current = document.getElementById(kind + 'Cur');
      if (!current || !Number.isFinite(amount) || amount <= 0) return;

      current.value = Math.max(0, Number(current.value) - amount);
      current.dispatchEvent(new Event('input', { bubbles: true }));
      amountInput.value = '';
    });
  });
})();
