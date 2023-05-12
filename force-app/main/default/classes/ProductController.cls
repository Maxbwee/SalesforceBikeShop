public with sharing class ProductController {
    

    // Filters that are used in the shoeFilter lwc
    public class Filters{
        @AuraEnabled
        public String searchKey {get; set; }
        @AuraEnabled
        public Decimal maxPrice {get; set; }
    }    

        // Method to get all the shoes from ShoeProduct Object
        @AuraEnabled(Cacheable=true scope='global')
        public static ShoeProduct__c[] getAllShoes() {
            List<ShoeProduct__c> shoes = [SELECT Id__c, Name, Price__c, Image_Url__c FROM ShoeProduct__c];
            return shoes;
        }
        
        // Method to get filtered shoes based on price and search word
        @AuraEnabled(Cacheable=true scope='global')
        public static ShoeProduct__c[] getShoesFiltered(Filters filters) {
            String key = '';
            String whereClause = '';
            Decimal maxPrice;
           List<String> criteria = new List<String>{};
            
            if (filters != null) {
                maxPrice = filters.maxPrice;

                if(!String.isEmpty(filters.searchKey)) {
                    key = '%' + filters.searchKey + '%';
                    criteria.add('Name LIKE :key');
                }
                if(filters.maxPrice >= 0) {
                    maxPrice = filters.maxPrice;
                    criteria.add('Price__c <= :maxPrice');
                }

                if(criteria.size() > 0) {
                    whereClause = ' WHERE ' + String.join(criteria, ' AND ');
                }
            }
            List<ShoeProduct__c> result = Database.query(
                'SELECT Id__c, Name, Price__c, Image_Url__c FROM ShoeProduct__c' +
                whereClause
            );
            return result;
        }
    
}