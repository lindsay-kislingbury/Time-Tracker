$(document).ready(function(){
    $('#dashboard-button').click(function(){
        $("#wrapper-list").hide();
        $("#wrapper-list").removeClass('active');
    
        $("#wrapper-charts").hide();
        $("#wrapper-charts").removeClass('active');
    
        $("#wrapper-dashboard").show();
        $("#wrapper-dashboard").addClass('active');
    });
    $('#list-button').click(function(){
        $("#wrapper-dashboard").hide();
        $("#wrapper-dashboard").removeClass('active');
    
        $("#wrapper-charts").hide();
        $("#wrapper-charts").removeClass('active');
    
        $("#wrapper-list").show();
        $("#wrapper-list").addClass('active');
    
        $('#list-table').css("width", "100%");
        $('.dataTables_scrollHeadInner, .dataTable').css({'width':'100%'});
    });
    $('#charts-button').click(function(){
        $("#wrapper-list").hide();
        $("#wrapper-list").removeClass('active');
    
        $("#wrapper-dashboard").hide();
        $("#wrapper-dashboard").removeClass('active');
    
        $("#wrapper-charts").show();
        $("#wrapper-charts").addClass('active');
    });
    $('#wrapper-list').on('click', '#list-edit-button', function(){
        openModal('list');
    });
});

function updateDiv(){
    $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/time/update',
        success: function(data){
            $("#stamps").load(location.href+" #stamps>*","");
            $('#list-table').DataTable().ajax.reload();
        }
    });
}




$(document).ready(function () {
    $('#list-table').DataTable({
        "ajax": {
            "url": '/time/update',
            "type": 'GET',
            "dataSrc": function(json){
                var formattedData = new Array();
                for(var i=0; i<json.timestamps.length; i++){
                    formattedData.push({
                        'title': json.timestamps[i].title,
                        'time': new Date(json.timestamps[i].elapsedTime * 1000).toISOString().slice(11, 19),
                        'date': new Date(json.timestamps[i].date).toLocaleDateString(),
                        'tags': json.timestamps[i].tags.join(' ,'),
                        'stampId': json.timestamps[i]._id,
                    })
                }
                return formattedData;
            }
        },
        responsive: true,
        "lengthChange": false,
        "columns": [
            {"data": null, "defaultContent": ""},
            {"data": "title"},
            {"data": "time"},
            {"data": "date"},
            {"data": "tags"},
            {
                "data": "stampId", 
                "render": function(data, type, row){
                    return '<button class="btn p-0" data-bs-toggle="modal" data-type="list" data-id='+data+' data-bs-target="#listEditModal" id="list-edit-button"><i class="bi bi-three-dots-vertical"></i></button>'
                }
            }
        ],
        "order": [[3, 'desc']],
        "columnDefs": [
            {className: 'dtr-control', targets: 0},
            {orderable: false, targets: [0,5]},
        ]
    });
});






function formatTime(totSeconds){
    return new Date(totSeconds * 1000).toISOString().slice(11, 19);
}

function formatDate(date){
    document.getElementById('formatted-date').innerHTML = (date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()); 
}

//Load data for edit modal
function openModal(type){
    var stampId=$('#'+type+'-edit-button').attr('data-id');
    $('#'+type+'edit-tags').val('');
    $.ajax({
        type: 'POST',
        dataType:'json',
        url: '/time/getOneStampTags',
        data: {stampId: stampId},
        success: function(data){
            tags = data.tags.map((data) => ({"id": data, "text": data, "selected": true}));
            console.log('tags: ', tags);
            $('#'+type+'-edit-tags').select2({
                data: tags,
                multiple: true,
                closeOnSelect: false,
                theme: 'bootstrap-5',
                tags: true,
                tokenSeparators: [',', ' '],
                dropdownParent: $('#'+type+'EditModal')
            });
            var date = data.date.slice(0, 10).split('-');
            $('#'+type+'-edit-date').val(date[0] +'-'+ date[1] +'-'+ date[2]);
            $('#'+type+'-edit-time').val(data.time);
            $('#'+type+'-edit-title').val(data.title);
            $('#'+type+'-edit-button').val(stampId);
            $('#'+type+'-remove-button').val(stampId); 
        }
    })
}

