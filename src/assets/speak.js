const msg = new SpeechSynthesisUtterance;
msg.volume = 1;
msg.rate = 1;
msg.pitch = 1;
msg.text = "Hello World";

const voice = { "name" : "Alex", "lang" : "en-US"};
msg.voiceURI = voice.name;
msg.lang = voice.lang;
function speakEnglish(){
    speechSynthesis.speak(msg);
}