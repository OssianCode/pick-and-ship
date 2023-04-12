console.log("js Orders");

let users = [];
let user = [];
let userid;
let token;
let orders = [];
let order = [];
let ordersToShow = [];
let items = [];
let orderNumberSearch;
let customerSearch;
let table;
let row; // create header row
let rcell; // introduce td
let hcell; // first header
let node1;
let currentOrder;



//setDisplay("viewOrderbox", "none");
//AT THE BEGINNING CHECK USER LOGIN
if (window.sessionStorage != "undefined"){
    token = sessionStorage.getItem("token");
    userid = sessionStorage.getItem("userid");

    //Fetch logged-in user's name
    fetch('https://dummyjson.com/users/' + userid)
        .then(res => res.json())
        .then(user => setWelcomeText(user));

        //If not logged in, not valid user id found??
        //window.location.assign("index.html");

} 
// Else if no session storage then not able to log in
else {
    document.getElementById('messageBox').innerHTML = "Sorry no session storage!";
    window.location.assign("index.html");
} // END CHECK USER LOGIN

function logOut() {
    //Log out
    //console.log("logout");

    //Clear token and user if from session storage
    if (window.sessionStorage != "undefined"){
        sessionStorage.setItem("token", "");
        sessionStorage.setItem("userid", "");

        //FOR TEST
        //sessionStorage.clear();
    
        //Back to start page
        window.location.assign("index.html");
    } 
    else {
        document.getElementById('messageBox').innerHTML = "Sorry no session storage!";
        window.location.assign("index.html");
    }
} //END LOGOUT

function setWelcomeText(user){
    //console.log(user);
    document.getElementById('messageBox').innerHTML = `Logged in as ${user.firstName}`;
} // END WELCOME

//Fetch orders and call listOrdersToTable
function listOrders(){

    orderNumberSearch = document.getElementById('ordernumber').value;
    customerSearch = document.getElementById('customer').value.toLowerCase();
    //console.log("ListOrders by : " + orderNumberSearch + " "  + customerSearch);
    fetch('https://www.cc.puv.fi/~asa/cgi-bin/fetchOrders.py')
        .then(res => res.json())
        .then(orders => listOrdersToTable(orders, orderNumberSearch, customerSearch));
}

function Order(orderid, customerid, customer, deliverydate, items, itemsString, collected, 
               comment, invaddr, delivaddr, respsalesperson, totalprice){
    this.orderid = orderid;
    this.customerid = customerid;
    this.customer = customer;
    this.deliverydate = deliverydate;
    this.items = items;
    this.itemsString = itemsString;
    this.collected = collected;
    this.comment = comment;
    this.invaddr = invaddr;
    this.delivaddr = delivaddr;
    this.respsalesperson = respsalesperson;
    this.totalprice = totalprice;

}


function listOrdersToTable(orders, orderNumberSearch, customerSearch){

    clearAllBrowse();
    //console.log(`listOrdersToTable ${orders[0].orderid}`);

    // print lines to table
    for(i = 0;i < orders.length; i++){

        //ORDER NUMBER SEARCH AND CUSTOMER
        if (orderNumberSearch != "") {
            if (orders[i].orderid.startsWith(orderNumberSearch)) {
                //console.log(`Found order: ${orders[i].orderid} ${orders[i].customerid} ${orders[i].customer}`);
                //Check customer number and name
                if (customerSearch != "") {
                    if (orders[i].customerid.toLowerCase().startsWith(customerSearch) 
                    || orders[i].customer.toLowerCase().startsWith(customerSearch)) {
                        createOrderRow(orders, i);
                    }
                }
                //Else no customer search, only orderid
                else {
                    createOrderRow(orders, i);
                }

                //document.getElementById('ordersBrowse').innerHTML += `${orders[i].orderid}<br>`;
                //console.log(`ordersToShow[i] ${ordersToShow[0].orderid}` );

            }
        }
        //ONLY CUSTOMER NUMBER
        else if (customerSearch != "") {
            if (orders[i].customerid.toLowerCase().startsWith(customerSearch) 
            || orders[i].customer.toLowerCase().startsWith(customerSearch)) {

                createOrderRow(orders, i);
            }
        }
        //ELSE PRINT ALL
        else {
            createOrderRow(orders, i);
        }
    }

    //console.log(`Kaikki orderit käyty läpi ${ordersToShow.length}` );

    // Table 
    table = document.createElement("table"); // create table element


    // print lines to table
    for(i = 0;i < ordersToShow.length; i++){

        //console.log(`For ordersToShow ${i} ${ordersToShow[i].orderid}` );
        
        if (i == 0){
            row = document.createElement("tr"); // create header row
            row.className = "orderHeader";

            createTh("Order number");
            createTh("Customer id");
            createTh("Customer");
            createTh("Delivery Date");
            createTh("Items");
            createTh("Collected");
            createTh("Customer comment");
            createTh("Select");
        
            table.appendChild(row); // insert header row to table
        }

        // CREATE tr ROW
        row = document.createElement("tr"); // create row
        row.className = "order";


        createTd(ordersToShow[i].orderid);
        createTd(ordersToShow[i].customerid);
        createTd(ordersToShow[i].customer);
        createTd(ordersToShow[i].deliverydate);
        createTd(ordersToShow[i].itemsString);
        createTd(ordersToShow[i].collected);
        createTd(ordersToShow[i].comment);
        createTdButton(i);

        // Add ROW to table
        table.appendChild(row);

    }

    // print table to right div
    const element = document.getElementById("ordersBrowse");
    element.appendChild(table);

}


