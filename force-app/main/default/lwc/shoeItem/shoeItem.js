import {LightningElement, wire} from 'lwc';

import getAllShoes from "@salesforce/apex/ProductController.getAllShoes";
import getShoesFiltered from "@salesforce/apex/ProductController.getShoesFiltered";
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import CART_UPDATED_CHANNEL from '@salesforce/messageChannel/Cart_Updated__c';
import SHOES_FILTERED_CHANNEL from '@salesforce/messageChannel/Shoes_Filtered__c';



export default class StaticResourceImage extends LightningElement {
  
  // Uses getAllShoes from the product controller
  // Used in the first iteration of shoeItem.html
  // Before the filter function was created
  @wire(getAllShoes) shoes;

  // Takes getShoesFiltered from the product controller to be used in shoeItem.html
  @wire(getShoesFiltered, {filters: '$filters'}) 
  filteredShoes;

  @wire(MessageContext)
  messageContext;

  // Filters JS Object to filter the shoeItem
  filters = {};

  productFilterSubscription;

  // Connected callback subscribes to the message
  // that comes from the shoeFilter message channel publish
  connectedCallback() {
    this.productFilterSubscription = subscribe(
      this.messageContext,
      SHOES_FILTERED_CHANNEL,
      (message) => this.handleFilterChange(message)
    );
  }

  // Handles the change of the search input
  handleSearchKeyChange(event){
    this.filters = {
      searchKey: event.target.value.toLowerCase() 
    }
  }
// Handles the change of the filters
  handleFilterChange(message){
    this.filters = {...message.filters};
  }
// This function is called when the user clicks
// The add to cart button
// Publishes message to the shopping cart LWC
// Payload contains all of the information that is sent to the shopping cart
  handleAddToCart(event) {
    console.log(JSON.stringify(event.target.dataset,  null, 2));
    const totalPrice = event.target.dataset.price;
    const shoeName = event.target.dataset.name;
    const shoePicture = event.target.dataset.picture;
    this.counter += totalPrice;
    const payload = {
        operator: 'add',
        constant: totalPrice,
        shoeName: shoeName,
        shoePicture: shoePicture
    };
    
    console.log("payload" + JSON.stringify(payload, null, 2));

    publish(this.messageContext, CART_UPDATED_CHANNEL, payload);
  }
}