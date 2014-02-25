String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function dice_roll(size, count) {
    var total = 0;
    for (count; count>0; count--) {
        total += Math.floor(Math.random() * size);
    }
    return total;
}

var characterApp = angular.module('characterApp', ['ngStorage']);
 
characterApp.controller('CharacterCtrl', function ($scope, $localStorage) {
    $localStorage.$reset();
    $scope.$storage = $localStorage;

    $scope.levels = [
        0, 1000, 2250, 3750, 5500, 7500, 10000, 13000, 16500, 20500,
        26000, 32000, 39000, 47000, 57000, 69000, 83000, 99000,
        119000, 143000, 175000, 210000, 255000, 310000, 375000,
        450000, 550000, 675000, 825000, 1000000];
    $scope.rolls = {};

    $localStorage.buffs = $localStorage.buffs || '';
    $localStorage.abilities = $localStorage.abilities || {
        STR: {
            id: 'STR',
            name: 'Strength',
            base: 10,
            last_roll: 0
        },
        CON: {
            id: 'CON',
            name: 'Constitution',
            base: 10,
            last_roll: 0
        },
        DEX: {
            id: 'DEX',
            name: 'Dexterity',
            base: 10,
            last_roll: 0
        },
        INT: {
            id: 'INT',
            name: 'Intelligence',
            base: 10,
            last_roll: 0
        },
        WIS: {
            id: 'WIS',
            name: 'Wisdom',
            base: 10,
            last_roll: 0
        },
        CHA: {
            id: 'CHA',
            name: 'Charisma',
            base: 10,
            last_roll: 0
        }
    }
    $localStorage.skills = $localStorage.skills || {
        INI: {
            id: 'INI',
            name: 'Initiative',
            last_roll: 0,
            roll: '1d20 + 0.5*LVL + DEX'
        }
    }

    function get_modifier(name) {
        var total = 0;
        var mods = $localStorage.buffs.split(' ');
        for (var i=0; i< mods.length; i++) {
            if (mods[i].endsWith(name)) {
                total += eval('0' + mods[i].substring(0, mods[i].length - name.length)) || 0;
            }
        }
        return total;
    }
    function get_ability_modifier(name) {
        return Math.floor(($localStorage.abilities[name].base + get_modifier(name) - 10) / 2);
    }


    function parse_roll(text) {
        var split = /^\s*(\d+)d(\d+)\s*(.*?)$/.exec(text);
        var num_dice = split[1];
        var dice_size = split[2];
        var tail = split[3];
        var total = dice_roll(dice_size, num_dice);
        var re = /(.*?)([A-Z]+)/g;
        while ((split = re.exec(tail)) !== null) {
            console.log(total);
            var modifier = 0;
            if (split[2] === 'LVL') {
                modifier = $scope.lvl;
            } else if ($localStorage.abilities[split[2]]) {
                modifier = get_ability_modifier(split[2]);
            }
            if (split[1]) {
                modifier = Math.floor(eval('0' + split[1] + modifier) || 0);
            }
            total += modifier;
        }
        return total;
    }

    $scope.roll = function(skill) {
        skill.last_roll = parse_roll(skill.roll) + get_modifier(skill.id);
    }

    $scope.update = function() {
        // Level
        for (var lvl=0; lvl<$scope.levels.length; lvl++) {
            if ($scope.levels[lvl] > $localStorage.xp) {
                break;
            }
        }
        $scope.lvl = lvl;
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

        // Defences
        var base = 10 + Math.floor(0.5 * $scope.lvl);
        $scope.ac = base + get_modifier('AC');
        $scope.fort = base + Math.max(get_ability_modifier('STR'), get_ability_modifier('CON')) + get_modifier('FORT');
        $scope.ref = base + Math.max(get_ability_modifier('DEX'), get_ability_modifier('INT')) + get_modifier('REF');
        $scope.will = base + Math.max(get_ability_modifier('WIS'), get_ability_modifier('CHA')) + get_modifier('WILL');
    }
    $scope.update();
});