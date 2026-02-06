const socket = io("http://localhost:5000");
const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input'); // FIXED
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit',(e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Total Clients ${data}`;
});

function sendMessage(){
    if(messageInput.value === '') return;
    const data = {
        name: nameInput.value, // FIXED
        message: messageInput.value,
        dateTime: new Date()
    };
    socket.emit('message', data);
    addMessageToUi(true, data);
    messageInput.value = "";
}

socket.on('chat-message',(data)=>{
    addMessageToUi(false, data);
});

function addMessageToUi(isOwnMessage, data){
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? "message-right":"message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name} ${moment(data.dateTime).format("HH:mm")}</span>
        </p>
    </li>`;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus',()=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing message`
    });
});
messageInput.addEventListener('keypress',()=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing message`
    });
});
messageInput.addEventListener('blur',()=>{
    socket.emit('feedback',{ feedback:'' });
});

socket.on('feedback',(data)=>{
    clearFeedback();
    if(data.feedback){
        const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
        messageContainer.innerHTML += element;
    }
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => { // FIXED
        element.remove();
    });
}