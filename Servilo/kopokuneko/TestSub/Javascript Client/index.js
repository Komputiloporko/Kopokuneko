console.log("Okay, time to MAKE THIS WEBSITE!!!")

function listener(){
    console.log(this.responseText);
    var responseText = this.responseText;
    document.getElementById("output").innerHTML = this.responseText;
}

var request = new XMLHttpRequest();
request.addEventListener("load", listener);
request.open("GET", "http://127.0.0.1:8888/index.xml");
request.send();

var requestTypeInput = document.createElement('form');


console.log("The code runs here!")
function submit(){
    request.addEventListener("load", listener);
    request.open(document.getElementById("method").value,document.getElementById("submit").value);
    request.send();
}
