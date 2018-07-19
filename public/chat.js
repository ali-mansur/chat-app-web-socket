var fromUser="", toUser = "", chats = [
    {
        from: "david",
        to: "kevin",
        message: "hi, from david to kevin"
    },
    {
        from: "david",
        to: "rob",
        message: "hello, from david to rob"
    },
    {
        from: "david",
        to: "john",
        message: "hello, from david to D"
    },
    {
        from: "kevin",
        to: "david",
        message: "hello, from kevin to david"
    },
    {
        from: "rob",
        to: "david",
        message: "hi, from rob to david"
    },
    {
        from: "john",
        to: "david",
        message: "hi, from john to david"
    }
]



// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      friendList = document.getElementById('friend-list'),
      username = document.getElementById('username'),
      login = document.getElementById('login');
      conversationWith = document.getElementById('conversation-with');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        from: fromUser,
        to: toUser,
        message: message.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', {fromUser: fromUser, toUser: toUser});
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = "";
    chats.push(data);
    showChats();
});

socket.on('typing', function(data){
    if(data.fromUser == fromUser && data.toUser == toUser ||
        data.fromUser == toUser && data.toUser == fromUser
    ) {
        feedback.innerHTML = '<p><em>' + data.fromUser + ' is typing a message...</em></p>';
    } else {
        feedback.innerHTML = "";
    }
});

function showChats() {
    output.innerHTML = "";
    conversationWith.innerHTML = toUser;

    if(fromUser === ""){
        output.innerHTML += '<p class="error">' + 'enter any of the name from the left in the chat handler input to see the conversation' + '</p>';
        return;
    }
    
    if(fromUser === toUser){
        output.innerHTML += '<p class="error">' + 'You can not send message to yourself' + '</p>';
        return;
    }

    var filteredChats = chats.filter(function(chat){
        return chat.from == fromUser && chat.to == toUser || 
               chat.from == toUser && chat.to == fromUser
    });

    if(!filteredChats.length) {
        output.innerHTML += '<p class="new">' + 'start conversation' + '</p>';
        return;
    }

    for(let i=0; i< filteredChats.length; i++) {
        output.innerHTML += '<p><strong>' + filteredChats[i].from + ': </strong>' + filteredChats[i].message + '</p>';
    }
    
}

handle.addEventListener('change', function(event){
    fromUser = event.target.value;
    showChats();
});

friendList.addEventListener('click', function(event){
    toUser = event.target.innerText;
    
    showChats();
});

