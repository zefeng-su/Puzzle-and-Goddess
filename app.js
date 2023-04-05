$(() => {
    
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

    const createBoard = (cardArray) => {
        for (let i=0; i <cardArray.length; i++) {
            const $card =  $("<img src='img/cardBack.png'>").attr('card-id', i).css("cursor", "pointer");
            $card.on("click", flipCard);
            $("#grid").append($card);  
         }    

         shuffleArray(cardArray);
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    }

    const resetBoard = () => {
        cardChosenName = [];
        cardChosenID = [];
        cardsFlipped = [];
        $("#grid").empty(); 
        createBoard(cardArray); 
    }
    
    const flipCard = (event) => {
        const $card = $(event.currentTarget);
        const $cardID = $card.attr('card-id');
    
        // check if card has already been flipped
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
            console.log(cardsFlipped)
        } else {
            //alert("not a match!")
            $("#grid").effect('bounce', {
                times: 5,     
                distance: 10,
                duration: 500  ,
                easing: 'easeInOutCirc'
            });
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

    createBoard(cardArray); 

})