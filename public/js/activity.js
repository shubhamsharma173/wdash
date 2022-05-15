$(document).ready(function () {
  getUserInfo();
  getUserPosts(currentPage);
  $("#submitPost").submit(function (e) {
    e.preventDefault();
  });
});
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDkkYiA4GEvCl47EDx9LWckziZ4ghTMNCI",
  authDomain: "whealthway-6033b.firebaseapp.com",
  projectId: "whealthway-6033b",
  storageBucket: "whealthway-6033b.appspot.com",
  messagingSenderId: "616500752971",
  appId: "1:616500752971:web:aaa48f6d646fc648f9d3ce",
  measurementId: "G-FX9N7NKJL0",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

async function uploadActivity(file) {
  // let file = event.target.files[0];
  let newimageid = new Date().getTime();
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type,
  };
  const ref = firebase.storage().ref("activityFeed");
  const task = ref.child(name).put(file, metadata);
  const resp = await task
    .then(function (snapshot) {
      return snapshot.ref.getDownloadURL();
    })
    .then(function (url) {
      // console.log("dwnld url: ", url);
      return url;
      // document.querySelector('#someImageTagID').src = url;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
  return resp;
  // (upload = firebase.storage().ref("Activity/" + newimageid + ".png").putString(myImage.replace("data:image/png;base64,", ""), "base64")), upload.on("state_changed",

  // function progress(snapshot) {
  //     var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log(percentage);
  // },

  // function error() {
  //     alert("error uploading file");
  // },

  // function complete() {

  //     upload.snapshot.ref
  //         .getDownloadURL()
  //         .then(function (downloadURL) {
  //             console.log("imageUrl: ",downloadURL);
  //         });
  // }

  // );
}

let postFile = null,
  userId = "",
  userName = "",
  currentPage = 0;

async function handleSubmit() {
  if (checkValidation()) {
    $("#loader").show();
    let resp = await uploadActivity(postFile);
    // console.log(resp);
    if (resp != null) {
      $.ajax({
        type: "POST",
        url: "/activity/savepost",
        data:
          $("#submitPost").serialize() +
          "&userName=" +
          userName +
          "&userId=" +
          userId +
          "&url=" +
          resp +
          "&type=image", // serializes the form's elements.
        success: function (response) {
          $("#loader").hide();
          if (response.OPstatus != -1) {
            getUserPosts(0);
            $.toast({
              heading: "Success!",
              text: "<p>" + response.data + "</p>",
              position: "top-right",
              loaderBg: "#F46B68",
              class: "jq-toast-success",
              hideAfter: 3500,
              stack: 6,
              showHideTransition: "fade",
            });
            $("#createpostModal").modal("hide");
            $("#title").val("");
            $("#description").val("");
            $("#postFile").val(null);
          } else {
            $.toast({
              heading: "error!",
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
          $("#loader").hide();
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
    } else {
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
    }
  }
}

async function setFile(e) {
  let file = e.target.files[0];
  postFile = typeof file != "undefined" ? file : null;
}

function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/getUserInfo",
    success: function (response) {
      userId = response.data._id;
      userName = "" + response.data.fName + " " + response.data.lName;
    },
    error: function (error) {
      console.log(error);
      /*Toaster Alert*/
      $.toast({
        heading: "Oops!",
        text: "<p>Something went wrong, please refresh page.</p>",
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
  if (postFile == null) {
    $.toast({
      heading: "Error!",
      text: "<p>Please upload file.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-danger",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else if ($("#title").val().trim() == "") {
    $.toast({
      heading: "Error!",
      text: "<p>Please add title.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-danger",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else if ($("#description").val().trim() == "") {
    $.toast({
      heading: "Error!",
      text: "<p>Please add description.</p>",
      position: "top-right",
      loaderBg: "#F46B68",
      class: "jq-toast-danger",
      hideAfter: 3500,
      stack: 6,
      showHideTransition: "fade",
    });
    return false;
  } else {
    return true;
  }
}

function getUserPosts(pg) {
  if (pg == 0) {
    $("#allPosts").html("");
  }
  $.ajax({
    type: "GET",
    url: "/activity/getuserposts/" + pg,
    success: function (response) {
      //   console.log(response);
      if (response.data.postLeftCount < 1) {
        $("#loadMore").prop("disabled", true);
        $("#loadMore").html("You are all caught up!");
      } else {
        $("#loadMore").prop("disabled", false);
        $("#loadMore").html("Load More ...");
      }
      response.data.docs.forEach(function (item) {
        const now = Date.now();
        const m1 = moment(now);
        const m2 = moment(item.time);
        const duration = moment.duration(m2.diff(m1)).humanize(true);
        const postUrl = item.url.split("activityFeed");
        const name = postUrl[1].split("?")[0];
        const finalUrl =
          postUrl[0] +
          "activityFeed" +
          encodeURIComponent(name) +
          "?" +
          postUrl[1].split("?")[1];
        const post =
          `<div class="media">
        <div class="media-img-wrap">
          <div
            class="avatar avatar-sm"
            style="background: #eefff3; border-radius: 115px"
          >
            <img
              src="/images/user.png"
              alt="user"
              class="avatar-img rounded-circle"
            />
          </div>
        </div>
        <div class="media-body">
          <div>
            <span class="d-block mb-5"
              ><span
                class="font-weight-500 text-dark text-capitalize"
                >` +
          item.userName +
          `</span
              ></span
            >
            <span class="d-block font-13 mb-30">` +
          duration +
          `</span>
          </div>
          <div class="card d-inline-block w-sm-500p w-80">
            <div class="card-body">
              <div class="d-flex flex-wrap">
                <img
                  class="rounded mb-15 mr-15 w-100"
                  src=` +
          finalUrl +
          `
                  alt="thumb"
                />
                <div class="w-100">
                  <h6 class="mb-5">` +
          item.title +
          `</h6>
                  <p>` +
          item.description +
          `</p>
                </div>
              </div>
            </div>
            
            </div>
          </div>
        </div>
      </div>`;
        $("#allPosts").append(post);
      });
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

function loadMore() {
  currentPage += 1;
  getUserPosts(currentPage);
}

function addLike() {}
