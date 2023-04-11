$(() => {
//===================================================================================================================================================
// 1. To define a starter deck of cards.
// 2. Array to store cards. 
// 3. Each card is stored in array as an object with keys "name" & "img".
//===================================================================================================================================================
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

//empty arrays to store array elements for tracking card status   
    let cardChosenName = []; // for name of chosen cards
    let cardChosenID = []; // for push div ID of chosen cards
    let cardsFlipped = []; // for push matching card pair's name 

//===================================================================================================================================================
// 1. To define player character's stats
// 2. Player class 
// 3. Character name that can be assigned when creating new character var from Player class. Contains stats such as health, attack 
//===================================================================================================================================================
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

//===================================================================================================================================================
// 1. To store a list of enemy images and their respective names
// 2. Enemy class 
// 3. Object key 'type' contains array with objects with enemy name and their respective image path
//===================================================================================================================================================
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

// various global variables assigned with various initial gameplay stats
    const PlayerMaxHP = 100;
    let playerHP = null;
    let enemyMaxHP = 30;
    let enemycurrentHP = null;
    let playerAtk = null;
    let enemyAtk = 5;
    let stageCleared = 0;
    let highScore = 0;
    let enemyLv = 1;

//===================================================================================================================================================
// 1. To store a list of sfx and their respective filename/path
// 2. Soundlibrary class 
// 3. Object key assigned with their respective filename/path
//===================================================================================================================================================
    class Soundlibrary {
        constructor() {
            this.click = {url:'audio/click.wav'};
            this.mismatch = {url:'audio/mismatch.wav'};
            this.heal = {url:'audio/heal.wav'};
            this.atkBlue = {url:'audio/atkBlue.wav'};
            this.atkYellow = {url:'audio/atkYellow.wav'};
            this.atkRed = {url:'audio/atkRed.wav'};
            this.gameOver = {url:'audio/gameOver.wav'};
            this.allClear = {url:'audio/allClear.wav'};
            this.bgm = {url:'audio/BGMloop.mp3'};
        } 
    }

//===================================================================================================================================================
// 1. To create player when game start
// 2. Function that creates new player var from Player class
// 3. After player var is created, player health and attack from Player class is assigned to playerHP and playerAtk var, then updated to display on webpage 
// * player image is assigned in the css code under #player as the image is fixed
//===================================================================================================================================================
    const createPlayer = () => {
        const player = new Player ("Athena");
        playerHP = player.health
        playerAtk = player.attack
        $("#playerHP").text(player.health)
        $("#playerName").text(player.name);
    }

//===================================================================================================================================================
// 1. To generate random enemy when game start
// 2. Function that creates new enemy var from Player class
// 3. After enemy var is created, a random index is assigned. Enemy stats, name, images is initialized then updated to display on webpage
//===================================================================================================================================================   
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

//===================================================================================================================================================
// 1. To playback sfx
// 2. A function to play specific sound when invoked
// 3. Function creates new sound var then updates the html audio tag's src to the desired audio. When invoking playsound(); pass in parameters soundID->div ID of the html audio tag, key-> the desired sfx from the Soundlibrary class
//===================================================================================================================================================   
    const playSound = (soundID,key) => {
        let sound = new Soundlibrary();
        $(soundID).attr('src', sound[key].url);
        sound = $(soundID)[0];
        sound.load(); //prevents Uncaught (in promise) DOMException: message on chrome console...
        setTimeout(() => {
            sound.play();
        }, 10);
    }

//===================================================================================================================================================
// 1. To place card on board and distribute them randomly.
// 2. Function to populate cards stored in the cardArray then populate them randomly on the grid.
// 3. Using loop to populate card showing cardBack img on the gridboard, each card will have an unique id assigned. Calls shuffleArray function to randomize the elements in array.
//===================================================================================================================================================      
    const createBoard = (cardArray) => {
        for (let i=0; i <cardArray.length; i++) {
            const $card =  $("<img src='img/cardBack.png'>").addClass('clickable').attr('card-id', i).css("cursor", "pointer");
            $card.on("click", flipCard); //invokes flipCard function when card is clicked
            $("#grid").append($card);  
            $("#stageCleared").text(stageCleared);  
        }    
        
        //hides the various gameover screen related divs when game starts
        $("#gameover").css({'display': 'none'});
        $("#playerStatus").css({'display': 'none'});
        $("#enemyStatus").css({'display': 'none'});
        
        shuffleArray(cardArray); //comment this line out for non-random card order for quick testing
    };

    //A function to randomize order of elements in array.
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    }

//===================================================================================================================================================
// 1. To trigger Game Over
// 2. Function to trigger Game Over 
// 3. When gameOver function is called, game "UI" is hidden and gameOver related UI is displayed. Highscore gets updated if stageCleared is higher than previous highscore.
//===================================================================================================================================================     
    const gameOver = () => {
        if (stageCleared >= highScore) {
            highScore = stageCleared;
            $("#highScore").text(highScore);  
            localStorage.setItem("highScore", highScore);
        }
        playSound("#soundContainer", "gameOver");
        $("#gameover").css({'display': 'flex'});
        $("#innerContainer").find('*').css({'display': 'none'});
        $("#gameoverbtn").on("click", () => {
            location.reload();
        });
    }

//===================================================================================================================================================
// 1. Board need to reset when all cards flipped over.
// 2. Function to clear out the global scoped arrays, empty the grid then repopulate new deck all card faced down. 
// 3. global scoped let arrays reassigned as empty arrays. jquery animation used for visual feedback. #grid div empties before createBoard function is called to repopulate cards.
//===================================================================================================================================================  
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
 
//===================================================================================================================================================
// 1. To track if card is flipped or not
// 2. Function track if card is flipped
// 3. Clicked cards name and ID push to respective global empty arrays. If 2 cards are flipped, invoke checkCardMatch function to check if card matches.
//===================================================================================================================================================      
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

//===================================================================================================================================================
// 1. To check if cards flipped matches
// 2. Function to check if cards flipped matches
// 3. When function is invoked, check if cards flipped has matching pair name, if pair matchings, push matched pair to cardsFlipped array to track that cards should remain opened then invoke attackEnemy function. If pair doesn't match, player loses health, then the mismatch pair changed back to cardback img then the respective global arrays are emptied.
//===================================================================================================================================================   
    const checkCardMatch = ($card1, $card2) => {
        const card1ID = $card1.attr('card-id');
        const card2ID = $card2.attr('card-id');
        const card1Name = cardArray[card1ID].name;
        const card2Name = cardArray[card2ID].name;
    
        if (card1Name === card2Name) {
            cardsFlipped.push(cardChosenName);
            attackEnemy(card1Name, card2Name);           
        } else {
            applyBounce("#grid");
            applyShake("#playerContainer"); 
            disableClickTemp();
            playerHP -= enemyAtk;
             playSound("#soundContainer", "mismatch");    
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

        //check if player HP has fallen to 0 or less. If so invoke gameOver function
        if (playerHP <= 0) {
            gameOver();
        }
    };

//===================================================================================================================================================
// 1. To attack enemy
// 2. Function that handles all conditions on which attack type to trigger when attacking enemy
// 3. When function is invoked, check the match pair names and apply the relevant colored ATK and JqueryUI effects
//===================================================================================================================================================   
    const attackEnemy = (card1Name, card2Name) => {  
        let isGreen = false; //to track if card flipped is green pair

        if (card1Name === "blue" && card2Name === "blue") {
            enemycurrentHP -= playerAtk.blue;
            isGreen = false;
            playSound("#soundContainer", "atkBlue");
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.blue}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "yellow" && card2Name === "yellow") {
            enemycurrentHP -= playerAtk.yellow;
            isGreen = false;
            playSound("#soundContainer", "atkYellow");
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.yellow}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "red" && card2Name === "red") {
            enemycurrentHP -= playerAtk.red;
            isGreen = false;
            playSound("#soundContainer", "atkRed");
            applyShake("#enemyContainer");
            $("#enemycurrentHP").text(enemycurrentHP);
            $("#enemyStatus").text(`- ${playerAtk.red}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
        } else if (card1Name === "green" && card2Name === "green") {
            playerHP += playerAtk.green;
            isGreen = true;
            playSound("#soundContainer", "heal");
            $("#playerHP").text(playerHP);
            $("#playerStatus").text(`+ ${playerAtk.green}`).css({ 'display': 'flex',"color": "springgreen"});
            statusTextFade ("#playerStatus", 1500, 1000);
        }

        // check if all cards had been flipped. If so perform special attack then reset the board
        if(cardsFlipped.length === (cardArray.length/2)) {
            enemycurrentHP -= playerAtk.special;
            $("#enemyStatus").text(`- ${playerAtk.special}`).css({ 'display': 'flex',"color": "tomato"});
            statusTextFade ("#enemyStatus", 1500, 1000);
            //if last flipped pair of matched card is green, applyShake to enemy div with enemy image
            if (isGreen===true) { 
                applyShake("#enemyContainer");
                isGreen = false;
            }
            $("#enemycurrentHP").text(enemycurrentHP);
            playerHP += playerAtk.healXL;
            playSound("#soundContainer", "allClear");
            $("#playerHP").text(playerHP);
            $("#playerStatus").text(`+ ${playerAtk.healXL}`).css({ 'display': 'flex',"color": "springgreen"});
            statusTextFade ("#playerStatus", 1500, 1000);
            resetBoard();
        }

        //force playerHP to cap at 100 if healing exceed max HP
        if (playerHP >= PlayerMaxHP) {
            playerHP = PlayerMaxHP;
            $("#playerHP").text(playerHP)
        }

        //update stageCleared score when enemy defeated, remove the current enemy then invoke nextEnemy function to generate new enemy with new stats
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

//===================================================================================================================================================
// 1. To create new enemy when current enemy is defeated
// 2. This function creates new enemy when current enemy is defeated
// 3. When function is invoked, createEnemy is invoked to create new random enemy. The stats of enemy is updated with +1 level, then more hp and atk stats
//===================================================================================================================================================   
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

//===================================================================================================================================================
// 1. Function to disable clicking temporary to keep code DRY
// 2. This function can be invoked at neccessary states to prevent player from spam clicking when undesired
// 3. When function is invoked, it will disable left click, then enable it again after a 1sec delay
//===================================================================================================================================================   
    const disableClickTemp = () => {
        $('.clickable').off('click');

        setTimeout(() => {
            $('.clickable').on('click', flipCard);
        }, 1000);
    }

//===================================================================================================================================================
// 1. To have various functions to invoke Jquery UI effects to keep code DRY
// 2. Various functions to invoke Jquery UI effects
// 3. Refer to comments for what the parameters does. Common parameter "elementSelector" is the div ID (or class) the effect will apply to
//===================================================================================================================================================     
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

    //mode:'show'-> shows affected element after effect is played, 'hide'-> hides affected element after effect is played
    const applyFold = (elementSelector, mode) => {
        $(elementSelector).effect('fold', {
            mode: mode,
            duration: 500,
            easing: 'easeInOutCirc'
        });
    }

    //duration: a num that defines fade animation time in ms.
    //toggle: true-> toggle between fading in and fading out the selected element(s). This means that if the element is currently visible, it will fade out. 
    //And if it's currently hidden, it will fade in.
    //toggle: false-> fade in or fade out the selected element(s), depending on their current state. e.g. if element is visible before effect played, it will fade out.
    const applyFade = (elementSelector, duration, toggle) => {
        $(elementSelector).effect('fade', {
            toggle: toggle,
            duration: duration,
            easing: 'easeInOutCirc'
        });
    }
    
    //durationIn: a num that defines fadeIn time in ms
    //durationOut: a num that defines fadeOut time in ms 
    const statusTextFade = (elementSelector, durationIn, durationOut) => {
        $(elementSelector).fadeIn(durationIn, () => {
            $(elementSelector).fadeOut(durationOut);
        });
    }

//===================================================================================================================================================
// 1. To initialize the game 
// 2. Function that invokes various functions related to initializing the game at same time
// 3. Invokes createPlayer, createEnemy and CreateBoard functioon. Also get highscore and updates the highscore displayed.
//===================================================================================================================================================       
    const startGame = () => {
        createPlayer();
        createEnemy();
        createBoard(cardArray); 
        highScore = localStorage.getItem("highScore");
        $("#highScore").text(highScore);  
    }

    startGame(); //initialize the game
    
    //localStorage.clear(); //uncomment and reload page to clear localStorage for testing/demo purposes

})