function createOrderRow(orders, i){

    let itemsString = "";

    /*get row items */
    for(b = 0;b < orders[i].products.length; b++){
        //console.log(`items ${b} ${orders[i].products[b].product}`);
        if (b > 0){
            itemsString += ", " + orders[i].products[b].product;
        }
        else {
            itemsString = orders[i].products[b].product;
        }
    }

    const newOrder = new Order(orders[i].orderid, 
        orders[i].customerid, 
        orders[i].customer, 
        orders[i].deliverydate, 
        orders[i].products,
        itemsString, 
        true,
        orders[i].comment,
        orders[i].invaddr,
        orders[i].delivaddr,
        orders[i].respsalesperson,
        orders[i].totalprice);

    ordersToShow.push(newOrder); 
}

function createTd(dataTxt){

    rcell = document.createElement("td"); // first td
    node1 = document.createTextNode(dataTxt); // value node
    rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   

}

//Create open-button
function createTdButton(dataTxt){

    rcell = document.createElement("td"); // first td


    let buttonElem = document.createElement("input");
    buttonElem.setAttribute("type", "button");
    buttonElem.setAttribute("class", "open");
    buttonElem.setAttribute("value", "Open");
    buttonElem.setAttribute("onclick", `openOrder(${dataTxt})`);

    rcell.appendChild(buttonElem); // add node to td
    row.appendChild(rcell); // add td to tr   */

}

function createTh(dataTxt){
    hcell = document.createElement("th"); // second header
    node1 = document.createTextNode(dataTxt); // insert text node
    hcell.appendChild(node1); // insert node to header cell
    row.appendChild(hcell); // insert header cell to header row 
}


function clearBrowse() {
    //clear browse
    document.getElementById('ordersBrowse').innerHTML = "";
}


function deleteOrdersToShow() {
    //Delete ordersToShow
    ordersToShow = [];
}


function clearAllBrowse() {
    //clear Browse and Orders
    clearBrowse();
    deleteOrdersToShow();
}


/*ORDER LINES WINDOW OPEN*/
function openOrder(oi){
    showRows();
    hideSearch();

    //set to global variable
    currentOrder = oi;

    document.getElementById("orderRowWindow").innerHTML = "";
    document.getElementById("orderDetailsHeader").innerHTML = "";

    /*order number
    customer
    customer id
    delivery date
    sales contact */

    // Table 
    table = document.createElement("table"); // create table element

    var headers = ["Order Number", "Customer", "Customer id", "Delivery date", "Sales contact"];
        
    for(b = 0;b < headers.length; b++){

        row = document.createElement("tr"); // create header row
        row.className = "orderDetails";
        createTh(headers[b]);

        switch (headers[b]){
            case "Order Number":
                createTd(ordersToShow[oi].orderid) 
                break;
            case "Customer":
                createTd(ordersToShow[oi].customer);
                break;
            case "Customer id":
                createTd(ordersToShow[oi].customerid);
                break;
            case "Delivery date":
                createTd(ordersToShow[oi].deliverydate);
                break;
            case "Sales contact":
                createTd(ordersToShow[oi].respsalesperson);
                break;
        }

        table.appendChild(row); // insert header row to table

    }
    // print table to right div
    const element = document.getElementById("orderDetailsHeader");
    element.appendChild(table);


    /*billing address
    delivery address*/
    document.getElementById("orderAddressesHeader").innerHTML = 
    `<b>Billing address</b><br>
    ${ordersToShow[oi].invaddr}<br><br>
    <b>Delivery address</b><br>
    ${ordersToShow[oi].delivaddr}`;

    //Customer comment
    document.getElementById("orderCommentHeader").innerHTML = ordersToShow[oi].comment;

    // create table for order lines 
    printLines(oi);

}


