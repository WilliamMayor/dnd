String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var LEVELS = [
    0,      1000,   2250,   3750,   5500,   7500, 
    10000,  13000,  16500,  20500,  26000,  32000, 
    39000,  47000,  57000,  69000,  83000,  99000,
    119000, 143000, 175000, 210000, 255000, 310000,
    375000, 450000, 550000, 675000, 825000, 1000000];

function dice_roll(count, size) {
    var total = 0;
    for (count; count>0; count--) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

var characterApp = angular.module('characterApp', ['ngStorage']);
 
characterApp.controller('CharacterCtrl', function ($scope, $localStorage) {
    $scope.$storage = $localStorage;

    function init() {
        $localStorage.buffs = $localStorage.buffs || [];
        $localStorage.temp_buffs = $localStorage.temp_buffs || '';
        $localStorage.abilities = $localStorage.abilities || {
            STR: {
                id: 'STR',
                name: 'Strength',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*STRm',
                rotate: 0
            },
            CON: {
                id: 'CON',
                name: 'Constitution',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CONm',
                rotate: 0
            },
            DEX: {
                id: 'DEX',
                name: 'Dexterity',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*DEXm',
                rotate: 0
            },
            INT: {
                id: 'INT',
                name: 'Intelligence',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*INTm',
                rotate: 0
            },
            WIS: {
                id: 'WIS',
                name: 'Wisdom',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm',
                rotate: 0
            },
            CHA: {
                id: 'CHA',
                name: 'Charisma',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CHAm',
                rotate: 0
            }
        }
        $localStorage.skills = $localStorage.skills || {
            Initiative: {
                id: 'Initiative',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*DEXm + 1*Initiative',
                rotate: 0
            },
            Acrobatics: {
                id: 'Acrobatics',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*DEXm + 1*Acrobatics',
                rotate: 0
            },
            Arcana: {
                id: 'Arcana',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*INTm + 1*Arcana',
                rotate: 0
            },
            Athletics: {
                id: 'Athletics',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*STRm + 1*Athletics',
                rotate: 0
            },
            Bluff: {
                id: 'Bluff',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CHAm + 1*Bluff',
                rotate: 0
            },
            Diplomacy: {
                id: 'Diplomacy',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CHAm + 1*Diplomacy',
                rotate: 0
            },
            Dungeoneering: {
                id: 'Dungeoneering',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm + 1*Dungeoneering',
                rotate: 0
            },
            Endurance: {
                id: 'Endurance ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CONm + 1*Endurance',
                rotate: 0
            },
            Heal: {
                id: 'Heal ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm + 1*Heal',
                rotate: 0
            },
            History: {
                id: 'History ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*INTm + 1*History',
                rotate: 0
            },
            Insight: {
                id: 'Insight ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm + 1*Insight',
                rotate: 0
            },
            Intimidate: {
                id: 'Intimidate ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CHAm + 1*Intimidate',
                rotate: 0
            },
            Nature: {
                id: 'Nature ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm + 1*Nature',
                rotate: 0
            },
            Perception: {
                id: 'Perception ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*WISm + 1*Perception',
                rotate: 0
            },
            Religion: {
                id: 'Religion',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*INTm + 1*Religion',
                rotate: 0
            },
            Stealth: {
                id: 'Stealth ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*DEXm + 1*Stealth',
                rotate: 0
            },
            Streetwise: {
                id: 'Streetwise ',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*CHAm + 1*Streetwise',
                rotate: 0
            },
            Thievery: {
                id: 'Thievery',
                last_roll: 0,
                roll: '1d20 + 0.5*LVL + 1*DEXm + 1*Thievery',
                rotate: 0
            }
        }
        $localStorage.other = $localStorage.other || {
            SPD: {
                id: 'SPD',
                name: 'Speed',
                value: '+0'
            },
            MHP: {
                id: 'MHP',
                name: 'Max Hit Points',
                value: '+0'
            },
            LVL: {
                id: 'LVL',
                name: 'Level',
                value: '+0'
            },
            SUR_PD: {
                id: 'SUR_PD',
                name: 'Surges per Day',
                value: '+0'
            },
            SUR_A: {
                id: 'SUR_A',
                name: 'Surge Amount',
                value: '+0.25*MHP'
            }
        }
        $localStorage.powers = $localStorage.powers || [
            {
                name: 'Second Wind',
                frequency: 'encounter',
                description: 'Spend a healing surge to regain hit points. You gain a +2 bonus to all defenses until the start of your next turn.',
                hide_desc: true,
                rolls: []
            }
        ]
    }

    $scope.add_roll = function(rolls) {
        rolls.push({name: '', last_roll: 0, roll: '', rotate: 0});
        console.log(1);
    }

    $scope.add_power = function() {
        $localStorage.powers.push({
            name: '',
            frequency: '',
            description: '',
            hide_desc: true,
            rolls: []
        });
    }

    $scope.add_buff = function() {
        $localStorage.buffs.push({
            value: ''
        });
    }

    $scope.reset = function() {
        $localStorage.$reset();
        init();
        $scope.update();
    }

    function get_score(name) {
        var total = 0;
        var ability_mod = false;
        if (name.endsWith('m')) {
            ability_mod = true;
            name = name.substring(0, name.length-1);
        }
        if (name in $localStorage.other) {
            total += calculate_value($localStorage.other[name].value);
        }
        var mods = $localStorage.temp_buffs.split(' ');
        for (var i=0; i<$localStorage.buffs.length; i++) {
            mods = mods.concat($localStorage.buffs[i].value.split(' '));
        }
        for (var i=0; i<mods.length; i++) {
            if (mods[i].endsWith(name)) {
                // +2DEX -1STR
                total += eval('0' + mods[i].substring(0, mods[i].length - name.length)) || 0;
            }
        }
        if (ability_mod) {
            total = Math.floor((total - 10) / 2);
        }
        console.log('score', name, total);
        return total;
    }

    function calculate_value(text) {
        /**
        Possible groups:
            DdD - dice roll, e.g. 1d20
            OD*X - multiply, e.g. +0.5*LVL
            OD*Xm - use modifier (X-10)/2, e.g. +2*CHAm
            OD - raw value, e.g. +5
        **/
        var total = 0;
        text = text.replace(/\s+/g, '');
        if (text[0] !== '-' || text[0] !== '+') {
            text = '+' + text;
        }
        var re = /([-\+][^-\+]+)/g;
        var split;
        while ((split = re.exec(text)) !== null) {
            if (split[1].indexOf('d') !== -1) {
                var dice = split[1].split('d');
                total += dice_roll(parseInt(dice[0]), parseInt(dice[1]));
            } else if (split[1].indexOf('*') !== -1) {
                var parts = split[1].trim().split('*');
                total += Math.floor(eval('0' + parts[0] + '*' + get_score(parts[1])) || 0);
            } else {
                total += parseInt(split[1]);
            }
        }
        return total;
    }

    $scope.roll = function(rollable) {
        if ($localStorage.take_ten) {
            var name = rollable.id;
            if (name in $localStorage.abilities) {
                name = name + 'm';
            }
            rollable.last_roll = 10 + Math.floor(0.5 * $scope.lvl) + get_score(name);
        } else {
            rollable.last_roll = calculate_value(rollable.roll);
        }
        rollable.rotate = (rollable.rotate + 90) % 180;
    }

    $scope.update = function() {
        // Level
        for (var lvl=0; lvl<LEVELS.length; lvl++) {
            if (LEVELS[lvl] > $localStorage.xp) {
                break;
            }
        }
        $scope.lvl = lvl;
        $localStorage.other.LVL.value = '+' + lvl; // bit hacky
        if (lvl >= 11) {
            $scope.is_paragon = true;
        } else {
            $scope.is_paragon = false;
        }
        if (lvl >= 21) {
            $scope.is_epic = true;
        } else {
            $scope.is_epic = false;
        }

        // HP
        $scope.max_hp = get_score('MHP');
        $localStorage.pc_bloodied = $localStorage.hp <= 0.5 * $scope.max_hp;

        // Surges
        $scope.surges_per_day = get_score('SUR_PD');
        $scope.surge_amount = get_score('SUR_A');
        
        // Defences
        var base = 10 + Math.floor(0.5 * $scope.lvl);
        $scope.ac = base + get_score('AC');
        $scope.fort = base + Math.max(get_score('STRm'), get_score('CONm')) + get_score('FORT');
        $scope.ref = base + Math.max(get_score('DEXm'), get_score('INTm')) + get_score('REF');
        $scope.will = base + Math.max(get_score('WISm'), get_score('CHAm')) + get_score('WILL');

        // Abilities

        // Speed
        $scope.speed = get_score('SPD');
    }
    init();
    $scope.update();
});