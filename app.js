$(() => {
    //1. To define starter deck of cards.
    //2. Array to store cards.
    //3. Each card is stored in array as an object with keys "name" & "img".
    const cardArray = [
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'yellow', img: 'img/yellow.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
    ]

    let cardChosenName = [];
    let cardChosenID = [];
    let cardsFlipped = [];

    class Player {
        constructor(name) {
            this.health = 100;
            this.attack = {
                blueAtk: 3,
                yellowAtk: 5,
                redAtk: 10,
                greenHeal: 20
            }  
        }
    }

    class Enemy {
        constructor() {
            this.health = 30;
            this.type = [
                {name: "Werewolf", img:'img/enemy1.png'},
                {name: "Undead", img:'img/enemy2.png'},
                {name: "Dragon", img:'img/enemy3.png'},
                {name: "Vampire", img:'img/enemy4.png'},
            ]   
        } 
    }

    let playerHP = null;
    let enemycurrentHP = null;

    const createPlayer = () => {
        const player = new Player ("Athena");
        playerHP = player.health
        $("#playerHP").text(player.health)
    }
    
    const createEnemy = () => {
        const enemy = new Enemy();
        const randomIndex = Math.floor(Math.random() * enemy.type.length);
        enemy.type = enemy.type[randomIndex];
        enemycurrentHP = enemy.health;
        $("#enemyHP").text(enemy.health);
        $("#enemycurrentHP").text(enemycurrentHP);
        $("#enemyName").text(enemy.type.name);
        $("#enemy").css({"background-image": `url(${enemy.type.img})`});
    };

   
    //1. To place card on board and distribute them randomly.
    //2. Function to populate cards stored in the cardArray then populate them randomly on the grid.
    //3. Using loop to populate card showing cardBack img on the gridboard, each card will have an unique id assigned. Calls shuffleArray function to randomize the elements in array.
    const createBoard = (cardArray) => {
        for (let i=0; i <cardArray.length; i++) {
            const $card =  $("<img src='img/cardBack.png'>").attr('card-id', i).css("cursor", "pointer");
            $card.on("click", flipCard);
            $("#grid").append($card);  
         }    

        shuffleArray(cardArray);
    };

    //A function to randomize order of elements in array.
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    }

    //1. Board need to reset when all cards flipped over.
    //2. Function to clear out the global scoped let arrays, empty the grid then repopulate new deck all card faced down. 
    //3. global scoped let arrays reassigned as empty arrays. jquery animation used for visual feedback. #grid div empties before createBoard function is called to repopulate cards.
    const resetBoard = () => {
        cardChosenName = [];
        cardChosenID = [];
        cardsFlipped = [];
        $("#grid").effect('explode', {
            duration: 500,
            easing: 'easeInOutCirc'
        });

        setTimeout(() => {
            $("#grid").empty(); 
            createBoard(cardArray); 

            $("#grid").effect('fold', {
                mode: 'show',
                duration: 500,
                easing: 'easeInOutCirc'
            });
        }, 500);
    }
    
    const flipCard = (event) => {
        const $card = $(event.currentTarget);
        const $cardID = $card.attr('card-id');
    
        // check if card has already been flipped, if so return to prevent later lines from executing
        if ($card.hasClass('flipped')) {
            return;
        }
    
        cardChosenName.push(cardArray[$cardID].name);
        cardChosenID.push($cardID);
        $card.attr('src', cardArray[$cardID].img);
    
        // mark card as flipped
        $card.addClass('flipped');
    
        if (cardChosenName.length === 2) {
            const $card1 = $(`img[card-id=${cardChosenID[0]}]`);
            const $card2 = $(`img[card-id=${cardChosenID[1]}]`);
            checkCardMatch($card1, $card2);   
        }
    };

    const checkCardMatch = ($card1, $card2) => {
        const card1ID = $card1.attr('card-id');
        const card2ID = $card2.attr('card-id');
        const card1Name = cardArray[card1ID].name;
        const card2Name = cardArray[card2ID].name;
    
        if (card1Name === card2Name) {
            //alert("a match!")
            cardsFlipped.push(cardChosenName);
            attackEnemy(card1Name, card2Name);
            //onsole.log(cardsFlipped)
        } else {
            //alert("not a match!")
            $("#grid").effect('bounce', {
                times: 5,     
                distance: 10,
                duration: 500  ,
                easing: 'easeInOutCirc'
            });
            $("#playerContainer").effect('shake', {
                times: 5,     
                distance: 10,
                duration: 500  ,
                easing: 'easeInOutCirc'
            });

            playerHP -=5;
            $("#playerHP").text(playerHP);
            
            setTimeout(() => {
                $card1.attr('src', 'img/cardBack.png').removeClass('flipped');
                $card2.attr('src', 'img/cardBack.png').removeClass('flipped');
            }, 1000);
        }
         
        cardChosenName = [];
        cardChosenID = [];

        if(cardsFlipped.length === 10) {
            resetBoard();
        }
    };

    const attackEnemy = (card1Name, card2Name) => {  
        if (card1Name === "blue" && card2Name === "blue") {
          enemycurrentHP -= 3;
          $("#enemyContainer").effect('shake', {
                times: 5,     
                distance: 10,
                duration: 500  ,
                easing: 'easeInOutCirc'
            });
          $("#enemycurrentHP").text(enemycurrentHP);
        } else if (card1Name === "yellow" && card2Name === "yellow") {
          enemycurrentHP -= 5;
          $("#enemyContainer").effect('shake', {
            times: 5,     
            distance: 10,
            duration: 500  ,
            easing: 'easeInOutCirc'
        });
          $("#enemycurrentHP").text(enemycurrentHP);
        } else if (card1Name === "red" && card2Name === "red") {
          enemycurrentHP -= 10;
          $("#enemyContainer").effect('shake', {
            times: 5,     
            distance: 10,
            duration: 500  ,
            easing: 'easeInOutCirc'
        });
          $("#enemycurrentHP").text(enemycurrentHP);
        } else if (card1Name === "green" && card2Name === "green") {
            playerHP  += 20;
            $("#playerHP").text(playerHP)
        }

        //force playerHP to not exceed 100
        if (playerHP >= 100) {
            playerHP = 100;
            $("#playerHP").text(playerHP)
        }
    };

    createPlayer();
    createEnemy();
    createBoard(cardArray); 

})