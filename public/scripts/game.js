let zIndex = 100;
let prizeCard = {};

/**
 * This function pulls in the game data then 'deals' the cards.
 *
 */
function initializeGame(){
    // Get json object for game 201 (hard-coded for now).
    $.getJSON("http://localhost:8080/api/games/59f405bb51b71a62d27493ae", function(data) {

        // Initial position for Player1 hand.
        let x = -500;
        const y = 400;

        // Create player1 hand and deal cards.
        $.each(data["players"][0]["hand"], function(key, value) {
            createCard(0, value["suit"], value["valueN"], x, y);
            // If there's more cards, the next one should be shifted +90.
            x +=90;
            addCardClick(0, value["suit"], value["valueN"], -50, 230);
        });

        // create prize cards
        $.each(data["deck"]["prize"], function(key, value) {
            createCard(0, value["suit"], value["valueN"], 40, 80);
            addCardClick(0, value["suit"], value["valueN"], 40, 230);
            prizeCard = { "deck": data["deck"]["id"] ,
                "suit": value["suit"],
                "value": value["valueN"]
            };
        });

        // Create player2 hand.
        $.each(data["players"][1]["hand"], function(key, value) {
            createCard(0, value["suit"], value["valueN"], 200, 80);
            addCardClick(0, value["suit"], value["valueN"], 130, 230);
        });
    });
}

/**
 * addCardClick
 * @param {*} x
 * @param {*} suitName
 * @param {*} rankName
 * @param {*} x
 * @param {*} y
 * @param {*} z
 */
function addCardClick(i, suitName, rankName, x, y) {
    const divName = `div.card.${  suitName }.rank${  rankName}`;
    $("body").on("click", divName, (event) => {
        const bidCardPosition = $(event.currentTarget).css("transform");
        zIndex += 2;
        $(event.currentTarget).css("transform", `translate(${x}px, ${y}px)`).css("z-index", zIndex).addClass("played");
        bid(rankName, suitName);
<<<<<<< HEAD
=======
        console.log(bidCardPosition);
>>>>>>> d81e3f12d2498f6903816ea9660abf4c9b7eab55
        moveCard(divName, bidCardPosition);
    });

}

/**
 *
 * @param {any} bidCard
 * @param {any} prizeCard
 */
function bid(bidCard, suitName){
    const bidCards = {
        bidCard: {
            "deck": prizeCard["deck"],
            "suit": suitName,
            "value": bidCard
        },
        prizeCard
    };

    console.log(bidCards);
    $.ajax({
        type: "POST",
        url: "/api/games/59f405bb51b71a62d27493ae",
        data: JSON.stringify(bidCards),//JSON.stringify(bidCards),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert(data);},
        failure: function(errMsg) {
            alert(errMsg);
        }
    });

}

/**
 *  This function is used to shift the players hand cards as bids are made.
 * @param {string} oldCard 
 * @param {string} bidPosition 
 */
function moveCard(oldCard, bidPosition){
    // Get the card right of the bid card.
    let rightCard = $(oldCard).next();

    // This loop ensures the card we want to shift hasn't already been used as a bid (i.e. played).
    while (rightCard.hasClass("played")){
        rightCard = $(rightCard).next();
    }

    // Get the suit from the class and only move cards from the same hand/pile.
    const oldCardClass = $(oldCard).attr('class').replace("card ", "").replace(" rank", "").substr(0, 4);
    const rightCardClass = rightCard.attr('class').replace("card ", "").replace(" rank", "").substr(0, 4);
    
    // Get the bid card position so we can shift all the cards to that position
    const bidCardPosition = rightCard.css("transform");

    // Add logic to check the next card against played cards.
    if (oldCardClass === rightCardClass){
        $(rightCard).css("transform", bidPosition);
        moveCard(rightCard, bidCardPosition);
    }
}

/**
 *
 * @param {any} type
 * @returns
 */
function createElement(type) {
    return document.createElement(type);
}

/**
 *
 *
 * @param {any} target
 * @param {any} name
 * @param {any} listener
 */
function addListener(target, name, listener) {
    target.addEventListener(name, listener);
}

/**
 *
 *
 * @returns
 */
function check3d() {
    // I admit, this line is stealed from the great Velocity.js!
    // http://julian.com/research/velocity/
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        return false;
    }

    const transform = prefix("transform");
    const $p = document.createElement("p");

    document.body.appendChild($p);
    $p.style[transform] = "translate3d(1px,1px,1px)";

    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== "none";

    document.body.removeChild($p);

    return has3d;
}

/**
 *
 * @param {any} a
 * @param {any} b
 * @param {any} c
 * @returns
 */
function translate(a, b, c) {
    typeof has3d !== "undefined" || (has3d = check3d());

    c = c || 0;

    if (has3d) {
        return `translate3d(${  a  }, ${  b  }, ${  c  })`;
    } else {
        return `translate(${  a  }, ${  b  })`;
    }
}

const style = document.createElement("p").style;
const memoized = {};

/**
 *
 *
 * @param {any} param
 * @returns
 */
function prefix(param) {
    if (typeof memoized[param] !== "undefined") {
        return memoized[param];
    }

    if (typeof style[param] !== "undefined") {
        memoized[param] = param;
        return param;
    }

    const camelCase = param[0].toUpperCase() + param.slice(1);
    const prefixes = ["webkit", "moz", "Moz", "ms", "o"];
    let test;

    for (let i = 0, len = prefixes.length; i < len; i++) {
        test = prefixes[i] + camelCase;
        if (typeof style[test] !== "undefined") {
            memoized[param] = test;
            return test;
        }
    }
}

/**
 *
 *
 * @param {any} i
 */
function createCard(i, suitName, rankName, x, y){
    const transform = prefix("transform");

    // calculate rank/suit, etc..
    const rank = i % 13 + 1;
    const suit = i / 13 | 0;
    const z = (52 - i) / 4;

    // create elements
    const $el = createElement("div");
    const $face = createElement("div");
    const $back = createElement("div");

    // Set the suit/rank.
    $el.setAttribute("class", `card ${  suitName  } rank${  rankName}`);

    const $container = document.getElementById("container");

    $container.appendChild($el);

    // self = card
    const self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount };

    //let modules = Deck.modules;
    //let module;

    // add classes
    $face.classList.add("face");
    $back.classList.add("back");

    // add default transform
    //$el.style[transform] = translate(-z + "px", -z + "px");
    $el.style[transform] = translate(`${x  }px`, `${y  }px`);

    // add default values
    self.x = -z;
    self.y = -z;
    self.z = z;
    self.rot = 0;

    $el.appendChild($face);

    // add drag/click listeners
    // addListener($el, "mousedown", onMousedown);
    // addListener($el, "touchstart", onMousedown);

    // load modules
    // for (module in modules) {
    //     addModule(modules[module]);
    // }

    function addModule(module) {
        // add card module
        module.card && module.card(self);
    }

    function mount(target) {
        // mount card to target (deck)
        target.appendChild($el);

        self.$root = target;
    }

    function unmount() {
        // unmount from root (deck)
        self.$root && self.$root.removeChild($el);
        self.$root = null;
    }

}

