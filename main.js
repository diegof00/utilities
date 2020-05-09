'use strict';

var stompClient = null;
var username = 'user20';
var participants = null;


(function init(){
    console.log("init");
    connect();
})();

function connect() {
    var socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    console.log("trying to connect. . . ");
    let headers = {
        "client-id": "my-client-id",
        "Authorization" :  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMjAiLCJpYXQiOjE1ODY4MTY2NDksImV4cCI6MTU4NzQyMTQ0OX0.JxzJ4HPrfWhxxhW9gkmwdr4-N6Nr3d4X3pqWp0lKtV0UlLmSy-7Z97zBfkS-9AY4b6wVdYq_wntDjQFGJ5kFaA"
    };
    stompClient.connect(headers, onConnected, onError);
}

function onConnected(frame) {
    console.log(frame);
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )
    stompClient.subscribe('/app/chat.participants', onParticipantsReceived);
    stompClient.subscribe("/topic/"+username, function(message) {
        var parsed = JSON.parse(message.body);
        alert("private message from " + parsed.sender + ": " + parsed.content)
    });
}

function onError(error) {
   console.log(error);
}

function sendMessage() {
    var messageContent = 'sample message';
    var chatMessage = {
          sender: username,
          content: messageInput.value,
          type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log(message);
}


function onParticipantsReceived(payload) {
    console.log(JSON.parse(payload.body));
}

function getMessageFrom(username) {
    var chatMessage = {
        sender: username,
        content: "private message",
        type: 'CHAT'
    };
    return chatMessage;
}


function pvtmessage(username) {
    stompClient.send("/app/chat.private." + username, {}, JSON.stringify(getMessageFrom(username)));
}
