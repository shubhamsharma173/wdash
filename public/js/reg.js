$(document).ready(function () {
  $("#regForm").submit(function (e) {
    e.preventDefault();
  });
  togRadios1();
  togRadios2();
  other_1();
  other_2();
  $("body").removeAttr("class");
});

function active_2() {
  let password = $("#pswrd_1").val();
  let confirmPassword = $("#pswrd_2").val();
  password != confirmPassword
    ? $("#divCheckPasswordMatch").html("Passwords do not match!")
    : ($("#divCheckPasswordMatch").html("Passwords match."),
      setTimeout(function () {
        $("#divCheckPasswordMatch").fadeOut();
      }, 800));
}

function togRadios1() {
  $("#check4").prop("checked") ? $("#rGroup1").show() : $("#rGroup1").hide();
}

function togRadios2() {
  $("#check7").prop("checked") ? $("#rGroup2").show() : $("#rGroup2").hide();
}

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

function checkValidation() {
  let password = $("#pswrd_1").val();
  let confirmPassword = $("#pswrd_2").val();
  if (password != confirmPassword) {
    /*Toaster Alert*/
    $.toast({
      heading: "Passwords do not match!",
      text: "<p>Please check and try again.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-warning",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else if (
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
    $("#personal_intrest_other").val().trim() == ""
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

function registerUser() {
  if (checkValidation()) {
    $.ajax({
      type: "POST",
      url: "/register/member",
      data: $("#regForm").serialize(), // serializes the form's elements.
      success: function (data) {
        if (data == "success") {
          $("body").removeAttr("class");
          /*Toaster Alert*/
          $.toast({
            heading: "Success!",
            text: "<p>Registration successful, you will be soon redirected to login page.</p>",
            position: "top-right",
            loaderBg: "#F46B68",
            class: "jq-toast-success",
            hideAfter: 3500,
            stack: 6,
            showHideTransition: "fade",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          /*Toaster Alert*/
          $.toast({
            heading: "Oops!",
            text: "<p>" + data + ".</p>",
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
}
