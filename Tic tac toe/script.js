'use strict';

const modal = document.querySelector('.dialog__container');
const form = document.querySelector('dialog__form');
const confirmBtn = document.querySelector('.dialog__btn-submit');
const playersInput = document.querySelectorAll('.dialog__input');

const cells = document.querySelectorAll('.box');
const cellsContainer = document.querySelector('.gameboard-container');

///////////////////
// Gameboard

const gameBoard = function () {
  const boardState = ['', '', '', '', '', '', '', '', ''];

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

  return { boardState, players, winning, clear };
};

///////////////////////
// Functions

const init = function () {
  cells.forEach(box => (box.textContent = ''));
  return gameBoard();
};

const getPlayersFromUI = function () {
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
};

const changeActivePlayer = function () {
  let { curPlayer, players } = gameBoardStatus;
  const index = curPlayer.name === players[0]['name'] ? 1 : 0;
  gameBoardStatus.curPlayer = players[index];
};

const insertBoxUI = function (curCell) {
  const boxValueEl = document.createElement('div');
  boxValueEl.classList.add('box__value', 'set');
  boxValueEl.textContent = gameBoardStatus.curPlayer?.token;
  curCell.appendChild(boxValueEl);
};

const checkWin = function () {
  const { winning, boardState, curPlayer } = gameBoardStatus;

  return winning.some(combination => {
    return combination.every(index => boardState[index] === curPlayer?.token);
  });

  // O (n^2)
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
  if (checkWin()) {
    cellsContainer.removeEventListener('click', gameMechanism);
    return;
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

modal.addEventListener('close', getPlayersFromUI);

////////////////////////////
// GENERAL EVENT LISTENERS

cellsContainer.addEventListener('click', gameMechanism);

const gameBoardStatus = init();
