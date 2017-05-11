console.log("Okay, time to MAKE THIS WEBSITE!!!")

function listener(){
    console.log(this.responseText);
}

var request = new XMLHttpRequest();
request.addEventListener("load", listener);
request.open("GET", "http://127.0.0.1:8888/index.xml");
request.send();

console.log("The code runs here!")
