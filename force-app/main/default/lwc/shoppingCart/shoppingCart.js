import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import CART_UPDATED_CHANNEL from '@salesforce/messageChannel/Cart_Updated__c';

export default class ShoppingCart extends LightningElement {

    // All different variables used for the shopping cart
    subscription = null;
    resetCount = 0;
    counter = 0;
    shoeName = [];
    latestShoe = '';
    shoePicture = '';
    shoePrice = 0;
    
    @wire(MessageContext)
    messageContext;
    
    // Method that triggers when the clear cart button is clicked
    // Resets the cart component
    handleDeleteFromCart(){
        this.counter = 0;
        this.shoeName = [];
        this.shoePicture = '';
        this.latestShoe = '';
        this.shoePrice = 0;
    }
    
    // Subscirbes to the message that is sent from the shoeItem
    // After the user clicks on the add to cart button
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            CART_UPDATED_CHANNEL,
            (message) => this.handleMessage(message)
          );
    }

    // Method to handle the information sent from the shoeItem.js
    handleMessage(message){
        console.log(message)
        this.resetCount = this.counter;
        if(message.operator == 'add'){
            this.counter += parseInt(message.constant);
        }
        // Variables used the shoppingcart html
         this.shoeName.push(message.shoeName);
         this.shoePicture = message.shoePicture;
         this.latestShoe = message.shoeName;
         this.shoePrice =  message.constant;
         
       console.log("Message shoeName: " + message.shoeName);
    }

    connectedCallback() {
    this.subscribeToMessageChannel();

}
}