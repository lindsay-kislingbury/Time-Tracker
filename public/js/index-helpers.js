$(document).ready(function(){
    $('#quick-start-button').click(function(){
        console.log('inside quick start button')
        createTempUser();
    });
});

function createTempUser(){
    var postData = {
        name: 'Guest',
        password: 'guest',
    }
    $.ajax({
        type: 'POST',
        url: '/auth/tempSignup',
        data: postData,
        success: function(data){
            loginTempUser(data)
        }
    })

}

function loginTempUser(username){
    var postData = {username: username, password: 'guest'}
    console.log('postData: ', postData)
    $.ajax({
        type: 'POST',
        url: '/auth/login',
        data: postData,
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error:', textStatus);
            console.log('Error Details:', errorThrown);
          }
    });
}