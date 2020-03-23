$("#login").click(async () => {  
  const username = $("#username").val();
  const password = $("#password").val();
  
  try {
    const response = await strykeLogin(username, password);
    window.location.href = '/index.html';
  }
  catch (e) {
    $("#errorMsg").text(e.message);    
  }
});