async function timerSend(){
    var titleInputField = document.getElementById('new-title');
    if(titleInputField.value == ''){
        titleInputField.classList.add('is-invalid');
    }
    else{
        var title = titleInputField.value;
        var options = document.getElementById('new-tags').selectedOptions;
        var tags = Array.from(options).map(({value})=> value);
        var time = (hours * 3600) + (minutes * 60) + seconds;
        var inputDate = new Date().toISOString().slice(0, 10).split('-');
        var date = new Date();
        date.setFullYear(inputDate[0]);
        date.setMonth(inputDate[1]);
        date.setDate(inputDate[2]);
        var postData = {
            title: title,
            tags: tags,
            elapsedTime: time,
            date: date
        }
        var post = JSON.stringify(postData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/time/create', true);
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(post);
        resetTimer();
        clearTimerInputs();    
        updateDiv();
        loadTags();
        startTimerButton.style.cursor = "pointer";
        resetTimerButton.style.cursor = "auto";
        pauseTimerButton.style.cursor = "auto";
    }
}

function addSend(){
    var titleInputField = document.getElementById('add-title');
    var dateInputField = document.getElementById('add-date');
    var timeInputField = document.getElementById('add-time');
    if(titleInputField.value == '' || dateInputField.value== '' || timeInputField == ''){
        if(titleInputField.value == ''){
            titleInputField.classList.add('is-invalid');
        }
        if(dateInputField.value== ''){
            dateInputField.classList.add('is-invalid');
        }
        if(timeInputField.value== ''){
            timeInputField.classList.add('is-invalid');
        }
    } else {
        var title = titleInputField.value;
        var options = document.getElementById('add-tags').selectedOptions;
        var tags = Array.from(options).map(({value})=> value);
        var timeInput = document.getElementById('add-time').value;
        var timeParts = timeInput.split(':');
        var time = (timeParts[0]) * 3600 + timeParts[1] * 60 + timeParts[2] * 1;
        var inputDate = document.getElementById('add-date').value.split('-');
        var date = new Date();
        date.setFullYear(inputDate[0]);
        date.setMonth(inputDate[1]);
        date.setDate(inputDate[2]);
        var postData = {
            title: title,
            tags: tags,
            elapsedTime: time,
            date: date
        }
        var post = JSON.stringify(postData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/time/create', true);
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(post);
        clearAddInputs(); 
        updateDiv();
        loadTags();
    }
}

function remove(type){
    var stampId = document.getElementById(type+'-remove-button').value;
    $.ajax({
        type: 'POST',
        url: '/time/remove',
        cache: false,
        data: {
            deleteId: stampId,
        }
    })  
    updateDiv();
    $('#'+type+'EditModal').modal('hide');
}

function clearTimerInputs(){
    $('#new-title').val('');
    $("#new-tags").empty();
}

function clearAddInputs(){
    $('#add-title').val='';
    $('#add-date').val='';
    $('#add-time').val='';
    $("#add-tags").empty();
}

function isNumeric (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode (key);
    var regex = /[0-9]|\./;
    if ( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

//Select2 Timer Stamp Tags
function loadTags(){
    $.get('/time/loadAllTags', function(data){
        tags = data.map((data) => ({"id": data, "text": data}));
        $('#new-tags').select2({
            data: tags,
            multiple: true,
            placeholder: $( this ).data('placeholder'),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
            
        });
        $('#add-tags').select2({
            data: tags,
            multiple: true,
            placeholder: $( this ).data('placeholder'),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
        });
    });
}

$(document).ready(function(){
    loadTags();
});

function edit(type){
    var stampId = document.getElementById(type+'-edit-button').value;
    var title = document.getElementById(type+'-edit-title').value;
    var options = document.getElementById(type+'-edit-tags').selectedOptions;
    var tags = Array.from(options).map(({value})=> value);
    var date = document.getElementById(type+'-edit-date').value;
    var timeInput = document.getElementById(type+'-edit-time').value;
    var timeParts = timeInput.split(':');
    var time = (timeParts[0]) * 3600 + timeParts[1] * 60 + timeParts[2] * 1;
    var postData = {
        stampId: stampId,
        title: title,
        tags: tags,
        time: time,
        date: date
    }
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/time/edit', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
    updateDiv();
    $('#'+type+'EditModal').modal('hide');
}


var timeInputs = document.getElementsByName("time-input");
var im = new Inputmask("99:99:99",{numericInput: true, placeholder:'0'});
for(var i=0; i<timeInputs.length; i++){
    im.mask(timeInputs[i]);
}