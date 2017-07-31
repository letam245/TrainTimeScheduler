$(document).ready(function () {
//=========================================================//
// restric user input to number only for frequency input
//=========================================================//
	displayTime()
  //called when key is pressed in textbox
  $("#frequency").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#errmsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
  });

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBglr-3EinM3ITny-0SHhT12_iino8hvcs",
    authDomain: "train-schedule-32ac8.firebaseapp.com",
    databaseURL: "https://train-schedule-32ac8.firebaseio.com",
    projectId: "train-schedule-32ac8",
    storageBucket: "",
    messagingSenderId: "1089724172543"
  };
  firebase.initializeApp(config);

// variable to reference the database
 var database = firebase.database();

 var timeNow = moment(); 

//capture the onclick function
$('#add-train').on('click', function(){
	// Don't refresh the page!
    event.preventDefault();

    //get the user input
    var trainName = $('#trainName').val().trim();
	var destination = $('#destination').val().trim();
	//pushed back 1 year to make sure it comes before current time
	var firstTrainUnix = moment($('#firstTrain').val().trim(), 'hh:mm').subtract(1, 'years').format('X');
	var frequency = $('#frequency').val().trim();
	
	// var firstTrainConverted = moment(firstTrain, 'hh:mm').subtract(1, 'years').format('X');
	// console.log('firstTrainConverted ' + firstTrainConverted);

	//current time
	//var currentTime = moment();
	//console.log('current time: ' + currentTime)
	//var currentTimeConvert = currentTime.format('hh:mm');

	//Difference between the times
	// var diffTime = moment().diff(moment,unix(firstTrainConverted), "minutes");
	// console.log("DIFFERENCE IN TIME: " + diffTime);

	// //time remaind
	// var timeRemaind = moment().diff(moment.unix(firstTrainConverted), 'minutes') % frequency;
	// console.log('time remain:' + timeRemaind);

	// //minutes away (minutes untill train)
	// var minAway = frequency - timeRemaind;
	// console.log("MINUTES TILL TRAIN: " + minAway);

	// //next train arrival
	// var nextArrival = moment().add(minAway, 'm').format('hh:mm A');
	// // var nextArrivalConvert = moment(nextArrival).format("hh:mm");
	// console.log("ARRIVAL TIME: " + nextArrivalConvert);

	var newTrain ={
		name: trainName,
		destination: destination,
		firstTrain: firstTrainUnix,
		frequency: frequency
	}
	//storing and retrieving the most recent user.
	database.ref().push(newTrain);

	console.log("newTrain Name: " + newTrain.name);
	console.log("newTrain destination: " + newTrain.destination);
	console.log("newTrain firstTrain: " + firstTrainUnix);
	console.log("newTrain frequency: " + newTrain.frequency);


	$('#trainName').val('');
	$('#destination').val('');
	$('#firstTrain').val('');
	$('#frequency').val('');

	return false;

});

//firebase snapshot
database.ref().on('child_added', function(childSnapshot){

	console.log(childSnapshot.val());

	var tName = childSnapshot.val().name;
	var tDestination = childSnapshot.val().destination;
	var tFrequency = childSnapshot.val().frequency;
	var tFirstTrain = childSnapshot.val().firstTrain;

	var diffTime = moment().diff(moment.unix(tFirstTrain), 'minutes');
	var tRemainder = moment().diff(moment.unix(tFirstTrain), 'minutes') % tFrequency;
	var tMinutes = tFrequency - tRemainder;

	var tArrival = moment().add(tMinutes, 'm').format('hh:mm')

	
	console.log("diffTime: " + diffTime);
	console.log("tFirstTrain: " + tFirstTrain);
	console.log("tRemainder: " + tRemainder);
	console.log("tMinute: " + tMinutes);
	console.log("tArrival: " + tArrival);


	$('#train-table > tbody').append(
	'<tr><td>' + tName.toUpperCase() + 
	'</td><td>' + tDestination.toUpperCase() + 
	'</td><td>' + tFrequency+ 
	'</td><td>' + tArrival + 
	'</td><td>' + tMinutes + '</td></tr>' 

	)
},	function(errorObject){
		console.log('the value failed: ' + errorObject.code);
});

function displayTime() {
    var time = moment().format('hh:mm A');
    $('#current-time').html('Current time is: '+ time);
    setInterval(displayTime, 1000);
}


