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
            this.name = name;
            this.health = 100;
            this.attack = {
                blue: 5,
                yellow: 10,
                red: 15,
                special: 50,
                green: 20,
                healXL: 50,
            }  
        }
    }

    class Enemy {
        constructor() {
            this.type = [
                {name: "Werewolf", img:'img/enemy01.png'},
                {name: "Undead", img:'img/enemy02.png'},
                {name: "Dragon", img:'img/enemy03.png'},
                {name: "Vampire", img:'img/enemy04.png'},
                {name: "Succubus", img:'img/enemy05.png'},
                {name: "Ghoul", img:'img/enemy06.png'},
                {name: "Orc", img:'img/enemy07.png'},
                {name: "Serpent", img:'img/enemy08.png'},
                {name: "Anubis", img:'img/enemy09.png'},
                {name: "Bakeneko", img:'img/enemy10.png'},
            ]     
        } 
    }

    class Soundlibrary {
        constructor() {
            this.click = {url:'audio/click.wav'};
            this.match = {url:'audio/match.wav'};
              
        } 
    }

    const PlayerMaxHP = 100;
    let playerHP = null;
    let enemyMaxHP = 30;
    let enemycurrentHP = null;
    let playerAtk = null;
    let enemyAtk = 5;
    let stageCleared = 0;
    let enemyLv = 1;

    const createPlayer = () => {
        const player = new Player ("Athena");
        playerHP = player.health
        playerAtk = player.attack
        $("#playerHP").text(player.health)
        $("#playerName").text(player.name);
    }
    
    const createEnemy = () => {
        const enemy = new Enemy();
        const randomIndex = Math.floor(Math.random() * enemy.type.length);
        enemy.type = enemy.type[randomIndex];
        enemycurrentHP = enemyMaxHP;
        $("#enemyHP").text(enemyMaxHP);
        $("#enemycurrentHP").text(enemycurrentHP);
        $("#enemyName").text(enemy.type.name);
        $("#enemyLevel").text(enemyLv);
        $("#enemy").css({"background-image": `url(${enemy.type.img})`});
    };

    const playSound = (soundID,key) => {
        let sound = new Soundlibrary();
        $(soundID).attr('src', sound[key].url);
        sound = $(soundID)[0];
        sound.load();
        setTimeout(() => {
            sound.play();
        }, 10);
    }
   
    //1. To place card on board and distribute them randomly.
    //2. Function to populate cards stored in the cardArray then populate them randomly on the grid.
    //3. Using loop to populate card showing cardBack img on the gridboard, each card will have an unique id assigned. Calls shuffleArray function to randomize the elements in array.
    const createBoard = (cardArray) => {
        for (let i=0; i <cardArray.length; i++) {
            const $card =  $("<img src='img/cardBack.png'>").addClass('clickable').attr('card-id', i).css("cursor", "pointer");
            $card.on("click", flipCard);
            $("#grid").append($card);  
            $("#stageCleared").text(stageCleared);  
        }    
        
        $("#gameover").css({'display': 'none'});
        $("#playerStatus").css({'display': 'none'});
        $("#enemyStatus").css({'display': 'none'});

        shuffleArray(cardArray); //comment out for non-random card order for quick testing
    };

    //A function to randomize order of elements in array.
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    }

    const gameOver = () => {
        $("#gameover").css({'display': 'flex'});
        $("#innerContainer").find('*').css({'display': 'none'});
        $("#gameoverbtn").on("click", () => {
            location.reload();
        });
    }

    //1. Board need to reset when all cards flipped over.
    //2. Function to clear out the global scoped let arrays, empty the grid then repopulate new deck all card faced down. 
    //3. global scoped let arrays reassigned as empty arrays. jquery animation used for visual feedback. #grid div empties before createBoard function is called to repopulate cards.
    const resetBoard = () => {
        cardChosenName = [];
        cardChosenID = [];
        cardsFlipped = [];
        
        applyExplode("#grid");

        setTimeout(() => {
            $("#grid").empty(); 
            createBoard(cardArray); 
            applyFold("#grid", "show")
        }, 500);
    }
    
    const flipCard = (event) => {
        const $card = $(event.currentTarget);
        const $cardID = $card.attr('card-id');
    
        // check if card has already been flipped, if so return to prevent later lines from executing
        if ($card.hasClass('flipped')) {
            return;
        }
         
        playSound("#soundContainer", "click");
    
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
            cardsFlipped.push(cardChosenName);
            attackEnemy(card1Name, card2Name);   
            playSound("#soundContainer", "match");       
        } else {
            applyBounce("#grid");
            applyShake("#playerContainer"); 
            disableClickTemp();
            playerHP -= enemyAtk;
            $("#playerHP").text(playerHP);
            $("#playerStatus").text(`- ${enemyAtk}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#playerStatus", 1500, 1000);
            
            setTimeout(() => {
                $card1.attr('src', 'img/cardBack.png').removeClass('flipped');
                $card2.attr('src', 'img/cardBack.png').removeClass('flipped');
            }, 1000);
        }
         
        cardChosenName = [];
        cardChosenID = [];

        if (playerHP <= 0) {
            gameOver();
        }
    };


    const attackEnemy = (card1Name, card2Name) => {  
        let isGreen = false;

        if (card1Name === "blue" && card2Name === "blue") {
            enemycurrentHP -= playerAtk.blue;
            isGreen = false;
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.blue}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "yellow" && card2Name === "yellow") {
            enemycurrentHP -= playerAtk.yellow;
            isGreen = false;
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.yellow}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "red" && card2Name === "red") {
            enemycurrentHP -= playerAtk.red;
            isGreen = false;
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.red}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "green" && card2Name === "green") {
            playerHP += playerAtk.green;
            isGreen = true;
            $("#playerHP").text(playerHP);
            $("#playerStatus").text(`+ ${playerAtk.green}`).css({ 'display': 'flex',"color": "springgreen"});
            statusTextFade ("#playerStatus", 1500, 1000);
        }

        if(cardsFlipped.length === (cardArray.length/2)) {
            enemycurrentHP -= playerAtk.special;
            $("#enemyStatus").text(`- ${playerAtk.special}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
            if (isGreen===true) {
                applyShake("#enemyContainer");
                isGreen = false;
            }
            $("#enemycurrentHP").text(enemycurrentHP);
            playerHP += playerAtk.healXL;
            $("#playerHP").text(playerHP);
            $("#playerStatus").text(`+ ${playerAtk.healXL}`).css({ 'display': 'flex',"color": "springgreen"});
            statusTextFade ("#playerStatus", 1500, 1000);
            resetBoard();
        }

        //force playerHP to cap at 100
        if (playerHP >= PlayerMaxHP) {
            playerHP = PlayerMaxHP;
            $("#playerHP").text(playerHP)
        }

        if (enemycurrentHP <= 0) {
            stageCleared += 1;
            $("#stageCleared").text(stageCleared);
            applyFade("#enemyContainer", 500, false)

            setTimeout(() => {
                ("#enemyContainer").empty;    
                nextEnemy();
            }, 500);
        }    
    };

    const disableClickTemp = () => {
        $('.clickable').off('click');

        setTimeout(() => {
            $('.clickable').on('click', flipCard);
        }, 1000);
    }

    const nextEnemy = () => {
        createEnemy();
        enemyMaxHP += 10;
        enemycurrentHP = enemyMaxHP;
        enemyAtk += 1;
        enemyLv +=1;
        $("#enemyHP").text(enemyMaxHP);
        $("#enemyLevel").text(enemyLv);
        $("#enemycurrentHP").text(enemycurrentHP);
    }

    const applyShake = (elementSelector) => {
        $(elementSelector).effect('shake', {
          times: 5,
          distance: 10,
          duration: 500,
          easing: 'easeInOutCirc'
        });
    }

    const applyBounce = (elementSelector) => {
        $(elementSelector).effect('bounce', {
            times: 5,     
            distance: 10,
            duration: 500  ,
            easing: 'easeInOutCirc'
        });
    }

    const applyExplode = (elementSelector) => {
        $(elementSelector).effect('explode', {
            duration: 500,
            easing: 'easeInOutCirc'
        });
    }

    const applyFold = (elementSelector, mode) => {
        $(elementSelector).effect('fold', {
            mode: mode,
            duration: 500,
            easing: 'easeInOutCirc'
        });
    }

    const applyFade = (elementSelector, duration, toggle) => {
        $(elementSelector).effect('fade', {
            toggle: toggle,
            duration: duration,
            easing: 'easeInOutCirc'
        });
    }

    const statusTextFade = (elementSelector, durationIn, durationOut) => {
        $(elementSelector).fadeIn(durationIn, () => {
            $(elementSelector).fadeOut(durationOut);
        });
    }

    const startGame = () => {
        createPlayer();
        createEnemy();
        createBoard(cardArray); 
    }

    startGame();

})