const msg = new SpeechSynthesisUtterance;
msg.volume = 1;
msg.pitch = 1;
const voiceEng = { "lang" : "en-IE"};
const voiceSpan = { "lang" : "es-ES"};
function speakEnglish(content){
    msg.rate = 0.6;
    msg.text = content;
    msg.lang = voiceEng.lang;
    speechSynthesis.speak(msg);
}
function speakSpanish(content){
    msg.rate = 0.6;
    msg.text = content;
    msg.lang = voiceSpan.lang;
    speechSynthesis.speak(msg);
}
function speakFullSpanish(content){
    msg.rate = 1;
    msg.text = content;
    msg.lang = voiceSpan.lang;
    speechSynthesis.speak(msg);
}
function speakFullEnglish(content){
    msg.rate = 1;
    msg.text = content;
    msg.lang = voiceEng.lang;
    speechSynthesis.speak(msg);
}

var starttime; 
var endtime; 
function start(){
    starttime = new Date().getTime()
}

function end(db,api,n){
    endtime = new Date().getTime()
    // fs.appendFileSync('/validations.log','test');
    console.log("Number of words tested: " + n + " | Num words in DB/API: " + db + "/"+ api +"  | Time taken (seconds): " + (endtime - starttime)/1000 + " | pass")

}