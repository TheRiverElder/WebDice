const LS_KEY = 'dice-list';

function loadDiceList() {
    let s = JSON.parse(localStorage.getItem(LS_KEY));
    return (s && s.length > 0) ? s : [{time: Date.now(), expr: '1d100', history: []}];
}

function saveDiceList(diceList) {
    localStorage.setItem(LS_KEY, JSON.stringify(diceList));
}

export {
    loadDiceList,
    saveDiceList,
}