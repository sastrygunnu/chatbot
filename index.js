'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
// var basefile = require('.kony-sdk');
// var fs = require('fs');
// var file = fs.readFileSync('./kony-sdk.js', "utf8");



app.set('port', (process.env.PORT || 5000))

let Wit = null;
let log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

function firstEntity(entities, name) {
  return entities &&
    entities[name] &&
    Array.isArray(entities[name]) &&
    entities[name] &&
    entities[name][0];
}

let state = null;

// Function that handles all the text requests and sends them off to the wit.ai service.
// If the request is familiar to wit.ai, the matched intention or entity will determine the reply message.
function handleMessage(sender, question) {
  return wit.message(question).then(({entities}) => {
	const intent = firstEntity(entities, 'intent');
	console.log(intent);
	// const job_type = firstEntity(entities, 'greetings');
	// const bye = firstEntity(entities, 'bye');
	// const project_type = firstEntity(entities, 'project_type');
	// const hackathon_type = firstEntity(entities, 'hackathon_type');

	if(!intent){
		sendGenericMessage(sender);
		// sendTextMessage(sender, "I don't understand what you mean");
		// setTimeout(function(){ sendGenericMessage(sender); }, 100);
		return;	
	}
	sendTextMessage(sender, intent.value);



	
	console.log(kony)



	// if (!intent.value) {
	// 	      // use app data, or a previous context to decide how to fallback
	// 			sendTextMessage(sender, "Im sorry, I didn't fully understand what you are asking, please try again.");
	// 	      return;
	// 	    }
// 	console.log(intent.value)
//     if (!intent && !job_type && !project_type && !bye && !hackathon_type) {
//       // use app data, or a previous context to decide how to fallback
// 		sendTextMessage(sender, "Im sorry, I didn't fully understand what you are asking, please try again.");
//       return;
//     }
// 	if (bye && bye.value) {
// 		state = "goodbye";
// 		sendTextMessage(sender, "Thanks for letting me talk about Johan's experiences.");
// 		setTimeout(function(){ sendTextMessage(sender, "If you have any other questions feel free to message me again 😃 or contact Johan at <j.cornelissen@queensu.ca>."); }, 100);
// 	} else if (hackathon_type && hackathon_type.value) {
// 		switch (hackathon_type.value) {
//   		  case 'Hack Western 4':
// 		  	sendTextMessage(sender, "At Hack Western in 2017, Johan created a hosted Amazon Alexa application for a hands-free weather-to-text service using Amazon Lambda, Twilio and The Weather Network’s API.");
//   			break;
// 	      case 'CS Games 2017':
// 		  	sendTextMessage(sender, "At CS Games 2017, Johan participated in AI (Python), Relay Programming (Python, Java), Web Development (PHP, HTML), and Debugging (10 languages) competitions as part of the Queen's team.");
// 		    break;
// 		  case 'Local Hack Day':
// 		  	sendTextMessage(sender, "At GitHub's Local Hack Day 2017 Johan created a JavaScript web app to bring awareness to the gender 👫 gap in STEM 🔬 related fields through \
// the use of a photo booth 📷 application that collects user demographic information using facial recognition.");
// 			break;
//   	      default:
//   	        console.log(`DEBUG: Unknown Hackathon Type:${hackathon_type.value}`);
//   			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
//   	        break;
// 		}
// 	} else if (project_type && project_type.value) {
// 		switch (project_type.value) {
//   		  case 'QBnB':
// 		  	sendTextMessage(sender, "As part of a 3rd year databases course, Johan helped design a HTML/PHP based web application with a MySQL database for short-term housing rental. \
// The project can be found at https://github.com/johan1252/QBnB.");
// 			//Could use a generic message instead so it's a button link.
//   			break;
// 	      case 'CPU Design Project':
// 		  	sendTextMessage(sender, "In a group of 3 students, Johan designed, implemented and verified a simple RISC processor on an Altera DE0 board. \
// VHDL hardware programming language and Altera Quartus II software was used to design the data path and control units in a systematic approach.");
//   			setTimeout(function(){ sendTextMessage(sender, "The project can be found at https://github.com/johan1252/CPUDesignProject."); }, 100);
// 		    break;
// 		  case 'Autonomous Arduino Robot':
// 		  	sendTextMessage(sender, "As an introductory excercise to Arduino microcontroller programming, Johan designed and programed an Arduino robot to autonomously play a game of basketball.");
// 			setTimeout(function(){ sendTextMessage(sender, "Project can be found on Github at https://github.com/johan1252/ArduinoRobotBasketball."); }, 100);
// 		    break;
// 	      case 'D-FlipFlop Calculator':
// 	  	    sendTextMessage(sender, "Created a interactive javascript web application to assist students and the interested public in verifying D-Flipflop timing diagrams.\
// Interest in the project was sparked through Johan's work as a teaching assistant for ELEC271 - Digital Systems.");
//   			setTimeout(function(){ sendTextMessage(sender, "The web application can be used at http://dffcalculator.johancornelissen.com."); }, 100);  
// 		    break;
//   	      default:
//   	        console.log(`DEBUG: Unknown Project Type:${project_type.value}`);
//   			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
//   	        break;
// 		}
// 	} else if (job_type && job_type.value) {
// 		//if (state === "experience") {
// 			switch (job_type.value) {
// 	  		  case 'ciena':
//   			  	sendTextMessage(sender, "At Ciena 💼, Johan was part of the Platform tools team, contributing to two releases of a new embeddeded software \
// feature, creating mutliple automated test suites, and performing performance analysis contributing to major product simulator performance enhancements.");
// 	  			break;
//   		      case 'project_manager':
// 			  	sendTextMessage(sender, "As a 4th year student at Queen's 🎓, Johan is a project manager for 2 first year engineering student teams. \
// The two teams are responsible for creating a shift log generator application for a community client 👩🏻‍💼. \
// As the project manager, Johan is responsible for advising and mentoring the students 👩🏽‍🎓👨🏻‍🎓, as well as working in partnership with the client and a Queen's faculty advisor.");
//   			    break;
// 			  case 'teaching_assistant':
// 			  	sendTextMessage(sender, "As an upper year student in the Electrical and Computer Engineering department, Johan was a teaching assistant for ELEC271 in both 3rd and 4th year. \
// Johan was responsible for assisting students with laboratory experiments related to using VHDL for programming a Altera Nios II processor 🖥.");
//   			    break;
// 		      case 'photo_manager':
// 		  	    sendTextMessage(sender, "Having been a photography team member 📷 in the past for the Engineering Society at Queen's, Johan was hired on to be the photography manager for the society in the 2015-2016 school year. \
// During this role, Johan managed a team of 6 photographers developing a strong leadership background as well as essential written and verbal communications skills.");
// 			    break;
// 	  	      default:
// 	  	        console.log(`DEBUG: Unknown Job Type:${job_type.value}`);
// 	  			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
// 	  	        break;
// 			}
// 			/*} else {
// 	        console.log(`DEBUG: Job type provided outside of job experience block: ${job_type.value}`);
// 			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
// 		} */
// 	} else {
// 	    switch (intent.value) {
// 	      case 'greeting_resp':
// 			state = "greeting";
// 			sendTextMessage(sender, "That's great!, I am doing well myself 😃.");
// 			setTimeout(function(){ sendTextMessage(sender, "Type a phrase like \"What can you tell me about Johan?\" to get started learning about Johan."); }, 100);
// 			  break;	
// 		  case 'greeting':
//   			state = "greeting";
//   			sendTextMessage(sender, "Hi there, how are you? 😃");
//   			  break;
// 		  case 'whats_up':
// 			state = "whatsup";
//   			sendTextMessage(sender, "I am doing great 😀, how about yourself?");
//   			  break; 
// 		  case 'hobbies':
// 			state = "hobbies";
//   			sendTextMessage(sender, "Johan's hobbies include working on personal projects 🖥, rock climbing 🧗‍♂️, and photography 📷.");
// 		    setTimeout(function(){ sendTextMessage(sender, "For more details on Johan's personal projects, ask \"What are some of Johan's personal projects?\"") }, 100);
//             break;   
// 		  case 'strength_weakness':
//   			state = "strength_weakness";
//     	    sendTextMessage(sender, "Like any human being, Johan has both strengths and weaknesses. \
// Johan is often applauded for his strong work ethic, having grown up on a family farm 🐄, as well as his desire to understand problems conceptually 🤔.");
// 			setTimeout(function(){ sendTextMessage(sender, "A weakness that Johan continues to work on is his ability to work on multiple projects at one time 🤹‍♂️."); }, 100);
// 			break;   
// 		case 'skills_get':
// 			state = "skills";
// 			sendTextMessage(sender, "Johan has strong communication and organization skills 📢, and has made use of the software life-cycle throughout development \
// of software using C, C++, Java, Python, and Bash programming languages 🖥.");
// 			break; 
// 		  case 'interested_in':
// 			state = 'interested';
// 		    sendTextMessage(sender, "Johan has interests in exploring opportunities related to cloud computing ☁️, high-level application development, \
// open-source software, and DevOps 🖥.");
// 			setTimeout(function(){ sendTextMessage(sender, "Feel free to ask about Johan's education, work experience or personal projects for details on his qualifications."); }, 100);
// 			break;   
// 		  case 'description_get':
// 			state = "desc";
// 			sendTextMessage(sender, "Johan is a 4th year Computer Engineering student at Queen’s University 🏫. \
// He can often be found coding personal projects, replacing friends computer hard drives, or rock climbing.");
// 			setTimeout(function(){ sendTextMessage(sender, "Feel free to ask about Johan's education, work experience or personal projects for more details."); }, 100);
// 			  break;
// 		  case 'from_get':
// 			  state = "from";
// 			  sendTextMessage(sender, "Johan was originally born in the Netherlands 🇳🇱. In 2001, Johan's family immigrated to \
// Canada 🇨🇦 to pursue a dairy farming operation.");
// 	      	  break;
// 		  case 'name_meaning':
// 			  state = "meaning";
// 			  sendTextMessage(sender, "Pronouned \"YO-hahn\", the name Johan means \"God is gracious\" when translated from Hebrew.");
// 	          break;
// 		  case 'hire_why':
// 			  state = "why_hire";
// 			  sendTextMessage(sender, "Johan is a great candidate for any computer/software engineering related position due to his continued passion and initiative in every opportunity he embarks on. \
// He has been able to achieve a high acedemic standing, and gained extensive software development experience throughout his 16 month internship.");
// 			  setTimeout(function(){ sendTextMessage(sender, "Feel free to ask about Johan's education, work experience or personal projects for more details."); }, 100);
// 			  break;
// 	      case 'job_experience':
// 			  state = "experience";
// 			  sendTextMessage(sender, "Outside of Johan's personal projects 🖥, and academic achievements 🏫, Johan has gained \
// essential computer engineering experience during his 16 month internship at Ciena in Ottawa 👨‍💻. Additionally, Johan gained essential soft skills through positions such as \
// project manager, photography manager 📷, and teaching assistant 👨‍🏫.");
// 			  setTimeout(function(){ sendTextMessage(sender, "For more detail on a specific experience, ask \"Tell me more about Ciena?\" etc.") }, 100);
// 	          break;
// 		  case 'project_experience':
// 			  state = "projects";
// 			  sendTextMessage(sender, "Some of the projects Johan has worked on include, \"D-FlipFlop Calculator\" - A web application that verifies \
// D-Flipflop timing 🕐 diagrams interactively, \"QBnB\" - a HTML/PHP web application for short term housing rental 🏠, \
// \"CPU Design Project\" - a complete VHDL implementation of a RISC style processor 🖥, and \
// \"Autonomous Arduino Robot\" - an autonomous Arduino robot that competed in a Basketball 🏀 competition.");
// 			  setTimeout(function(){ sendTextMessage(sender, "For more detail on a specific experience, ask \"Tell me more about QBnB?\" etc."); }, 300);
// 	      	  break;
// 		  case 'education_experience':
// 			  state = "education";
// 			  sendTextMessage(sender, "After attending high school in the small town of Russell, Ontario 🏡, Johan started university at Queen's University in Kingston 🏫. \
// When attending Queen's university Johan completed the first year of the general undergraduate engineering program and choose to specialize in Computer Engineering 💻 for his bachelors degree.");
// 			  setTimeout(function(){ sendTextMessage(sender, "During his time at Queen's Johan received the Excellence Entrance Scholarship and the Donovan Brown Scholarship in Applied Science."); }, 200);
// 			  setTimeout(function(){ sendTextMessage(sender, "Johan is anticipated to graduate in April of 2018."); }, 300);
// 	      	  break;
// 		  case 'hackathon_experience':
// 			  state = "hackathon";
// 			  sendTextMessage(sender, "Having the oppertunity to work with other creative students to create unique solutions to real world 🌎 problems is what Johan likes best about hackathons. \
// 			  Some of the hackathon's Johan has attended in the last year include \"Queen's Local Hack day\", \"Hack Western 4\", and \"CsGames 2017\".");
// 	      	  setTimeout(function(){ sendTextMessage(sender, "For more detail on a specific experience, ask \"Tell me more about Hack Western 4?\" etc."); }, 200);
// 			  break;
// 		  default:
// 	        console.log(`DEBUG: Unknown intent:${intent.value}`);
// 			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
// 	        break;
// 	    }
// 	}
  });
}


// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN
});

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// The webhook, this is where all the Facebook Messenger requests will be coming in.
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
	//console.log(messaging_events)
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
        if (event.postback) {
    	    let text = JSON.stringify(event.postback);
    	    //sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
    	    sendTextMessage(sender, "You can ask me..Something like")
			setTimeout(function(){ sendTextMessage(sender, "Can you send me my boarding pass?"); }, 100);
			setTimeout(function(){ sendTextMessage(sender, "Update my flight status?"); }, 100);
			setTimeout(function(){ sendTextMessage(sender, "or if you want to talk to human - Just say - talk to human"); }, 100);

    	    continue
        }
      if (event.message && event.message.text) {
  	    let textIn = event.message.text
  		if (event.message.is_echo){
  			//Don't react to chatbot's own messages.
  			continue;
  		} else {

		  //General case send to AI
          // We retrieve the message content
          const {text, attachments} = event.message;
					
          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            sendTextMessage(sender, 'Sorry I can only process text messages for now. 🙁')
            .catch(console.error);
					} 
					if(text === "update my flight status?"){
						sendTextMessage(sender, 'Oh no seems some delay 🙁')
						flightdelay(sender);
						continue;
					}
		
					if(text === "talk to human"){
						sendTextMessage(sender, "Sure thing, soon my human colleagues will contact you ")
						setTimeout(function(){ sendTextMessage(sender, "I'm leaving now, it was nice talking to you 🙂"); }, 100);
						setTimeout(function(){ sendTextMessage(sender, "You can call me back at any moment by Saying My Name - Jambo"); }, 100);
						continue;
					}
		
					if(text === "jambo"){
						sendTextMessage(sender, "Hey I'm back 🙂, how can I help you?")
						continue;
					}
					if(text === "so nice"){
						sendTextMessage(sender, "Glad you like it 🙂")
						continue;
		
					}

					if(text === "thank you"){
						sendTextMessage(sender, "You are welcome 🙂")
						continue;
		
					}
		
					if(text === "can you send me my boarding pass?"){
						sendTextMessage(sender, "Sure..here the your boarding pass");
						bordingpass(sender);
						continue;
		
					}
		
					if(text === "book my ticket"){
						sendTextMessage(sender, "Opps Sorry i cannot book now im still under development ask me some time later please?");
						continue;
		
					}
		
					if(text === "hi"){
						sendTextMessage(sender, "My Name is Jambo. Chat bot assistant for you.. How can i help you today?");
						continue;
					}

					if(text === "hello"){
						sendTextMessage(sender, "My Name is Jambo. Chat bot assistant for you.. How can i help you today?");
						continue;
					}

					if(text === "about the bot"){
						
						sendTextMessage(sender, "I'm Jambo chatbot and autoresponder");
						setTimeout(function(){ sendTextMessage(sender, "I was created by Sastry From Kony who always improving me,"); }, 100);
						setTimeout(function(){ sendTextMessage(sender, "for which I'm very thankful."); }, 200);
						setTimeout(function(){ sendTextMessage(sender, "Who knows, maybe someday I will have my own thoughts 🙂"); }, 300);
						setTimeout(function(){ sendTextMessage(sender, "But before that bright day I would like to share a secret with you.. do you know you can book a flight ticket direct right here?"); }, 400);
						setTimeout(function(){ sendTextMessage(sender, "How to do that and to learn more just say book my ticket"); }, 500);
						continue;
		
					}
					else if (text) {
						
						// We received a text message
						console.log(" messags: " + event.message);
			console.log("Handling message: " + text);
			handleMessage(sender, text);
		
			
          }
		
	  	}
      }

    }
	
	//Send status saying we received okay.
    res.sendStatus(200)
  })

