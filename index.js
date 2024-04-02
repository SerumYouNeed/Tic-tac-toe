import View from "./view.js"
import Store from "./store.js"

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
    const store = new Store('live-t3-storage-key', players);

    //zabezpieczenie przed refreshem strony
    function initView() {
        view.closeAll();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScores(store.stats.playerWithStats[0].wins, store.stats.playerWithStats[1].wins, store.stats.ties);
        view.initMoves(store.game.moves);
    };

    //dodając tego listenera można grać w kilku oknach przeglądarki
    window.addEventListener('storage', () => {
        initView();
    })

    initView();

    // zamyka komunikat wygranej, resetuje stan,czyści planszę i ustawia gracza
    view.bindGameResetEvent(event => {
        store.reset();
        initView();
    });
    
    view.bindNewRoundEvent(event => {
        // update stanu gry
        store.newRound();

        initView();
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