// Storage Controller

const  StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function(item) {
            let items ;

            // Check if any items in ls
            if(localStorage.getItem('items') === null) {
                items =[];
                // push new item
                items.push(item);
                // set ls
                localStorage.setItem('items',JSON.stringify(items));
            }else {
                // Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                // Push new items
                items.push(item);

                // Reset set ls
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
             let items = JSON.parse(localStorage.getItem('items'));

             items.forEach(function(item, index){
                 if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                 }
             });
             localStorage.setItem('items',JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id) {
                   items.splice(index, 1);
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data structure /state
    const data = {
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200 },
        //     // { id: 1, name: 'Cooke', calories:400 },
        //     // { id: 2, name: 'Eggs', calories: 300 },
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {

        getItems: function() {
           return data.items;
        },
        addItem: function(name, calories){
            let ID;
            // Create id
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id +1;
            }else {
                ID = 0;
            }

            // calories to number
            calories = parseInt(calories);

            // Create  a new item 
           newItem = new Item(ID, name, calories);
           
           // Add to item array
           data.items.push(newItem);

           return newItem; 
        },
        getItemById: function(id) {
            let found = null;
            // loop through items
            data.items.forEach(function(item){
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updatedItem: function(name, calories) {
            //Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            // Get index
            const index = ids. indexOf(id);

            // Remove item
            data.items.splice(index, 1);    

        }, 
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
      
            // Loop through items and add cals
            data.items.forEach(function(item){
              total += item.calories;
            });
      
            // Set total cal in data structure
            data.totalCalories = total;
      
            // Return total
            return data.totalCalories;
          },
        logData: function() {
            return data;
        }
    }

})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        inputItemName: '#item-name',
        inputItemCalories: '#item-calories',
        totalCalories: '.total-calories'


    }

    // Public method
    return {
        populateItemList: function(items) {
            let html= '';

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class=" edit-item fa fa-pencil"></i>
                </a>
              </li>
              `;
            });

            // insert list Item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.inputItemName).value,
                calories: document.querySelector(UISelectors.inputItemCalories).value
            }
        },
        addLisItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HtML
            li.innerHTML = ` <strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class=" edit-item fa fa-pencil"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`). innerHTML = `<strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class=" edit-item fa fa-pencil"></i>
                    </a>`;
                }   
            });
        },
        clearInputField: function() {
            document.querySelector(UISelectors.inputItemName).value = '';
            document.querySelector(UISelectors.inputItemCalories).value = '';

        },
        addItemToForm: function() {
            document.querySelector(UISelectors.inputItemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.inputItemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();   
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into Array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditstate: function(){
            UICtrl.clearInputField();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }

    }
    
})();



// App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
    // LoadEventListener
    const LoadEventListneres = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        //Add item  event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

         //Delete item event
         document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);


        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditstate);

         //Cleare item event
         document.querySelector(UISelectors.clearBtn).addEventListener('click',ClearAllItemsClick);


    }

    // Add item sumbit
    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();

        //Cheack for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addLisItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInputField();
        }

        e.preventDefault();
    }

    // Click Edit item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
           //Get list item id(item-0,item-1)
           const listId = e.target.parentNode.parentNode.id;
           
           // breake into array
           const listArr = listId.split('-')
           
           // Get the actual id
           const id = parseInt(listArr[1]);

           //Get item
           const itemToEdit = ItemCtrl.getItemById(id);
           
           // set Current item
           ItemCtrl.setCurrentItem(itemToEdit);

           //Add item to form
           UICtrl.addItemToForm();
        }
    
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item 
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditstate();


        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function(e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delte form data structure
        ItemCtrl.deleteItem(clientInformation);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

         // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //Add total calories to UI
         UICtrl.showTotalCalories(totalCalories);

         // Delete from local Storage
         StorageCtrl.deleteItemFromStorage(currentItem.id);
 
         UICtrl.clearEditstate();
 

        e.preventDefault();
    }

    // Clear items event
    const ClearAllItemsClick = function() {
        // Delete all items from dataStructure
        ItemCtrl.clearAllItems();

        //  // Get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //Add total calories to UI
         UICtrl.showTotalCalories(totalCalories);
 
        //Remove from UI
        UICtrl.removeItems();

        // Clear from local Storage
        StorageCtrl.clearItemsFromStorage();

        // Hide the ul
        UICtrl.hideList();
    } 

    // Public methods
    return {
        init: function() {

            //clear edit  state set intiate set
            UICtrl.clearEditstate();

            // Featch item from data structure
            const items = ItemCtrl.getItems();

            // Cheack if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else {
                  //Populate list with items
                 UICtrl.populateItemList(items);
            }

              // Get total calories
              const totalCalories = ItemCtrl.getTotalCalories();
              //Add total calories to UI
              UICtrl.showTotalCalories(totalCalories);
  

            // Load Event listeners
            LoadEventListneres()
        }
    }
})(ItemCtrl,StorageCtrl, UICtrl);

// Intializing App
App.init();