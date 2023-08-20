//Section Navigation Button Listeners
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
        resetChart('donut');
        $('#range-start').val('');
        $('#range-end').val('');
    });
    $('select.project-input').on('change', function() {
        if($(this).val()){
            $(this).removeClass('is-invalid');
        }
    });
});

function toggleSections(visibleDiv){
    $(".wrapper").each(function () {
        $(this).addClass('hide');
     });
     $(visibleDiv).removeClass('hide');
}

function toggleButtons(activeButton){
    $('.navbar .btn').removeClass('active');
    $(activeButton).addClass('active');
}

//DataTables Initializaiton
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
                        'project': json.timestamps[i].project,
                        'tags': json.timestamps[i].tags.join(', '),
                        'stampId': json.timestamps[i]._id,
                    })
                }
                return formattedData;
            }
        },
        responsive: true,
        "lengthChange": false,
        "bInfo" : false,
        "pageLength": 10,
        scrollY: '60vh',
        "language": {
            "emptyTable": "No Entries Yet"
          },
        "columns": [
            {"data": null, "defaultContent": ""},
            {"data": "title"},
            {"data": "time"},
            {"data": "date"},
            {"data": "project"},
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
            {orderable: false, targets: [0,5,6]},
        ]
    });
});

//Select2 Tags Initializaiton
$(document).ready(function () {
    clearAllInputs();
    initializeTags();
});



function initializeTags(){
    $.get('/time/loadAllTags', function(data){
        tags = data.tags.map((data) => ({"id": data, "text": data}));
        $('#new-tags').select2({
            data: tags,
            multiple: true,
            placeholder: $( this ).data('placeholder'),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
            allowClear: true,
        });
        $('#add-tags').select2({
            data: tags,
            multiple: true,
            placeholder: $( this ).data('placeholder'),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
            allowClear: true,
        });
        $('#new-project').prepend('<option value=""></option>').select2({
            data: data.projects,
            placeholder: $( this ).data('placeholder'),
            allowClear: true,
            theme: 'bootstrap-5',
            tags: true,
            "language":{
                "noResults": function(){
                    return "Create a project...";
                }
            }
        })
        $('#add-project').prepend('<option value=""></option>').select2({
            data: data.projects,
            placeholder: $( this ).data('placeholder'),
            theme: 'bootstrap-5',
            allowClear: true,
            tags: true,
            "language":{
                "noResults": function(){
                    return "Create a project...";
                }
            }
        })
    });
}



//Edit Modal Helpers
$("#editModal").on("hide.bs.modal", function () {
    $("#edit-tags").empty().trigger('change')
    $("#edit-project").empty().trigger('change')
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

function validateInputs(type){
    var valid = true;
    $("input[id^='"+type+"-']").each(function (i, elem) {
        if(elem.value==''){
            elem.classList.add('is-invalid');
            valid = false;
        }
    });
    return valid;
}

function stringDateToUTC(dateString){
    var dateParts = dateString.split('-');
    date = new Date();
    date.setFullYear(parseInt(dateParts[0]));
    date.setMonth(parseInt(dateParts[1])-1);
    date.setDate(parseInt(dateParts[2]));
    return date;
}

function cnvToTotalSeconds(hours, minutes, seconds){
    return ((hours * 3600) + (minutes * 60) + seconds * 1);
}

function cnvToTimeString(seconds){
    return new Date(seconds * 1000).toISOString().slice(11, 19);
}

function update(){
    $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/time/update',
        success: function(data){
            $("#stamps").load(location.href+" #stamps>*",function(){
                initializeTags();
            });
            $('#list-table').DataTable().ajax.reload();
        }
    });
}


function clearAllInputs(){
    $('#new-title').val('');
    $('#new-project').empty();
    $("#new-tags").empty();
    $('#add-title').val('');
    $('#add-project').empty();
    $('#add-date').val('');
    $('#add-time').val('');
    $("#add-tags").empty();
}

