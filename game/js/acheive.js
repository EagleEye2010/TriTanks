// Acheivements

var unlocked = {
  tanks: [],
  perks: [],
}

function acheivements() {
  if (kills >= 10 && !unlocked.tanks.includes('teal')) {
    unlocked.tanks.push('teal');
  }
  if (streak >= 3 && !unlocked.tanks.includes('white')) {
    unlocked.tanks.push('white');
  }
  if (streak >= 5 && !unlocked.perks.includes('Field Medic')) {
    unlocked.perks.push('Field Medic');
  }
  if (kills >= 50 && !unlocked.perks.includes('Sniper Rounds')) {
    unlocked.perks.push('Sniper Rounds');
  }
  if (timeSurvived >= 2 && !unlocked.perks.includes('Hollow Points')) {
    unlocked.perks.push('Hollow Points');
  }
  if (timeSurvived >= 5 && !unlocked.perks.includes('Firepower')) {
    unlocked.perks.push('Firepower');
  }
  if (timeSurvived >= 10 && !unlocked.perks.includes('Speedy Shots')) {
    unlocked.perks.push('Speedy Shots');
  }
}