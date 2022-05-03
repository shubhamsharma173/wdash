$(document).ready(function () {
  $("#regForm").submit(function (e) {
    e.preventDefault();
  });
  togRadios1();
  togRadios2();
  other_1();
  other_2();
  // $.toast().reset("all");
  $("body").removeAttr("class");
  // $.toast({
  //   text: '<p>Registration successful, you will be soon redirected to login page.</p>',
  //   position: " top-right",
  //   loaderBg: "#7a5449",
  //   class: "jq-has-icon jq-toast-success",
  //   hideAfter: 5000,
  //   stack: 6,
  //   showHideTransition: "fade",
  // });
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

function registerUser() {
  let password = $("#pswrd_1").val();
  let confirmPassword = $("#pswrd_2").val();
  if (password != confirmPassword) {
    alert("Passwords do not match!");
  } else {
    $.ajax({
      type: "POST",
      url: "/register/member",
      data: $("#regForm").serialize(), // serializes the form's elements.
      success: function (data) {
        if (data == "success") {
          // $.toast().reset("all");
          $("body").removeAttr("class");
          alert('Registration successful, you will be soon redirected to login page.');
          // $.toast({
          //   text: '<p>Registration successful, you will be soon redirected to login page.</p>',
          //   position: "top-right",
          //   loaderBg: "#7a5449",
          //   class: "jq-has-icon jq-toast-success",
          //   hideAfter: 5000,
          //   stack: 6,
          //   showHideTransition: "fade",
          // });
          setTimeout(()=>{
            window.location.href = "/login";
          },1500)
        } else {
          alert(data);
        }
      },
    });
  }
}
