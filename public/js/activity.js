$(document).ready(function () {
  getUserInfo();
  $("#submitPost").submit(function (e) {
    e.preventDefault();
  });
});

let likeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;

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
  currentPage = 0,
  likedPosts = [];

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
      likedPosts = response.data.Userlikedpost;
      getUserPosts(currentPage);
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

        const likeBtn = likedPosts.includes(item._id)
          ? `<button
          title="Dislike"
          class="btn btn-xs btn-primary m-1 rounded-pill p-2 float-right"
          style="top: -10px; position: relative;"
          id="d_` +
            item._id +
            `"
            onclick="toggleLike('dislike',this.id)"
        >
        ` +
            likeSvg +
            `
        </button>`
          : `<button
          title="Like"
          class="btn btn-xs btn-primary m-1 rounded-pill p-2 float-right"
          style="top: -10px; position: relative;color: #61CE70;
          background-color: transparent;"
          id="l_` +
            item._id +
            `"
            onclick="toggleLike('like',this.id)"
        >
        ` +
            likeSvg +
            `
        </button>`;
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
            <div
              class="card-footer text-muted"
              style="display: block"
              id="postFooter_` +
          item._id +
          `"
            >
              <div style="display: inline-block">
                <span class="text-dark" id="count_` +
          item._id +
          `">` +
          item.like +
          `</span> Likes
              </div>` +
          likeBtn +
          `
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

function toggleLike(type, itemId) {
  $("#" + itemId).prop("disabled", true);
  let id = itemId.split("_")[1];
  let route = type != "dislike" ? "addlike" : "dislike";
  const addBtn =
    type != "dislike"
      ? `<button
          title="Dislike"
          class="btn btn-xs btn-primary m-1 rounded-pill p-2 float-right"
          style="top: -10px; position: relative;"
          id="d_` +
        id +
        `"
            onclick="toggleLike('dislike',this.id)"
        >
        ` +
        likeSvg +
        `
        </button>`
      : `<button
          title="Like"
          class="btn btn-xs btn-primary m-1 rounded-pill p-2 float-right"
          style="top: -10px; position: relative;color: #61CE70;
          background-color: transparent;"
          id="l_` +
        id +
        `"
            onclick="toggleLike('like',this.id)"
        >
        ` +
        likeSvg +
        `
        </button>`;
  $.ajax({
    type: "POST",
    url: "/activity/" + route,
    data: "_id=" + id + "&userId=" + userId,
    success: function (response) {
      if (response.OPstatus != -1) {
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
        $("#postFooter_" + id).append(addBtn);
        $("#" + itemId).remove();
        let count = parseInt($("#count_" + id).html());
        if (type != "dislike") {
          count += 1;
          $("#count_" + id).html(count);
        } else {
          count -= 1;
          $("#count_" + id).html(count);
        }
      } else {
        $("#" + itemId).prop("disabled", false);
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
      $("#" + itemId).prop("disabled", false);
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