const token = process.env.FB_PAGE_ACCESS_TOKEN

// Generic function to send a reply to the user in Facebook Messenger.
// Where sender can be found in the incomming messages "sender.id" field.
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

// Example function of how to send a Facebook "Generic" message.
// These messages can contain pictures in frames known as "cards", as well as links and other post-back requests.
// This functionality is currently not used.
function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "button",
				"text":"I didn't get that",
				    "buttons": [
						{
					    "type": "postback",
					    "payload": "what to ask",
					    "title": "❓ What to ask?"
						},
						{
					    "type": "web_url",
					    "url": "https://www.saudia.com",
					    "title": "Visit Our Website"
						},
						{
					    "type": "postback",
					    "payload": "aboutbot",
					    "title": "🤖 About the bot"
						},]
			   
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendbotbutton(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
			"template_type": "button",
			"text":"Call bot back",
					"buttons": [
					{
						"type": "postback",
						"payload": "what to ask",
						"title": "Call bot back"
					},
				]
			 
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function bordingpass(sender) {
	let messageData = {
		
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "airline_boardingpass",
					"intro_message": "You are checked in.",
					"locale": "en_US",
					"boarding_pass": [
						{
							"passenger_name": "SMITH\/NICOLAS",
							"pnr_number": "CG4X7U",
							"seat": "74J",            
							"logo_image_url": "https:\/\/www.example.com\/en\/logo.png",
							"header_image_url": "https:\/\/www.example.com\/en\/fb\/header.png",
							"qr_code": "M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh",
							"above_bar_code_image_url": "https:\/\/www.example.com\/en\/PLAT.png",
							"auxiliary_fields": [
								{
									"label": "Terminal",
									"value": "T1"
								},
								{
									"label": "Departure",
									"value": "30OCT 19:05"
								}
							],
							"secondary_fields": [
								{
									"label": "Boarding",
									"value": "18:30"
								},
								{
									"label": "Gate",
									"value": "D57"
								},
								{
									"label": "Seat",
									"value": "74J"
								},
								{
									"label": "Sec.Nr.",
									"value": "003"
								}
							],
							"flight_info": {
								"flight_number": "KL0642",
								"departure_airport": {
									"airport_code": "JFK",
									"city": "New York",
									"terminal": "T1",
									"gate": "D57"
								},
								"arrival_airport": {
									"airport_code": "AMS",
									"city": "Amsterdam"
								},
								"flight_schedule": {
									"departure_time": "2016-01-02T19:05",
									"arrival_time": "2016-01-05T17:30"
								}
							}
						}
					]
				}
			}
		
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function flightdelay(sender) {
	let messageData = {
		
		"attachment": {
      "type": "template",
      "payload": {
        "template_type": "airline_update",
        "intro_message": "Your flight is delayed",
        "update_type": "delay",
        "locale": "en_US",
        "pnr_number": "CF23G2",
        "update_flight_info": {
          "flight_number": "KL123",
          "departure_airport": {
            "airport_code": "SFO",
            "city": "San Francisco",
            "terminal": "T4",
            "gate": "G8"
          },
          "arrival_airport": {
            "airport_code": "AMS",
            "city": "Amsterdam",
            "terminal": "T4",
            "gate": "G8"
          },
          "flight_schedule": {
            "boarding_time": "2015-12-26T10:30",
            "departure_time": "2015-12-26T11:30",
            "arrival_time": "2015-12-27T07:30"
          }
        }
      }
    }
		
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})



 

//   var appkey = "4dd7d8daf32a5ecd00871071e9e5b57e"
//   var appsecret = "5641e81aec8223be3cf7563ca36a640c"
//   var serviceURL = "https://100009629.auth.konycloud.com/appconfig"
  
//   var client = new file.sdk();
//   client.init(appkey, appsecret, serviceURL, function(response) {
	  
// 	  console.log("Init success");
//   }, function(error) {
// 	  console.log("Init Failure");
//   });


function loginToMF() {
	request({
	  method: 'POST',
	  uri: `https://100009629.auth.konycloud.com/login`,
	  headers: [
		{
		  name: 'X-Kony-App-Key',
		  value: '4dd7d8daf32a5ecd00871071e9e5b57e'
		},
		{
		  name: 'X-Kony-App-Secret',
		  value: '5641e81aec8223be3cf7563ca36a640c'
		}
  
	  ],
	  body: {
		password: "Kony@1234",
		userid: "sajeesh.naniyil@kony.com"
	  },
	  json: true
	}, (error, response, body) => {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	  invokeService(body.claims_token.value)
	});
  }
  function invokeService(calimsToken) {
	request({
	  method: 'POST',
	  uri: `https://saudiairlines-dev2.konycloud.com/services/SaudiaCMS/GetAirplortList`,
	  json: true
	}, (error, response, body) => {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	});
  }

  loginToMF();