$(function () { // Same as document.addEventListener("DOMContentLoaded"...


  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};



(function (global) {

var dc = {};

var mycats ="" ;
var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "data/cats.json" ;
  //"https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl = 'data/menu_items_new.json' ;
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";
var currentCategory = '' ;
var aboutHtml = 'snippets/about-snippet.html' ;

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// Remove the class 'active' from home and switch to Menu button

var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") == -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};


// this is the more involved function to choose which of the menu items to turn off 
// and on
var switchItemMenuToActive = function (itemNum) {
  // Remove 'active' from all buttons
  var classes ="" ;
  classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;
  classes = document.querySelector("#navMenuButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navMenuButton").className = classes;
  classes = document.querySelector("#navAboutButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navAboutButton").className = classes;

  switch (itemNum) {
    case 0 :
      classes = document.querySelector("#navHomeButton").className;
      if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navHomeButton").className = classes;
      }
      break ;
    case 1 :
      classes = document.querySelector("#navMenuButton").className;
      if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
      }
      break ;
    case 2 :
      classes = document.querySelector("#navAboutButton").className;
      if (classes.indexOf("active") == -1) {
        classes += " active";
        document.querySelector("#navAboutButton").className = classes;
      }
      break ;
    default :
      classes = document.querySelector("#navHomeButton").className;
      if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navHomeButton").className = classes;
      }
      break ;
  
    
  };

  
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
switchItemMenuToActive(0);
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
  
};

// Load the menu categories view
dc.loadAboutPage = function () {
  showLoading("#main-content");
  switchItemMenuToActive(2);
  $ajaxUtils.sendGetRequest(
    aboutHtml, function(responseText){
    document.querySelector("#main-content").innerHTML = 
    responseText ;
    },false) ; 
  
};


// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (categoryShort) {

  console.log ("Loading : "+categoryShort) ;
  showLoading("#main-content");
  currentCategory = categoryShort ;
  $ajaxUtils.sendGetRequest(
    menuItemsUrl,
    buildAndShowMenuItemsHTML);
};


// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          //switchMenuToActive();
          switchItemMenuToActive(1);

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
          mycats = categories ;
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
          switchItemMenuToActive(1);
          
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(acategoryMenuItems, 
                                menuItemsTitleHtml,
                                menuItemHtml) {
  console.log(mycats) ;
  console.log(acategoryMenuItems);
  console.log(currentCategory) ;
  const curitems = acategoryMenuItems.filter (obj => {
    return (obj.category === currentCategory) ;
  }) ; 
  const curcat = mycats.filter (obj =>{
    return (obj.short_name===currentCategory) ;
  }) ;        
  console.log(curitems);
  console.log(curcat.length);                 
  //categoryMenuItems = {"menu_items":acategoryMenuItems,"category":mycats[1]};
	categoryMenuItems = {"menu_items":curitems,"category":curcat[0]} ;
  console.log("category name "+categoryMenuItems.category.name) ;
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_0",
                      menuItems[i].price_0);
    html = insertItemPortionName(html, "meat_0",
                    menuItems[i].meat_0) ;

    html = insertItemPrice_1(html,
                      "price_1",
                      menuItems[i].price_1);
    
    html = insertItemPortionName(html, "meat_1",
                      menuItems[i].meat_1) ;
    html =
      insertItemPrice_1(html,
                            "price_2",
                            menuItems[i].price_2);
    html = insertProperty(html,
                     "name",
                     menuItems[i].name);

    html = insertItemPortionName(html, "meat_2",
                     menuItems[i].meat_2) ;

    html = insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    // if (i % 2 != 0) {
    //   html +=
    //     "<div class='clearfix visible-lg-block visible-md-block'></div>";
    // }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


 // Appends price with '$' if price exists
function insertItemPrice(html,
  pricePropName,
  priceValue) {
// If not specified, replace with empty string
if (!priceValue) {
return insertProperty(html, pricePropName, "");;
}
//priceValue = "$" + priceValue.toFixed(2);
  // priceValue = "$"+priceValue ;
  priceValue = priceValue ;
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}

// Appends price with '$' if price exists
function insertItemPrice_1(html,
  pricePropName,
  priceValue) {
// If not specified, replace with empty string
if (!priceValue) {
return insertProperty(html, pricePropName, "");;
}
  //priceValue = "$" + priceValue.toFixed(2);
  // priceValue = "$"+priceValue ;
  priceValue = "<br>"+priceValue ;
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  // portionValue = portionValue ;
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