function loadEditTags(){
    $.get('/time/loadAllTags', function(data){
        tags = data.tags.map((data) => ({"id": data, "text": data}));
        $('#edit-tags').select2({
            data: tags,
            multiple: true,
            placeholder: $(this).data('placeholder'),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            dropdownParent: $('#editModal'),
            tags: true,
            tokenSeparators: [',', ' '],
        });
        $('#edit-project').select2({
            data: data.projects,
            placeholder: $( this ).data('placeholder'),
            theme: 'bootstrap-5',
            dropdownParent: $('#editModal'),
            allowClear: true,
            tags: true,
            "language":{
                "noResults": function(){
                    return "Create a project...";
                }
            }
        });
    });
}

function openModal(stampId){
    loadEditTags();
    $.ajax({
        type: 'POST',
        url: '/time/getOneEntry',
        data: {stampId: stampId},
    }).then(function (data) {
        data.tags.forEach(tag => {
            var tagOption = new Option(tag, tag, true, true);
            $('#edit-tags').append(tagOption).trigger('change');
            $('#edit-tags').trigger({
                type: 'select2:select',
                params: tag
            })
        });
        $('#edit-project').val(data.project).trigger('change');
        var date = data.date.slice(0, 10).split('-');
        $('#edit-date').val(date[0] +'-'+ date[1] +'-'+ date[2]);
        $('#edit-time').val(cnvToTimeString(data.time));
        $('#edit-title').val(data.title);
        $('#button-edit').val(stampId);
        $('#button-remove').val(stampId); 
    });
}

function buildNewEntry(){
    var options = document.getElementById('new-tags').selectedOptions;
    var inputTitle = document.getElementById('new-title').value;
    var inputProject = document.getElementById('new-project').value;
    var postData = ({
        title: inputTitle[0].toUpperCase() + inputTitle.substring(1),
        project: inputProject[0].toUpperCase() + inputProject.substring(1),
        tags: Array.from(options).map(({value})=> value),
        date: new Date(),
        elapsedTime: cnvToTotalSeconds(hours, minutes, seconds),
    });
    return postData;
}

function buildAddEntry(){
    var timeInput = document.getElementById('add-time').value.split(':');
    var options = document.getElementById('add-tags').selectedOptions;
    var inputTitle = document.getElementById('add-title').value;
    var inputProject = document.getElementById('add-project').value; 
    var postData = ({
        title: inputTitle[0].toUpperCase() + inputTitle.substring(1),
        project: inputProject[0].toUpperCase() + inputProject.substring(1),
        tags: Array.from(options).map(({value})=> value),
        date: stringDateToUTC(document.getElementById('add-date').value),
        elapsedTime: cnvToTotalSeconds(timeInput[0], timeInput[1], timeInput[2]),
    });
    return postData;
}

function buildEditEntry(){
    var options = document.getElementById('edit-tags').selectedOptions;
    var timeParts = document.getElementById('edit-time').value.split(':');
    var inputTitle = document.getElementById('edit-title').value;
    var inputProject = document.getElementById('edit-project').value;
    var postData = ({
        stampId: document.getElementById('button-edit').value,
        title: inputTitle[0].toUpperCase() + inputTitle.substring(1),
        project: inputProject[0].toUpperCase() + inputProject.substring(1),
        tags: Array.from(options).map(({value})=> value),
        time: cnvToTotalSeconds(timeParts[0], timeParts[1], timeParts[2]),
        date: stringDateToUTC(document.getElementById('edit-date').value),
    });
    return postData;
}

async function send(type){
    if(!$('#'+type+'-project').val()){
        $('#'+type+'-project').addClass('is-invalid')
    }
    var valid = validateInputs(type);
    var postData;
    if(valid){
        if(type == 'new'){
            postData = buildNewEntry();
        }else if(type == 'add'){
            postData = buildAddEntry();
        }else if(type == 'edit'){
            postData = buildEditEntry();
        }else{
            console.log('invalid submit type');
        }
        var post = JSON.stringify(postData);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/time/create', true);
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(post);
        clearAllInputs();
        update();
    }
}

function edit(){
    var postData = buildEditEntry();
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/time/edit', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
    clearAllInputs();
    update()
    $('#editModal').modal('hide');
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
    clearAllInputs();
    update();
    $('#editModal').modal('hide');
}











