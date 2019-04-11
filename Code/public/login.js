
function loginUser(){
    let url = window.location.origin;
    let username = $('#uname').val();
    let password = $('#pword').val();

    let loginObj = {
      username: username,
      password: password
    }

    $.ajax({
      url: url + '/user/login/',
      method: 'POST',
      data: loginObj,
      dataType: 'JSON',
      success: (data, res) => {
        if (data.success != null) {
          console.log("Successful Login");
          window.location.replace(url + '/dashboard');
        }
      },
      error: (data, res) => {
        $('.login-error-text').removeClass('hidden');
        $('#uname').addClass('error');
        $('#pword').addClass('error');
      }
    });
}

$('#login-button').click(loginUser);
