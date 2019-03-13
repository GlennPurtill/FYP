const msg = new SpeechSynthesisUtterance;
msg.volume = 1;
msg.pitch = 1;

function speakEnglish(content){
    msg.rate = 0.6;
    msg.text = content;
    const voice = { "lang" : "en-IE"};
    msg.lang = voice.lang;
    speechSynthesis.speak(msg);
}
function speakSpanish(content){
    msg.rate = 0.6;
    msg.text = content;
    const voice = { "lang" : "es-ES"};
    msg.lang = voice.lang;
    speechSynthesis.speak(msg);
}
function speakFullSpanish(content){
    msg.rate = 1;
    msg.text = content;
    const voice = { "lang" : "es-ES"};
    msg.lang = voice.lang;
    speechSynthesis.speak(msg);
}
function speakFullEnglish(content){
    msg.rate = 1;
    msg.text = content;
    const voice = { "lang" : "en-IE"};
    msg.lang = voice.lang;
    speechSynthesis.speak(msg);
}