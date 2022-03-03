$(document).ready(function () {
  
    togRadios1();
    togRadios2();
    other();
});

function active_2() {
  let password = $("#pswrd_1").val();
  let confirmPassword = $("#pswrd_2").val();
  password != confirmPassword
    ? $("#divCheckPasswordMatch").html("Passwords do not match!")
    : $("#divCheckPasswordMatch").html("Passwords match.");
}

function togRadios1() {
  $("#check4").prop("checked") ? $("#rGroup1").show() : $("#rGroup1").hide();
}

function togRadios2() {
  $("#check7").prop("checked") ? $("#rGroup2").show() : $("#rGroup2").hide();
}

function other() {
  // console.log($("#other1").val());
  $("#other1").val() == "Other" ? $("#otherdiv").show() : $("#otherdiv").hide();
}