function printLines(oi){

    document.getElementById("orderindex").innerHTML = oi;

    // Table 
    table = document.createElement("table"); // create table element

    // print lines to table
    for(b = 0;b < ordersToShow[oi].items.length; b++){

        //console.log(`For item lines ${b} ${ordersToShow[oi].items[b].product}`);

        //Get comment from session storage
        if (window.sessionStorage != "undefined"){

            if (sessionStorage.getItem(`comment${ordersToShow[oi].orderid}-${b}`) != null){
                ordersToShow[oi].items[b].comment = sessionStorage.getItem(`comment${ordersToShow[oi].orderid}-${b}`); 
            }
            else {
                ordersToShow[oi].items[b].comment = "";
            }

            if (sessionStorage.getItem(`collectedQty${ordersToShow[oi].orderid}-${b}`) != null){
                ordersToShow[oi].items[b].collectedQty = sessionStorage.getItem(`collectedQty${ordersToShow[oi].orderid}-${b}`); 
            }
            else {
                ordersToShow[oi].items[b].collectedQty = "";
            }

            if (sessionStorage.getItem(`collectedBox${ordersToShow[oi].orderid}-${b}`) != null){

                //console.log(`STORAGE read fully collected ${ordersToShow[oi].orderid}-${b}`);
                //console.log(sessionStorage.getItem("collectedBox" + ordersToShow[oi].orderid + "-" + b));

                ordersToShow[oi].items[b].collectedBox = sessionStorage.getItem(`collectedBox${ordersToShow[oi].orderid}-${b}`); 
            
                //console.log(ordersToShow[oi].items[b].collectedBox);
            
            }
            else {

                //console.log(`Trying to read NULL if fully collected ${ordersToShow[oi].orderid}-${b}`);
                ordersToShow[oi].items[b].collectedBox = false;
            }

        } 
        else {
            document.getElementById('messageBox').innerHTML = "Sorry no session storage!";

        }



        if (b == 0){
            row = document.createElement("tr"); // create header row
            row.className = "orderHeader";

            createTh("Item");
            createTh("Supplier code");
            createTh("Name");
            createTh("Description");
            createTh("Shelf");
            createTh("Unit price");
            createTh("Amount");
            createTh("Collected");
            createTh("Fully collected");
            createTh("Comment");
        
            table.appendChild(row); // insert header row to table
        }

        // CREATE tr ROW
        row = document.createElement("tr"); // create row
        row.className = "order";


        //console.log(`PRINT lines ${ordersToShow[oi].items[b].collectedBox}`);

        createTd(ordersToShow[oi].items[b].code);
        createTd(ordersToShow[oi].items[b].suppliercode);
        createTd(ordersToShow[oi].items[b].product);
        createTd(ordersToShow[oi].items[b].description);
        createTd(ordersToShow[oi].items[b].shelf_pos);
        createTd(ordersToShow[oi].items[b].unit_price);
        createTd(ordersToShow[oi].items[b].qty);
        createTdCollectedQty(ordersToShow[oi].items[b].collectedQty, oi, b) 
        createTdCollectedBox(ordersToShow[oi].items[b].collectedBox, oi, b) //TODO FIX
        createTdComment(ordersToShow[oi].items[b].comment, oi, b); 

        // Add ROW to table
        table.appendChild(row);

    }

    //total line
    // CREATE tr ROW
    row = document.createElement("tr"); // create row
    row.className = "orderTotal";

    //TD1 empty
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "3";
    rcell.className = "orderTotal";
    //node1 = document.createTextNode(dataTxt); // value node
    //rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   

    //TD2 TOTAL
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "1";
    rcell.className = "orderTotal";
    node1 = document.createTextNode("Total price"); // value node
    rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   

    //TD3 TOTAL €
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "4";
    rcell.className = "orderTotal";
    node1 = document.createTextNode(`${ordersToShow[oi].totalprice} €`); // value node
    rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   


//************** TODO *******************    
    //TD4 FULLY COLLECTED
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "1";
    rcell.className = "orderTotalNotCollected"; //"orderTotalCollected" red? blue?
    node1 = document.createTextNode(""); // value node FULLY COLLECTED?
    rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   


/*
// checkbox order collected
    rcell = document.createElement("td"); // first td

    //console.log(`Create collectex box ${ordersToShow[oi].orderid}-${b} ${dataTxt}`);

    let inputElem = document.createElement("input");
    inputElem.setAttribute("type", "checkbox");
    inputElem.setAttribute("class", "collectedBox");
    inputElem.setAttribute("id", `collectedBox${ordersToShow[oi].orderid}-${b}`); // ordersToShow[oi].items[b] oi-b
    if (dataTxt == "true"){ // IF CHECKED TRUE
        inputElem.setAttribute("checked", true);
    }

    rcell.appendChild(inputElem); // add node to td
    row.appendChild(rcell); // add td to tr 

*/

//*********TODO********* 





    //TD5 
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "1";
    rcell.className = "orderTotal";
    //node1 = document.createTextNode(""); // value node FULLY COLLECTED?
    //rcell.appendChild(node1); // add node to td
    row.appendChild(rcell); // add td to tr   


    table.appendChild(row);



    //Save button
    // CREATE tr ROW
    row = document.createElement("tr"); // create row
    row.className = "savebuttonrow";

    //TD1 empty
    rcell = document.createElement("td"); // first td
    rcell.colSpan = "10";
    //node1 = document.createTextNode(dataTxt); // value node
    //rcell.appendChild(node1); // add node to td

    let inputElem = document.createElement("input");
    inputElem.setAttribute("type", "button");
    inputElem.setAttribute("class", "saveComment");
    inputElem.setAttribute("id", "saveComment"); // ordersToShow[oi].items[b] oi-b
    inputElem.setAttribute("value", "Save");

    inputElem.setAttribute("onclick", `saveComment()`);


    rcell.appendChild(inputElem); // add node to td
    row.appendChild(rcell); // add td to tr   */
    table.appendChild(row);

    // print table to right div
    const element = document.getElementById("orderRowWindow");
    element.appendChild(table);


}

