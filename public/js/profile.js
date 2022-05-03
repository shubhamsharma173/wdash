$(document).ready(function () {
    $("#prof :input").prop("disabled", true);
    togRadios1();
    togRadios2();
    other_1();
    other_2();
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

function other_1() {
  // console.log($("#other1").val());
  $("#other1").val() == "Other" ? $("#otherdiv1").show() : $("#otherdiv1").hide();
}
function other_2() {
  // console.log($("#other1").val());
  $("#other2").val() == "Other" ? $("#otherdiv2").show() : $("#otherdiv2").hide();
}

function editinfo() {
    $("#prof :input").prop("disabled", false);
    $('#save').show();
    $('#cancel').show();
    $('#edit').hide();
}
function saveinfo() {
    $("#prof :input").prop("disabled", true);
    $('#edit').show();
    $('#save').hide();
    $('#cancel').hide();
}
function cancelinfo() {
    $("#prof :input").prop("disabled", true);
    $('#edit').show();
    $('#save').hide();
    $('#cancel').hide();
}