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
    document.getElementById('messageBox').innerHTML = "Welcome " + user.firstName;
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
            row.className = ("orderHeader");

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
        row.className = ("order");


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

    document.getElementById("orderRowWindow").innerHTML = "items table";
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
        row.className = ("orderDetails");
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

//For testing ->
const myShowSearchButton = document.getElementById('showSearch');
myShowSearchButton.addEventListener('click', showSearch);

const myShowRowsButton = document.getElementById('showRows');
myShowRowsButton.addEventListener('click', showRows);

const myHideSearchButton = document.getElementById('hideSearch');
myHideSearchButton.addEventListener('click', hideSearch);

const myHideRowsButton = document.getElementById('hideRows');
myHideRowsButton.addEventListener('click', hideRows);
// <-For testing