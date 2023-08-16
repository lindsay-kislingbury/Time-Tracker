$(document).ready(function(){
    $('#quick-start-button').click(function(){
        console.log('inside quick start button')
        createTempUser();
        loginTempUser();
    });
});

function createTempUser(){
    var postData = {
        username: 'Guest',
        name: 'Guest',
        password: 'guest',
    }
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/tempSignup', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
}

function loginTempUser(){
    var postData = {username: 'Guest', password: 'guest'}
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/login');
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
}