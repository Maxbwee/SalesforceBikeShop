import { MessageContext, publish } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';

import SHOES_FILTERED_MESSAGE from '@salesforce/messageChannel/Shoes_Filtered__c';

// Delay is used so that the filter wont happen instantly
const DELAY = 350;


export default class ShoeFilter extends LightningElement {

    // Filters
    searchKey = '';
    maxPrice = 2000;

    filters = {
        searchKey: '',
        maxPrice: 2000
    }

    @wire(MessageContext)
    messageContext;

    // Handles words entered by the user into the search bar
    handleSearchKeyChange(event){
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }

    // Handles the price change on the slider 
    handleMaxPriceChange(event){
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }


    // Method that publishes the message channel to be used in other components
    delayedFireFilterChangeEvent(){
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            publish(this.messageContext, SHOES_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);

    }
}