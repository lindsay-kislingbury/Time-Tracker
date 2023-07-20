$(document).ready(function(){
    $('#dashboard-button').click(function(){
        toggleSections('#wrapper-dashboard');
        toggleButtons("#dashboard-button");
    });
    $('#list-button').click(function(){
        toggleSections('#wrapper-list');
        toggleButtons("#list-button");    
        $('#list-table').css("width", "100%");
        $('.dataTables_scrollHeadInner, .dataTable').css({'width':'100%'});
    });
    $('#charts-button').click(function(){
        toggleSections('#wrapper-charts');
        toggleButtons("#charts-button");    
    });
});

function toggleSections(visibleDiv){
    $(".wrapper").each(function () {
        $(this).hide();
     });
     $(visibleDiv).show();
}

function toggleButtons(activeButton){
    $('.navbar .btn').removeClass('active');
    $(activeButton).addClass('active');
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
        "bInfo" : false,
        "columns": [
            {"data": null, "defaultContent": ""},
            {"data": "title"},
            {"data": "time"},
            {"data": "date"},
            {"data": "tags"},
            {
                "data": "stampId", 
                "render": function(data, type, row){
                    return '<button class="btn p-0" data-bs-toggle="modal" data-type="list" onclick="openModal(`'+data+'`)" data-bs-target="#editModal" id="button-list-edit"><i class="bi bi-three-dots-vertical"></i></button>'
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

$(document).ready(function () {
    loadTags();
})

$("#editModal").on("hide.bs.modal", function () {
    $("#edit-tags").empty().trigger('change')
});

var timeInputs = document.getElementsByName("time-input");
var im = new Inputmask("99:99:99",{numericInput: true, placeholder:'0'});
for(var i=0; i<timeInputs.length; i++){
    im.mask(timeInputs[i]);
}
    
function formatTime(totSeconds){
    return new Date(totSeconds * 1000).toISOString().slice(11, 19);
}

function formatDate(date){
    document.getElementById('formatted-date').innerHTML = (date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()); 
}

function valididateAddInputs(){
    var valid = true;
    $("input[id^='add-']").each(function (i, elem) {
        if(elem.value==''){
            elem.classList.add('is-invalid');
            valid = false;
        }
    });
    return valid;
}

function valididateEditInputs(){
    var valid = true;
    $("input[id^='edit-']").each(function (i, elem) {
        if(elem.value==''){
            elem.classList.add('is-invalid');
            valid = false;
        }
    });
    return valid;
}

function validateTimerInput(){
    if(document.getElementById('new-title').value==''){
        document.getElementById('new-title').classList.add('is-invalid')
        return false;
    }else{
        return true;
    }
}

function stringDateToUTC(dateString){
    var date = dateString.split('-');
    date = new Date();
    date.setFullYear(dateString[0]);
    date.setMonth(dateString[1]);
    date.setDate(dateString[2]);
    return date;
}

function cnvToTotalSeconds(hours, minutes, seconds){
    return ((hours * 3600) + (minutes * 60) + seconds * 1);
}

function updateDiv(){
    console.log('entered update div')
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

function openModal(stampId){
    $.ajax({
        type: 'POST',
        dataType:'json',
        url: '/time/getOneStampTags',
        data: {stampId: stampId},
        success: function(data){
            tags = data.tags.map((data) => ({"id": data, "text": data, "selected": true}));
            console.log("tags: ", tags)
            $('#edit-tags').select2({
                data: tags,
                multiple: true,
                closeOnSelect: false,
                theme: 'bootstrap-5',
                tags: true,
                tokenSeparators: [',', ' '],
                dropdownParent: $('#editModal'),
            });
            var date = data.date.slice(0, 10).split('-');
            $('#edit-date').val(date[0] +'-'+ date[1] +'-'+ date[2]);
            $('#edit-time').val(data.time);
            $('#edit-title').val(data.title);
            $('#button-edit').val(stampId);
            $('#button-remove').val(stampId); 
        }
    })
}

function buildNewEntry(type){
    var title, options, tags, time, date, valid;
    if(type=='timer'){
        title = document.getElementById('new-title').value;
        options = document.getElementById('new-tags').selectedOptions;
        tags = Array.from(options).map(({value})=> value);
        time = cnvToTotalSeconds(hours, minutes, seconds);
        date = new Date();
        valid = validateTimerInput();
    }else{
        title = document.getElementById('add-title').value;
        var timeInput = document.getElementById('add-time').value.split(':');
        time = cnvToTotalSeconds(timeInput[0], timeInput[1], timeInput[2]);
        date = stringDateToUTC(document.getElementById('add-date').value);
        options = document.getElementById('add-tags').selectedOptions;
        tags = Array.from(options).map(({value})=> value);
        valid = valididateAddInputs();
    }
    if(valid){
        return ({
            title: title,
            tags: tags,
            elapsedTime: time,
            date: date
        })
    }else{
        return null;
    }
}

function buildEditEntry(){
    var stampId = document.getElementById('button-edit').value;
    var title = document.getElementById('edit-title').value;
    var options = document.getElementById('edit-tags').selectedOptions;
    var tags = Array.from(options).map(({value})=> value);
    var date = document.getElementById('edit-date').value;
    var timeParts = document.getElementById('edit-time').value.split(':');
    var time = cnvToTotalSeconds(timeParts[0], timeParts[1], timeParts[2]);
    valid = valididateEditInputs();
    if(valid){
        return ({
            stampId: stampId,
            title: title,
            tags: tags,
            time: time,
            date: date
        });
    }else{
        return null;
    }

}

async function send(type){
    var postData = buildNewEntry(type);
    console.log("post: ", postData)
    if(postData){
        var post = JSON.stringify(postData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/time/create', true);
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(post);
        if(type=='timer'){
            resetTimer();
            clearTimerInputs();   
        }else{
            clearAddInputs(); 
        }
        updateDiv();
        loadTags();
    }
}

function edit(){
    var postData = buildEditEntry();
    if(postData){
        var post = JSON.stringify(postData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/time/edit', true);
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(post);
        updateDiv();
        $('#editModal').modal('hide');
    }
}

function remove(){
    var stampId = document.getElementById('button-remove').value;
    $.ajax({
        type: 'POST',
        url: '/time/remove',
        cache: false,
        data: {
            deleteId: stampId,
        }
    })  
    updateDiv();
    $('#editModal').modal('hide');
}








