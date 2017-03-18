  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrwqsT7E1xVF7ifgwwmQ3Fv9UXeemABbM",
    authDomain: "empdata-3c888.firebaseapp.com",
    databaseURL: "https://empdata-3c888.firebaseio.com",
    storageBucket: "empdata-3c888.appspot.com",
    messagingSenderId: "375596604123"
  };
  firebase.initializeApp(config);

    // Variables to reference the database
  var database = firebase.database();
  var trainName="";
  var destination="";
  var frequency="";
  var firstTrainTime = "";
  var nextTrain = "";
  var nextTrainFormatted = "";
  var minutesAway = "";
  var firstTimeConverted = "";
  var currentTime = "";
  var diffTime = "";
  var tRemainder = "";
  var minutesTillTrain = "";
  var keyHolder = ''; 
  var getKey="";



$(document).ready(function() {

    // Captures Button Click
    $("#submit").on("click", function() {
      
      event.preventDefault();


    // Code logic for storing and retrieving the most recent user.
     var trainName = $("#trainName").val().trim();
     var destination = $("#destination").val().trim();
     var firstTrainTime = $("#start-time").val().trim();
     var frequency = $("#frequency").val().trim();

        // console.log(firstTrainTime); 
    firstTimeConverted = moment(firstTrainTime, "hh:mm")
        // console.log(firstTimeConverted); 

    currentTime = moment();
        // console.log(currentTime);

    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log(diffTime);   
       
    tRemainder = diffTime % frequency;
        // console.log(tRemainder);


    minutesTillTrain = frequency - tRemainder;
        // console.log(minutesTillTrain);  

    nextTrain = moment().add(minutesTillTrain, "minutes");
        // console.log(nextTrain);

    nextTrainFormatted = moment(nextTrain).format("hh:mm")
        // console.log(nextTrainFormatted);


  keyHolder = database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency, 
        nextTrainFormatted: nextTrainFormatted,
        minutesTillTrain: minutesTillTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

      });


      $("#trainName").val('');
      $("#destination").val('');
      $("#start-time").val('');
      $("#frequency").val('');

      return false;

    });


// Firebase "watcher" 
      database.ref().on("child_added", function(childSnapshot) {
      // console.log(childSnapshot.key);




      $(".tbody").append("<tr id="+childSnapshot.key+"><td>"+ childSnapshot.val().trainName +"</td>"+
                        "<td>"+ childSnapshot.val().destination +"</td>"+
                        "<td>"+ childSnapshot.val().frequency +"</td>"+
                        "<td>"+ childSnapshot.val().nextTrainFormatted+"</td>"+
 
                        "<td>"+childSnapshot.val().minutesTillTrain+"</td>"+
                        "<td class='remove'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>"+ 
                        "</td>"+"</tr>");

    //Error Handling
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);

    });

// Removing items
$("body").on("click", ".remove-train", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     // console.log(getKey);
     database.ref(getKey).remove();
});
});