$(document).ready(function() {



  var config = {
    apiKey: "AIzaSyD4P_H2eWWyhuvl_82FlApYH6nFo7OwS2c",
    authDomain: "gaming-7adfc.firebaseapp.com",
    databaseURL: "https://gaming-7adfc.firebaseio.com",
    projectId: "gaming-7adfc",
    storageBucket: "gaming-7adfc.appspot.com",
    messagingSenderId: "874101141014"
  };
  firebase.initializeApp(config);


  // Establish to identify which branch of our Firebase Database
  var db = firebase.database();

  var blue_db = firebase.database().ref('blue_team/points');
  var red_db = firebase.database().ref('red_team/points');

  var blue_players_db = firebase.database().ref('blue_team/players');
  var red_players_db = firebase.database().ref('red_team/players');

	// //var red_total;
  // 	setInterval(function() {
  //
  // 	setTimeout(function() {
  //     //Execute first function
  //   show_result();
  //   setTimeout(function() {
  //         //Execute second function
  //   reset_data();
  //
  // }, 10000);
  //
  // }, 1);
  //
  //
  // }, 5 * 60 * 1000);

  //..............
  //result show function

	// TIMER
	// $('.timer').
	setInterval(function() {
		var currentTime = $('.timer .count').text();
		currentTime--;
		$('.timer .count').text(currentTime);

		if (currentTime == -1) {
			//alert('DONE');
			reset_data();

		}
	}, 1000)


	// New FB branch for the reset command
	var remoteBranch = firebase.database().ref('remote');

	// On click change the FB command value to 'reset'
	$('#reset').click(function() {
		remoteBranch.set('reset');
	})

	// Listen to FB infinitely
	var getDataFromRemoteBranch = function() {

		// If the branch value has changed then to this...
		remoteBranch.on('value', function(snapshot) {

			var command = snapshot.val();

			console.log(command);

			// If command reset is added
			if (command == 'reset') {
				// Reset the game
				reset_data();
				// Brings the balue back to no-reset
				remoteBranch.set('no-reset');

			}

		});
	}

	getDataFromRemoteBranch();


  function show_result() {
    var blue_final_score, red_final_score;
    blue_db.once('value', function(snapshot) {
      blue_final_score = snapshot.val();
    });
    red_db.once('value', function(snapshot) {
      red_final_score = snapshot.val();
    });
    $("#blue_main,#red_main").hide();
    //alert(blue_final_score );
    if (blue_final_score > red_final_score) {
      $(".blue_team").text("WINNING");
      $(".red_team").text("LOSING");

    } else {
      $(".red_team").text("WINNING");
      $(".blue_team").text("LOSING");
    }

    $("#finish_main").show();
    $('.sound2').get(0).play();
  }
  //.................
  //reset data
  function reset_data() {
    blue_db.set(50);
    red_db.set(50);
    blue_players_db.remove();
    red_players_db.remove();
    //red_players_db.child(players).removeValue();
    window.location.href = 'index.html';
    $("#blue_main,#red_main").show();
    $("#finish_main").hide();

  }


  $(window).resize(function() {
    //resize just happened, pixels changed
    location.reload();
  });

  var height = $(document).height();
  $("#main,#blue_main,#red_main,#finish_main").css("height", height);

  var width = $(document).width();
  $("#main,#blue_main,#red_main,#finish_main").css("width", width);



  $(".blue_box1,.red_box2").on("click", function() {

    if (this.className == "blue_box1") {
      window.location.href = 'blue.html';
    } else {


      var url = "red.html";
      $(location).attr('href', url);

    }


  });



  var blue_width = $(".blue").css("width");
  blue_width = parseInt(width, 10);

  var red_width = $(".red").css("width");
  red_width = parseInt(width, 10);

  $("#red_main").on("click", function() {

    $('.sound1').get(0).play();

    //i++;
    //var ref = db.child('red').val();
    show_red_Coords(event);

    red_db.transaction(function(currentClicks) {
      // If node/clicks has never been set, currentRank will be `null`.
      var newValue = currentClicks;
      if (newValue >= 100) {
        return; // abort the transaction
      } else {
        newValue += 5;
      }



      //alert(newValue);
      return newValue;
    });

    blue_db.transaction(function(currentClicks) {
      // If node/clicks has never been set, currentRank will be `null`.
      var newVal = currentClicks;

      if (newVal == 0) {
        return; // abort the transaction
      } else {
        newVal -= 5;
      }


      return newVal;
    });


  });



  $("#blue_main").on("click", function() {

    $('.sound1').get(0).play();
    //var ref = db.child('red').val();
    show_blue_Coords(event);

    blue_db.transaction(function(currentClicks) {
      // If node/clicks has never been set, currentRank will be `null`.
      newValu = currentClicks;
      if (newValu >= 100) {
        return; // abort the transaction
      } else {
        newValu += 5;
      }



      //alert(newValue);
      return newValu;
    });

    red_db.transaction(function(currentClicks) {
      // If node/clicks has never been set, currentRank will be `null`.
      newVa = currentClicks;
      if (newVa == 0) {
        return; // abort the transaction
      } else {
        newVa -= 5;
      }

      return newVa;
    });



  });




  $("#finish_main").hide();
  blue_db.on('value', function(snapshot) {

    $(".blue").css("width", snapshot.val() + "%");

  });

  red_db.on('value', function(snapshot) {

    $(".red").css("width", snapshot.val() + "%");

  });




  function show_red_Coords(event) {
    var x = event.clientX;
    var y = event.clientY;
    var data = {
      x_value: x,
      y_value: y

    };



    // Pushes a new item to our Firebase database
    red_players_db.push({
      x_value: x,
      y_value: y,
      user: "P2"
    });


    // Recieve Data from Firebase
    var getDataFromFirebase = function() {
      red_players_db.on('child_added', function(myFirebaseItem) {
        var firebaseChild = myFirebaseItem.val();
        var theActualMessage = firebaseChild.x_value;
        var theActualMessage2 = firebaseChild.y_value;
        var theActualMessage3 = firebaseChild.user;

        $('#red_main').append('<div style="left:' + theActualMessage + 'px;top:' + theActualMessage2 + 'px;position:absolute;color:white;font-size:10px;">' + theActualMessage3 + '</div>');

      });
    }

    getDataFromFirebase();


    // Recieve Data from Firebase
    var getDataFromFirebase2 = function() {
      blue_players_db.on('child_added', function(myFirebaseItem) {
        var firebaseChild = myFirebaseItem.val();
        var theActualMessage = firebaseChild.x_value;
        var theActualMessage2 = firebaseChild.y_value;
        var theActualMessage3 = firebaseChild.user;

        $('#red_main').append('<div class="blue_dot" style="left:' + theActualMessage + 'px;top:' + theActualMessage2 + 'px;position:absolute;"></div>');

      });
    }

    getDataFromFirebase2();

  }


  function show_blue_Coords(event) {
    var x = event.clientX;
    var y = event.clientY;


    // Pushes a new item to our Firebase database
    blue_players_db.push({
      x_value: x,
      y_value: y,
      user: "P1"
    });


    // Recieve Data from Firebase
    var getDataFromFirebase = function() {
      blue_players_db.on('child_added', function(myFirebaseItem) {
        var firebaseChild = myFirebaseItem.val();
        var theActualMessage = firebaseChild.x_value;
        var theActualMessage2 = firebaseChild.y_value;
        var theActualMessage3 = firebaseChild.user;

        $('#blue_main').append('<div style="left:' + theActualMessage + 'px;top:' + theActualMessage2 + 'px;position:absolute;color:white;font-size:10px;">' + theActualMessage3 + '</div>');

      });
    }

    getDataFromFirebase();



    // Recieve Data from Firebase
    var getDataFromFirebase2 = function() {
      red_players_db.on('child_added', function(myFirebaseItem) {
        var firebaseChild = myFirebaseItem.val();
        var theActualMessage = firebaseChild.x_value;
        var theActualMessage2 = firebaseChild.y_value;
        var theActualMessage3 = firebaseChild.user;

        $('#blue_main').append('<div class="red_dot" style="left:' + theActualMessage + 'px;top:' + theActualMessage2 + 'px;position:absolute;"></div>');

      });
    }

    getDataFromFirebase2();

  }



});
