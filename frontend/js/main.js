// check if the user is logged in. Else show login form...
checkAuth();
loadForm();

function loadForm() {
  const now = moment().format('YYYY-MM-DD HH:mm');
  $("#datetime").val(now);
  loadTypes();
  loadBusinesses();
}

$("#logout").on('click', async () => {    
  strykeLogout('myreceipts');
  window.location.href = '/login.html';
});

$("#save").click(async () => {  
  $("#save").prop("disabled", true);  
  $("#save").text('Saving...');

  try {
    await saveReceipt();    
    window.location.href = '/index.html';    
  }
  catch (err) {
    if (err.response.status === 401) {
      window.location.href = '/index.html';
    }
    console.log(err.message);
    $("#feedback").text('Could not save your receipt!');  
    window.setTimeout(clearPage, 3000);
  }   
});

async function saveReceipt() {
  const amount = Number($("#amount").val());  
  const datetimeStr = $("#datetime").val();  
  const datetime = moment(datetimeStr).format('YYYY-MM-DDTHH:mm:ssZ');
  const notes = $("#notes").val();  
  let type = $("#type").val();  
  type = type === 'none' ? null : type;
  let business = $("#business").val();
  business = business === 'none' ? null : business;

  const data = {
    amount, 
    receiptDate: datetime,
    description: notes,
    type,
    business
  }; 

  await strykePost('data?entityType=receipt', data);    
}

function clearPage() {
  $("#amount").val(null);  
  const now = moment().format('YYYY-MM-DD HH:mm');
  $("#datetime").val(now);  
  $("#notes").val(null);  
  $("#type").val(null);  
  $("#business").val(null);  
  $("#feedback").text('');  
  
  resetButton();
}

function resetButton() {
  $("#save").prop("disabled", false);  
  $("#save").text('Save');
}

async function loadTypes() {
  try {
    const response = await strykeGet('data?entityType=type');    
    if (response && response.data && response.data.data && response.data.data.dataRecords) {
       for (const type of response.data.data.dataRecords) {
         $('#type').append(`<option value="${type.id}">${type.alias} - ${type.name}</option>`);
       }; 
    }    
  }
  catch(err) {
    console.log('failed to lead types. ' + err.message);    
  }   
}

async function loadBusinesses() {
  try {
    const response = await strykeGet('data?entityType=business');    
    if (response && response.data && response.data.data && response.data.data.dataRecords) {
       for (const type of response.data.data.dataRecords) {
         $('#business').append(`<option value="${type.id}">${type.alias} - ${type.name}</option>`);
       }; 
    }    
  }
  catch(err) {
    console.log('failed to lead businesses. ' + err.message);    
  }   
}