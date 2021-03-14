function active_2(){
    let password = $("#pswrd_1").val();
    let confirmPassword = $("#pswrd_2").val();
    password != confirmPassword ? $("#divCheckPasswordMatch").html("Passwords do not match!") : $("#divCheckPasswordMatch").html("Passwords match.");
}
