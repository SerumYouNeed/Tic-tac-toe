export default class View {
    
    $ ={};
    $$ ={};

    constructor() {
        this.$.menu = this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuPopover = this.#qs('[data-id="menu-popover"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
        this.$.turn = this.#qs('[data-id="turn"]');
        
        this.$$.squares = this.#qsAll('[data-id="square"]');
        
        // eventy tylko interfejsu, bez wpływu na stan
        this.$.menuBtn.addEventListener('click', event => {
            this.#toggleMenu();  
        });
    }

    // rejestracja wszystkich eventów

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener('click', handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener('click', handler);
    }

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach(square => {
            square.addEventListener('click', handler);
        });
    }

    // metody DOM
    // # trzyma to jako prywatne. nie ma do nich dostępu z zewnątrz.
    #toggleMenu() {
        this.$.menuPopover.classList.toggle('hidden');
        this.$.menuBtn.classList.toggle('border');

        const icon = this.$.menuBtn.querySelector('i');

        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    };

    handlePlayerMove(squareEl, player) {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', player === 1 ? 'fa-x' : 'fa-o', player === 1 ? 'yellow' : 'turquoise');
        squareEl.replaceChildren(icon);
    }

    setTurnIndicator(player) {
        const icon = document.createElement('i');
        const label = document.createElement('p');

        this.$.turn.classList.add(player === 1 ? 'yellow' : 'turquoise');        
        this.$.turn.classList.remove(player === 1 ? 'turquoise' : 'yellow');        

        icon.classList.add('fa-solid', player === 1 ? 'fa-x' : 'fa-o');

        label.innerText = player === 1 ? 'Player 1, your turn!' : 'Player 2, your turn!';

        this.$.turn.replaceChildren(icon, label);
    };

    #qs(selector, parent) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector);

        if(!el) throw new Error('Could not find element');

        return el;
    }

    #qsAll(selector) {
        const elList = document.querySelectorAll(selector);

        if(!elList) throw new Error('Could not find element');

        return elList;
    }
}; 
