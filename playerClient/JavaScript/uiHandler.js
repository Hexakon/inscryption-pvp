import * as Card from './cards.js';
import * as Main from './main.js';

export class UIHandler{
    handHTMLHandle = null;
    cardPlacementSlotsHTMLHandle = null;
    currentCardSelected = null;
    currentDisplayedCard = null;
    cardWasPlayed = false;
    constructor(handHTMLHandle,cardPlacementSlotsHandle){
        this.handHTMLHandle = handHTMLHandle;
        this.cardPlacementSlotsHTMLHandle = cardPlacementSlotsHandle;
    }

    drawDropZones(){
        Main.clearElement(this.cardPlacementSlotsHTMLHandle);
        for(let i in [1,2,3,4]){
            let div =  document.createElement('div');
            div.setAttribute('class','cardSlot');
            this.cardPlacementSlotsHTMLHandle.appendChild(div);
        }

    }

    activateDropZone(){
        for(let i in this.cardPlacementSlotsHTMLHandle.children){
            let el = this.cardPlacementSlotsHTMLHandle.children[i];
            if(el.tagName == 'DIV' && !el.hasChildNodes()){
                el.style.transform = 'scale(1.1)';
                el.onpointerover = () =>{
                    el.style.border = '10px solid rgb(220, 220, 220)';
                    el.style.transform = 'scale(1.3)';
                }
                el.onpointerout = () =>{
                    el.style.transform = 'scale(1.1)'; 
                    el.style.border = '';
                }
                el.onpointerdown = this.playedCard;
            }
            
        }
    }

    disableDropZone(){
        for(let i in this.cardPlacementSlotsHTMLHandle.children){
            let el = this.cardPlacementSlotsHTMLHandle.children[i];
            if(el.tagName == 'DIV'){
                el.style.transform = ''; 
                el.style.border = '';
                el.onpointerout = null;
                el.onpointerover = null;
                el.onpointerdown = null;
            }
            
        }
    }

    drawHand(cards){
        Main.clearElement(this.handHTMLHandle)
        for(let i in cards){
            this.handHTMLHandle.appendChild(Card.getCardDiv(i));
        }
    }

    selectedCard(card){
        //animate card klicked
        let pos = Main.getOffset(card); //get pos from original element to use for display animation
        let copy = card.cloneNode(true); //clones card element to create a display copy
        copy.setAttribute('class','highlightCard'); //setting som attributes for display element
        document.body.appendChild(copy);
        copy.setAttribute('ogLeft',pos.left);
        copy.setAttribute('ogTop',pos.top);
        copy.style.left = pos.left + 'px';
        copy.style.top = pos.top + 'px';
        
        var animation = setInterval(() => { //used for display animation
          copy.style.left = '50%';
          copy.style.top = '50%';
          copy.style.transform = 'scale(2) translateX(-25%)';
          window.onpointerdown = ()=>{this.returnCard()}
          clearInterval(animation);
        }, 100);

        this.currentDisplayedCard = copy;  

        this.currentCardSelected = card;
        this.currentCardSelected.style.visibility = 'hidden'; //visible
        this.currentCardSelected.style.margin = '0 35px 0 5px';
  
        //activate drop zone
        this.activateDropZone();
    }

    returnCard(){
        
        //animation for card
        if(!this.cardWasPlayed){
            console.log("returned card")  
            this.currentDisplayedCard.style.left = this.currentDisplayedCard.getAttribute('ogLeft') + 'px';
            this.currentDisplayedCard.style.top = this.currentDisplayedCard.getAttribute('ogTop') + 'px';
            this.currentDisplayedCard.style.transform = 'scale(1) translateX(0)';
    
            var animation = setInterval(() => { //used for display animation
                document.body.removeChild(Main.getUIHandler().currentDisplayedCard)
                window.onpointerdown = null;
                this.currentCardSelected.style.margin ="";
                this.currentCardSelected.style.visibility = ''; //visible
                this.currentDisplayedCard = null;
                this.currentCardSelected = null;
                clearInterval(animation);
              }, 200);
        }
        
        //deactivate dropzone
        this.disableDropZone();
    }

    playedCard(){
        Main.getUIHandler().cardWasPlayed = true;
        let displayCard = Main.getUIHandler().currentDisplayedCard;
        let selectedCard = Main.getUIHandler().currentCardSelected;
        let pos = Main.getOffset(this); 
        displayCard.style.left = pos.left +'px';
        displayCard.style.top = pos.top + 'px';
        displayCard.style.transform = '';
        Main.getUIHandler().currentCardSelected.style.show = 'none';

        Main.getUIHandler().disableDropZone();

        var animation = setInterval((el = this,dispCard = displayCard,card = selectedCard) => { //used for display animation
            el.onpointerdown = null;
            window.onpointerdown = null;
            document.body.removeChild(dispCard);
            card.style.visibility = '';
            card.style.margin = '';
            card.onpointerover = null;
            card.onpointerdown = null;
            card.onpointerout = null;
            el.appendChild(card);
            Main.getUIHandler().currentCardSelected = null;
            Main.getUIHandler().currentCardSelected = null;
            Main.getUIHandler().cardWasPlayed = false;
            clearInterval(animation);
          }, 150);

    }
}