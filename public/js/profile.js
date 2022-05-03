$(document).ready(function () {
  $("#prof :input").prop("disabled", true);

  other_1();
  other_2();
  getUserInfo();
});

function other_1() {
  // console.log($("#other1").val());
  $("#other1").val() == "Other"
    ? $("#otherdiv1").show()
    : $("#otherdiv1").hide();
}
function other_2() {
  // console.log($("#other1").val());
  $("#other2").val() == "Other"
    ? $("#otherdiv2").show()
    : $("#otherdiv2").hide();
}

function editinfo() {
  $("#prof :input").prop("disabled", false);
  $("#save").show();
  $("#cancel").show();
  $("#edit").hide();
}
function saveinfo() {
  if (checkValidation()) {
    $("#prof :input").prop("disabled", true);
    $("#edit").show();
    $("#save").hide();
    $("#cancel").hide();
    sendInfo();
  }
}
function cancelinfo() {
  $("#prof :input").prop("disabled", true);
  $("#edit").show();
  $("#save").hide();
  $("#cancel").hide();
}

function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/getUserInfo",
    success: function (response) {
      if (response.OPstatus == 1) {
        let data = response.data;
        $("#fnameHead").html(data.fName);
        $("#_id").val(data._id);

        $("#fName").val(data.fName);
        $("#lName").val(data.lName);
        $("#dob").val(data.dob);
        $("#dod").val(data.dod);
        $("#gender").val(data.gender);
        $("#other1").val(data.healthIssue);
        $("#health_issue_other").val(data.health_issue_other);
        $("#lName").val(data.lName);
        $("#maritialStatus").val(data.maritialStatus);
        $("#mobile").val(data.mobile);
        $("#other2").val(data.personalIntrest);
        $("#personal_interest_other").val(data.personal_intrest_other);
        $("#postal").val(data.postal);
        $("#stage").val(data.stage);
        data.check1 == "Matching"
          ? $("#check1").prop("checked", true)
          : $("#check1").prop("checked", false);
        data.check2 == "Magazine"
          ? $("#check2").prop("checked", true)
          : $("#check2").prop("checked", false);
        data.check3 == "Groups"
          ? $("#check3").prop("checked", true)
          : $("#check3").prop("checked", false);
        other_1();
        other_2();
      } else {
        /*Toaster Alert*/
        $.toast({
          heading: "Oops!",
          text: "<p>" + response.data + "</p>",
          position: "top-right",
          loaderBg: "#F46B68",
          class: "jq-toast-danger",
          hideAfter: 3500,
          stack: 6,
          showHideTransition: "fade",
        });
      }
    },
    error: function (error) {
      console.log(error);
      /*Toaster Alert*/
      $.toast({
        heading: "Oops!",
        text: "<p>Something went wrong, please try again.</p>",
        position: "top-right",
        loaderBg: "#F46B68",
        class: "jq-toast-danger",
        hideAfter: 3500,
        stack: 6,
        showHideTransition: "fade",
      });
    },
  });
}

function checkValidation() {
  if (
    $("#other1").val() == "Other" &&
    $("#health_issue_other").val().trim() == ""
  ) {
    /*Toaster Alert*/
    $.toast({
      heading: "Empty field!",
      text: "<p>Please enter other health issue.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-warning",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else if (
    $("#other2").val() == "Other" &&
    $("#personal_interest_other").val().trim() == ""
  ) {
    /*Toaster Alert*/
    $.toast({
      heading: "Empty field!",
      text: "<p>Please enter other personal intrest.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-warning",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else {
    return true;
  }
}

function sendInfo() {
  let formData = {
    _id: $("#_id").val(),
    fName: $("#fName").val(),
    lName: $("#lName").val(),
    dob: $("#dob").val(),
    dod: $("#dod").val(),
    gender: $("#gender").val(),
    healthIssue: $("#other1").val(),
    health_issue_other: $("#health_issue_other").val(),
    lName: $("#lName").val(),
    maritialStatus: $("#maritialStatus").val(),
    mobile: $("#mobile").val(),
    personalIntrest: $("#other2").val(),
    personal_intrest_other: $("#personal_interest_other").val(),
    postal: $("#postal").val(),
    stage: $("#stage").val(),
    check1: $('#check1').prop('checked') ? "Matching" : '',
    check2: $('#check2').prop('checked') ? "Magazine" : '',
    check3: $('#check3').prop('checked') ? "Groups" : '',
  };
  $.ajax({
    type: "POST",
    url: "/updateUserInfo",
    data: formData,
    success: function (response) {
      if (response.OPstatus == 1) {
        /*Toaster Alert*/
        $.toast({
          heading: "Success!",
          text: "<p>Details saved.</p>",
          position: "top-right",
          loaderBg: "#F46B68",
          class: "jq-toast-success",
          hideAfter: 3500,
          stack: 6,
          showHideTransition: "fade",
        });
        getUserInfo();
      } else {
        /*Toaster Alert*/
        $.toast({
          heading: "Oops!",
          text: "<p>" + response.data + ".</p>",
          position: "top-right",
          loaderBg: "#F46B68",
          class: "jq-toast-danger",
          hideAfter: 3500,
          stack: 6,
          showHideTransition: "fade",
        });
      }
    },
    error: function (error) {
      console.log(error);
      /*Toaster Alert*/
      $.toast({
        heading: "Oops!",
        text: "<p>Something went wrong, please try again.</p>",
        position: "top-right",
        loaderBg: "#F46B68",
        class: "jq-toast-danger",
        hideAfter: 3500,
        stack: 6,
        showHideTransition: "fade",
      });
    },
  });
}
