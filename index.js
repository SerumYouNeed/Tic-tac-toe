import View from "./view.js"
import Store from "./store.js"

// const App = {
//     $: {
//         menu: document.querySelector('[data-id="menu"]'),
//         menuPopover: document.querySelector('[data-id="menu-popover"]'),
//         resetBtn: document.querySelector('[data-id="reset-btn"]'),
//         newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
//         squares: document.querySelectorAll('[data-id="square"]'),
//         modal: document.querySelector('[data-id="modal"]'),
//         modalText: document.querySelector('[data-id="modal-text"]'),
//         modalBtn: document.querySelector('[data-id="modal-btn"]'),
//         turn: document.querySelector('[data-id="turn"]'),
//     },

//     state: {
//         move: [],
//     },
    
//     getGameStatus (move) {
//         const p1Moves = move.filter((moves) => moves.playerId === 1).map((moves) => +moves.squareId);
//         const p2Moves = move.filter((moves) => moves.playerId === 2).map((moves) => +moves.squareId);
        
//         const winPattern = [
//             [1,2,3],
//             [1,5,9],
//             [1,4,7],
//             [2,5,8],
//             [3,5,7],
//             [3,6,9],
//             [4,5,6],
//             [7,8,9],
//         ];
        
//         let winner = null;

//         winPattern.forEach((pattern) => {
//             const p1Wins = pattern.every((v) => p1Moves.includes(v));
//             const p2Wins = pattern.every((v) => p2Moves.includes(v));
//             if(p1Wins) winner = 1;
//             if(p2Wins) winner = 2;
//         });


//         return {
//             status: move.length === 9 || winner != null ? 'complete' : 'in-progress',
//             winner,
//         };
//     },

//     init() {
//         App.registerEventListeners();
//     },
    
//     registerEventListeners() {
//         App.$.menu.addEventListener("click", (event) => {
//             App.$.menuPopover.classList.toggle("hidden");
//         });
    
//         App.$.resetBtn.addEventListener("click", (event) => {
//             console.log('reset game');
//         });
    
//         App.$.newRoundBtn.addEventListener("click", (event) => {
//             console.log('new game');
//         });

//         App.$.modalBtn.addEventListener("click", (event) => {
//             App.state.move = [];
//             App.$.squares.forEach(square => square.replaceChildren());
//             App.$.modal.classList.add('hidden');
//         });
    
//         App.$.squares.forEach((square) => {
//             square.addEventListener("click", (event) => {
//                 // jeśli już kliknięte okienko to wychodzi
//                 const hasMove = (squareId) => {
//                     const existingMove = App.state.move.find(move => move.squareId === squareId);
//                     return existingMove !== undefined; 
//                 };
                
//                 // + upewnia że to liczba
//                 if(hasMove(+square.id)) {
//                     return;
//                 }


//                 // który gracz
//                 const lastMove = App.state.move.at(-1);
//                 const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
//                 const currentPlayer = App.state.move.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);
//                 const nextPlayer = getOppositePlayer(currentPlayer);

//                 const squareIcon = document.createElement('i');  
//                 const turnIcon = document.createElement('i'); 
//                 const turnLabel = document.createElement('p');              
//                 turnLabel.innerText = `Player ${nextPlayer}, your turn!`;

//                 if(currentPlayer === 1) {
//                     squareIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnLabel.classList = 'turquoise';
//                 } else {
//                     squareIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnLabel.classList = 'yellow';
//                 }

//                 App.$.turn.replaceChildren(turnIcon, turnLabel);

//                 // aktualizuje stan
//                 App.state.move.push({
//                     squareId: +square.id,
//                     playerId: currentPlayer,  
//                 })

//                 square.replaceChildren(squareIcon);
                
//                 const game = App.getGameStatus(App.state.move);

//                 // gdy gra się zakończy 
//                 let msg = '';
//                 if(game.status === 'complete') {
//                     App.$.modal.classList.remove('hidden');
//                     if(game.winner) {
//                         msg = `Player ${game.winner} wins!`;
//                     } else {
//                         msg = `Tie!`;
//                     }
//                     App.$.modalText.textContent = msg;
//                 }
//             });
//         });
//     },
// };

// window.addEventListener("load", App.init);

const players = [
    {
        id: 1,
        name: 'Player 1',
        iconClass: 'fa-x',
        colorClass: 'turquoise',
    },
    {
        id: 2,
        name: 'Player 2',
        iconClass: 'fa-o',
        colorClass: 'yellow',
    },
];

function init() {
    const view = new View();
    const store = new Store(players);

    // zamyka komunikat wygranej, resetuje stan,czyści planszę i ustawia gracza
    view.bindGameResetEvent(event => {
        view.closeAll();
        store.reset();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScores(store.stats.playerWithStats[0].wins, store.stats.playerWithStats[1].wins, store.stats.ties);
    })

    view.bindNewRoundEvent(event => {

    })

    view.bindPlayerMoveEvent(square => {
        const existingMove = store.game.moves.find(move => move.squareId === +square.id);

        if(existingMove) {
            return;
        }
        
        // umieszcza iconę gracza w kwadracie
        view.handlePlayerMove(square, store.game.currentPlayer);

        // zmiana gracza
        store.playerMove(+square.id);

        if(store.game.status.isComplete) {
            view.openModal(store.game.status.winner ? `${store.game.status.winner.name} wins!` : 'Tie!');

            return;
        }

        // i teraz mamy innego currentPlayer
        view.setTurnIndicator(store.game.currentPlayer);
    })

    console.log(view.$.turn);
};

window.addEventListener("load", init);