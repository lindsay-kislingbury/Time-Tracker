const deleteButton = document.getElementById('deleteButton');
deleteButton.addEventListener("click", remove);
const table = document.getElementById('stamps').innerHTML;


function remove(){
    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/time/remove', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({"deleteId": deleteButton.value}));
    
    
}


  


const myModal = document.getElementById('modal');
const myInput = document.getElementById('myInput');

