/*
 * Category tree menu view
 */

function initializeCategoryTreeUi() {
    buildInitialCategoryTree();
    redrawCategoryListContainer();
}

function updateCategoryTreeUi() {
    updateCategoryTree();
    redrawCategoryListContainer();
}

function redrawCategoryListContainer() {
    //var catDiv = $("#categoryListContainer");
    $("#categoryListContainer").empty();
    $("#categoryListContainer").append("<ul id=\"categoryListRoot\" class=\"treeView\"></ul>");
    $("#categoryListRoot").append(recurseTree(categoryTree[categoryNames.ROOT],false));
    //CollapsibleLists.applyTo(document.getElementById("categoryList")); 
}

/*
 * DFS of category tree
 */
function recurseTree(node, isLastChild) {
    var nodeName = node.name;
    if (node.name == categoryNames.ROOT) {
         nodeName = "<span onclick=\"CollapsibleLists.applyTo(document.getElementById('categoryList'))\">" +
            ((DEBUG) ? "!Global! Inventory" : "Inventory") + "</span>";
    }
    var s = "<li" + ((isLastChild) ? " class='lastChild'>" : ">") + nodeName;
    if (typeof node.children !== "undefined") {
        var keys = [];
        for (var key in node.children) {
            if(node.children.hasOwnProperty(key)) { //to be safe
                keys.push(key);
            }
        }
        if (keys.length > 0) {
            var ulOpen = false;
            for (var k in keys) {
                if (typeof (node.children[keys[k]].children) !== "undefined") {
                    //this node has children (not a leaf)
                    if (node.name == categoryNames.ROOT) {
                        s += "<ul id='categoryList'>";
                    }
                    else {
                        s += "<ul>";
                    }
                    s += recurseTree(node.children[keys[k]], k == keys.length - 1) + "</ul>";
                }
                else {
                    if (!ulOpen) {
                        s += "<ul>";
                        ulOpen = true;
                    }
                    //the child is a leaf, so just print the leaf:
                    //TODO: we may need to print the global library's "proper name" for the item instead of keys[k]
                    s += "<li" + ((k == keys.length - 1) ? " class='lastChild'>" : ">") + keys[k] + " (" + node.children[keys[k]] + ")</li>";
                }
            }
            if (ulOpen) {
                s += "</ul>";
                ulOpen = false;
            }
        }
    }
    s += "</li>";
    return s;
}