
const socket = io('https://chat-app-phi-gray.vercel.app/');


const writeMsg = document.getElementById('message');
const input = document.getElementById('msg');
const btn = document.getElementById('btn');
const form = document.getElementById('form')
const nameForm  = document.querySelector('.user-name');
const userName  = document.querySelector('#name');


nameForm.addEventListener('submit',(e) => {
    e.preventDefault();
    if(userName.value){

        socket.emit('new-user-joined',userName.value);

        nameForm.classList.add('hide');
        input.value='';
    }
});


function append(msg,position){
    const p = document.createElement('p');
    p.innerText = msg;
    p.id = position;
    writeMsg.appendChild(p);
    window.scrollTo(0,document.body.scrollHeight);
}

form.addEventListener('submit' ,(e) => {
    e.preventDefault();

    if(input.value){
        socket.emit('send',input.value);

        append(input.value,'right');

        input.value = '';
    }
});


socket.on('user-joined',name => {
   append(`${name} joined the chat`,'center');
});

socket.on('receive',data => {
   append(`${data.name} : ${data.message}`,'left');
});

socket.on('leave',name => {
    append(`${name} left the chat`,'center');
});
