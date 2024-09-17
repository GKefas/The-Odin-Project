'use strict';

const modal = document.querySelector('.dialog__container');
const form = document.querySelector('dialog__form');
const confirmBtn = document.querySelector('.dialog__btn-submit');
const newGameBtn = document.getElementById('newGame');
const playersInput = document.querySelectorAll('.dialog__input');

const playersStatusEl = document.querySelectorAll('.playerStatus');
const winnerHeading = document.querySelector('.winner-heading');
const tieEl = document.getElementById('tie');

const cells = document.querySelectorAll('.box');
const cellsContainer = document.querySelector('.gameboard-container');

///////////////////
// Gameboard

const gameBoard = function () {
  const boardState = ['', '', '', '', '', '', '', '', ''];
  const scores = [0, 0, 0]; // p1,p2,tie

  const players = [];
  let curPlayer;

  const winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];

  const clear = () => {
    boardState.forEach((_, i) => {
      boardState[i] = '';
    });
    players = [];
    curPlayer = '';
  };

  const clearBoardState = () => {
    boardState.forEach((_, i) => {
      boardState[i] = '';
    });
  };

  return { boardState, scores, players, winning, clear, clearBoardState };
};

///////////////////////
// Functions

const init = function () {
  cells.forEach(box => (box.textContent = ''));
  playersStatusEl.forEach(el => {
    el.querySelector('.scores__score').textContent = 0;
  });

  return gameBoard();
};

const getPlayersAndSetUI = function () {
  const playerNames = modal.returnValue.split(',');
  const players = playerNames.map((player, i) => {
    let token = 'X';
    if (i == 1) {
      token = 'O';
    }

    return {
      name: player,
      token,
    };
  });

  gameBoardStatus.players = players;
  gameBoardStatus.curPlayer = gameBoardStatus.players[0];

  playersStatusEl.forEach((el, i) => {
    el.querySelector('.scores__name').textContent =
      gameBoardStatus.players[i].name;
  });
};

const changeActivePlayer = function () {
  let { curPlayer, players } = gameBoardStatus;
  const index = curPlayer.name === players[0]['name'] ? 1 : 0;
  gameBoardStatus.curPlayer = players[index];
  playersStatusEl.forEach(el => el.classList.remove('scores--active'));

  playersStatusEl[index].classList.add('scores--active');
};

const insertBoxUI = function (curCell) {
  const boxValueEl = document.createElement('div');
  boxValueEl.classList.add('box__value', 'set');
  boxValueEl.textContent = gameBoardStatus.curPlayer?.token;
  curCell.appendChild(boxValueEl);
};

const updateScoresUI = function (tie = true) {
  if (!tie) {
    playersStatusEl.forEach((el, i) => {
      if (el.classList.contains('scores--active')) {
        el.querySelector('.scores__score').textContent =
          gameBoardStatus.scores[i];
      }
    });
    return;
  }
  tieEl.querySelector('.scores__score').textContent = gameBoardStatus.scores[2];
};

const updateToWinState = function (tie = true) {
  if (!tie) {
    winnerHeading.textContent = `${gameBoardStatus.curPlayer.name} Won 🎉`;
  } else {
    winnerHeading.textContent = "It's a TIE";
  }
  // <span class="winner-name">George</span> Won 🎉
  winnerHeading.classList.remove('hidden');
  cellsContainer.classList.add('gameboard-win-state');
};

const removeWinState = function () {
  winnerHeading.classList.add('hidden');
  cellsContainer.classList.remove('gameboard-win-state');
  cellsContainer.addEventListener('click', gameMechanism);
  gameBoardStatus.clearBoardState();
  cells.forEach(box => (box.textContent = ''));
};

const checkWin = function () {
  const { winning, boardState, curPlayer } = gameBoardStatus;

  const tie = boardState.every(state => state !== '');
  if (tie) {
    return 'tie';
  }

  const isWin = winning.some(combination => {
    return combination.every(index => boardState[index] === curPlayer?.token);
  });

  if (isWin) {
    return 'win';
  }
};

const gameMechanism = function (e) {
  // Pick the right element
  let cell = e.target;
  if (e.target.classList.contains('box__value'))
    cell = e.target.closest('.box');

  // If it is already picked return
  if (cell.querySelector('.box__value')) return;

  // Get Index and set Token of current player
  const index = cell.getAttribute('data-index');
  gameBoardStatus.boardState[index] = gameBoardStatus.curPlayer?.token;

  // INSERT IT TO UI
  insertBoxUI(cell);

  // Check If Win
  const win = checkWin();

  if (win === 'tie') {
    gameBoardStatus.scores[2] += 1;
    updateScoresUI();
    updateToWinState();
    return cellsContainer.removeEventListener('click', gameMechanism);
  }

  if (win === 'win') {
    const index = gameBoardStatus.players.findIndex(
      el => el.name === gameBoardStatus.curPlayer.name
    );

    gameBoardStatus.scores[index] += 1;

    updateScoresUI(false);
    updateToWinState(false);
    return cellsContainer.removeEventListener('click', gameMechanism);
  }
  // Change Active Player
  changeActivePlayer();
};

///////////////////////
// MODAL && GET USERS

document.addEventListener('DOMContentLoaded', function (e) {
  modal.showModal();
});

confirmBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const names = [...playersInput].map(input => input.value);

  modal.close(names);
});

modal.addEventListener('close', getPlayersAndSetUI);

////////////////////////////
// GENERAL EVENT LISTENERS

cellsContainer.addEventListener('click', gameMechanism);
newGameBtn.addEventListener('click', removeWinState);

const gameBoardStatus = init();
