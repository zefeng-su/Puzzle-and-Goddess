$(() => {
    
    const cardArray = [
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'red', img: 'img/red.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'green', img: 'img/green.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
        {name: 'blue', img: 'img/blue.png'},
    ]

    let cardChosenName = [];
    let cardChosenID = [];

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
    };

    createBoard(cardArray); 

})