//Create iput for line comment
function createTdComment(dataTxt, oi, b){

    rcell = document.createElement("td"); // first td


    let inputElem = document.createElement("input");
    inputElem.setAttribute("type", "txt");
    inputElem.setAttribute("class", "comment");
    inputElem.setAttribute("id", `comment${ordersToShow[oi].orderid}-${b}`); // ordersToShow[oi].items[b] oi-b
    inputElem.setAttribute("value", dataTxt);

    rcell.appendChild(inputElem); // add node to td
    row.appendChild(rcell); // add td to tr   */

}

//Create iput for line comment
function createTdCollectedQty(dataTxt, oi, b){

    rcell = document.createElement("td"); // first td


    let inputElem = document.createElement("input");
    inputElem.setAttribute("type", "number");
    inputElem.setAttribute("class", "collectedQty");
    inputElem.setAttribute("id", `collectedQty${ordersToShow[oi].orderid}-${b}`); // ordersToShow[oi].items[b] oi-b
    inputElem.setAttribute("value", dataTxt);

    rcell.appendChild(inputElem); // add node to td
    row.appendChild(rcell); // add td to tr   */

}

//Create iput for line comment
function createTdCollectedBox(dataTxt, oi, b){

    rcell = document.createElement("td"); // first td

    //console.log(`Create collectex box ${ordersToShow[oi].orderid}-${b} ${dataTxt}`);

    let inputElem = document.createElement("input");
    inputElem.setAttribute("type", "checkbox");
    inputElem.setAttribute("class", "collectedBox");
    inputElem.setAttribute("id", `collectedBox${ordersToShow[oi].orderid}-${b}`); // ordersToShow[oi].items[b] oi-b
    if (dataTxt == "true"){ // IF CHECKED TRUE
        inputElem.setAttribute("checked", true);
    }

    rcell.appendChild(inputElem); // add node to td
    row.appendChild(rcell); // add td to tr   */

}


