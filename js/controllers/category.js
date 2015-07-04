/*
 * Category controller
 *
 * USAGE:
 * To start, run buildInitialCategoryTree();
 * Then drop something (eg: an apple), then run this handy debug statement:
 *   updateCategoryTree(); console.log(categoryTree["Food"].children["Apple"]);
 */

function buildInitialCategoryTree() {
    //first reset category tree and remove references to the tree, this method should be as idempotent as we can make it
    globalCategories = createGlobalCategories();
    categoryTree = {};
    
    addCategoriesToCategoryTree();
}

function updateCategoryTree() {
    //reset item counts
    resetCategoryTreeItemCounts();
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
            var parentCategoryNode = categoryTree[parentName];
            parentCategoryNode.children[c.name] = c;
        }
        
        //finally add reference to the categoryTree
        categoryTree[c.name] = c;
    }
}

function addItemsToCategoryTree() {
    if (DEBUG) {
        //player.availableTerrain[][].itemQuantityCollection[i] is the world's inventory
        //in debug mode it's helpful to see all of the global items
        for (var terrainArray in player.availableTerrain) {
            for (var terrain in player.availableTerrain[terrainArray]) {
                processItemQuantityCollection(player.availableTerrain[terrainArray][terrain].inventory.itemQuantityCollection);
            }
        }
        //everything else thats not a settlement (caves, etc)
        for (var i in player.internalEnvironments) {
            if (!player.internalEnvironments[i].isSettlement) {
                processItemQuantityCollection(player.internalEnvironments[i].inventory.itemQuantityCollection);
            }
        }
    }
    //player.globalInventory.itemQuantityCollection[i] is the player's "usable" inventory
    processItemQuantityCollection(player.globalInventory.itemQuantityCollection);
    for (var i in player.internalEnvironments) {
        if (player.internalEnvironments[i].isSettlement) {
            processItemQuantityCollection(player.internalEnvironments[i].inventory.itemQuantityCollection);
        }
    }
}

function processItemQuantityCollection(itemQuantityCollection) {
    for (var i in itemQuantityCollection) {
        var itemQuantity = itemQuantityCollection[i];
        var categories = itemQuantity.item.categories;
        for (var catId in categories) {
            if (itemQuantity.item.name in categoryTree[categories[catId]].children) {
                //just add the amount to the existing count
                categoryTree[categories[catId]].children[itemQuantity.item.name] += itemQuantity.quantity;
            }
            else {
                categoryTree[categories[catId]].children[itemQuantity.item.name] = itemQuantity.quantity;
            }
        }
    }
    
}

function resetCategoryTreeItemCounts() {
    //walk the tree, set everything to 0
    for (var n in categoryTree) {
        for (var c in categoryTree[n].children) {
            if (categoryTree[n].children[c].type != "Category") {
                categoryTree[n].children[c] = 0;
            }
            n.count = 0;
        }
    }
}