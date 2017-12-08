'use strict';

function isEmpty(str) {
    return (0 === str.length);
}

var serv_msg = document.getElementById("serv_msg");


function postData(phone_no, name, timeZone) {
    var data = {};
    data["phone"] = phone_no;
    data["message"] = "Hello, " + name + "!";
    data["timeZone"] = timeZone;

    var data = JSON.stringify(data);

    console.log("Data Send!");
    console.log(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            serv_msg.textContent = "Service Activated";
        }
    });

    xhr.open("POST", "http://localhost:3000/newUser/");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
}

var onsubmit = function (e) {
    e.preventDefault();

    var phone_no = (document.getElementById("user_number").value).toString(),
    name = (document.getElementById("user_name").value).toString(),
    timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone).toString();

    if (isEmpty(phone_no) || isEmpty(name) || isEmpty(timeZone)) {
        serv_msg.textContent = "Empty Parameter!";
        console.log("Empty Parameter")
        return false;
    }

    // GET REQUEST
    var get_data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var users_list = JSON.parse(this.responseText),
                found = false;
            for (var index = 0; index < users_list.length; ++index) {
                var user = users_list[index];

                if (user.phone === phone_no) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                postData(phone_no, name, timeZone)
            } else {
                serv_msg.textContent = "Phone Number Already Exists";
                console.log("Phone Number Already Exists");
            }
        }
    });

    xhr.open("GET", "http://localhost:3000/allUser/");
    xhr.setRequestHeader("cache-control", "no-cache");
    // xhr.setRequestHeader("postman-token", "35d83d68-3fd6-65a6-48c3-2e8c55e7b786");

    xhr.send(get_data);
};