/*
 * Category controller
 */

function buildInitialCategoryTree() {
    //first reset category tree, this method should be as idempotent as we can make it
    categoryTree = {};
    addCategoriesToCategoryTree();
}

function updateCategoryTree() {
    //reset item counts
    resetItemCountsAndRemoveItemsFromTree();
    //add items to tree (updating category counts)
    addItemsToCategoryTree();
    //recaculate category counts
    
}

function addCategoriesToCategoryTree() {
    for (var catId in globalCategories) {
        var c = globalCategories[catId];
        if (c.name == categoryNames.ROOT) {
            categoryTree[categoryNames.ROOT] = c;
            continue; //ignore the root node
        }
        
        //add category as child of parents
        for (var pid in c.parents) {
            var parentName = c.parents[pid];
            var n = categoryTree[parentName];
            n.children.push(c.name);
        }
        
        //finally add reference to the categoryTree
        categoryTree[c.name] = c;
    }
}

function addItemsToCategoryTree() {
    for (var i in player.globalInventory.itemQuantityCollection) {
        var itemQuantity = player.globalInventory.itemQuantityCollection[i];
        var categories = itemQuantity.item.categories;
        for (var catId in categories) {
            //TODO: need to check for existing items
            //TODO: need to update category counts
            categoryTree[categories[catId]].children[itemQuantity.item.name] = itemQuantity.quantity;
        }
    }
}

function resetItemCountsAndRemoveItemsFromTree() {
    //walk the tree, set everything to 0
    for (var n in categoryTree) {
        for (var c in n.children) {
            if (n.children[c].type != "Category") {
                debugger; //check if this works
                n.children.splice(c,1);
            }
            n.count = 0;
        }
    }
}