// SAVE Comments
function saveComment(){

    //let oi = Number(document.getElementById('orderindex').innerHTML); 
    //console.log(`SAVE ORDER INDEX : ${oi}`);  
    //console.log(`SAVE current order index ${currentOrder}`);

    for(b = 0;b < ordersToShow[currentOrder].items.length; b++){

        const commentToSave = document.getElementById(`comment${ordersToShow[currentOrder].orderid}-${b}`).value;
        const collectedQtyToSave = document.getElementById(`collectedQty${ordersToShow[currentOrder].orderid}-${b}`).value;
        const collectedBoxToSave = document.getElementById(`collectedBox${ordersToShow[currentOrder].orderid}-${b}`).checked; //ERROR: EMPTY STRING - how to handle true false checkbox TODO

        //console.log(`Collected box${collectedBoxToSave} collectedBox${ordersToShow[currentOrder].orderid}-${b}`); //TODO FIX


        ordersToShow[currentOrder].items[b].comment = commentToSave;
        ordersToShow[currentOrder].items[b].collectedQty = collectedQtyToSave;
        ordersToShow[currentOrder].items[b].collectedBox = collectedBoxToSave;

        

        //console.log(`SAVEd!  comment${ordersToShow[currentOrder].orderid}-${b} ${commentToSave}`);

        //SET comment from session storage
        if (window.sessionStorage != "undefined"){
            sessionStorage.setItem(`comment${ordersToShow[currentOrder].orderid}-${b}`, commentToSave); 
            sessionStorage.setItem(`collectedQty${ordersToShow[currentOrder].orderid}-${b}`, collectedQtyToSave); 
            sessionStorage.setItem(`collectedBox${ordersToShow[currentOrder].orderid}-${b}`, collectedBoxToSave); 
        } 
        else {
            document.getElementById('messageBox').innerHTML = "Sorry no session storage!";
        }
    }
}

function sendToPrinter(){
    //console.log("PRINT!");
    window.print();
}


function returnToBrowse(){

    showSearch();
    hideRows();
}


function showSearch(){
    setDisplay('getOrders', 'block');
}
function showRows(){
    setDisplay('viewOrderbox', 'block');
}
function hideSearch(){
    setDisplay('getOrders', 'none');
}

function hideRows(){
    setDisplay('viewOrderbox', 'none');
}


/*Set display to div */
function setDisplay(divId, displayOrNot){
    //console.log(`Set display divId: ${divId} ${displayOrNot}`);
    /*Get element hiddenDiv */
    const myDiv = document.getElementById(divId);
    //console.log("myDiv: " + myDiv.style.display);
    myDiv.style.display = displayOrNot;
    //console.log(`myDiv: ${myDiv.style.display} equals  ${displayOrNot}?`);
}

const myLogoutButton = document.getElementById('logout');
myLogoutButton.addEventListener('click', logOut);

const myLogout2Button = document.getElementById('logout2');
myLogout2Button.addEventListener('click', logOut);

const mySearchButton = document.getElementById('search');
mySearchButton.addEventListener('click', listOrders);

const myReturnButton = document.getElementById('return');
myReturnButton.addEventListener('click', returnToBrowse);

const myPrintButton = document.getElementById('print');
myPrintButton.addEventListener('click', sendToPrinter);

//const mySaveCommentButton = document.getElementById('saveComment');
//mySaveCommentButton.addEventListener('click', saveComment);

// Get the input field
const input = document.getElementById("ordernumber");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search").click();
  }
}); 

// Get the input field
const inputCustomer = document.getElementById("customer");

// Execute a function when the user presses a key on the keyboard
inputCustomer.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search").click();
  }
}); 


/*For testing ->
const myShowSearchButton = document.getElementById('showSearch');
myShowSearchButton.addEventListener('click', showSearch);

const myShowRowsButton = document.getElementById('showRows');
myShowRowsButton.addEventListener('click', showRows);

const myHideSearchButton = document.getElementById('hideSearch');
myHideSearchButton.addEventListener('click', hideSearch);

const myHideRowsButton = document.getElementById('hideRows');
myHideRowsButton.addEventListener('click', hideRows);
*/

function clearStorage(){
    //FOR TEST
    sessionStorage.clear();
    logOut();
}

const myClearStorageButton = document.getElementById('clearStorage');
myClearStorageButton.addEventListener('click', clearStorage);

//<-For testing