'use strict';
function isEmpty(str) {
    return (0 === str.length);
}

var list = [];

var onsubmit = function (e) {
    e.preventDefault();

    var phone_no = (document.getElementById("user_number").value).toString(),
        name = (document.getElementById("user_name").value).toString(),
        timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone).toString();

    if (isEmpty(phone_no) || isEmpty(name) || isEmpty(timeZone)) {
        console.log("Empty Parameter")
        return;
    }

    if (list.indexOf(phone_no) >= 0) {
        console.log("Phone Number Already Exists");
        return;
    }

    var data = {};
    data["phone"] = phone_no;
    data["message"] = "Hello, " + name + "!";
    data["timeZone"] = timeZone;

    list.push(phone_no);

    console.log(data);

    var data = JSON.stringify(data);

    console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log("Hello" + this.responseText);
        }
    });

    xhr.open("POST", "http://localhost:3000/newUser/");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
};