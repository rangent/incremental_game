/*
 * Category tree menu view
 */

function initializeCategoryTreeUi() {
    buildInitialCategoryTree();
    // more...
}

function updateCategoryTreeUi() {
    updateCategoryTree();
    // more...
}

function redrawCategoryListContainer() {
    //var catDiv = $("#categoryListContainer");
    $("#categoryListContainer").empty();
    $("#categoryListContainer").append("<ul id=\"categoryList\" class=\"treeView collapsibleList\"></ul>");
    $("#categoryList").append("<li>Parent<ul><li>child<ul><li>child's child</li><li>child's child2</li></ul></li></ul></li>");
    $("#categoryList").append("<li>Parent2<ul><li>child1</li></ul></li>");
    
    //add top-level categories
    //catDiv.append("<ul class='collapsibleList'><li>test<ul><li>foo</li><li>bar</li></ul></li>");
    //catDiv.append("<li>test2<ul><li>foo</li><li>bar</li></li>");
    
    //catDiv.append("</ul>");
    
        
    //TODO MOVE THIS INTO PROPER LOCAITON
    CollapsibleLists.applyTo(document.getElementById("categoryList")); 
}