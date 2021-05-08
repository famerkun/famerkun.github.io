  
window.addEventListener('load', init);
document.getElementById('btn').addEventListener('click', userClicked);


const levels = {
    one:60,
    three: 180,
    five:300
}

//to change level
const currentLevel = levels.one;

var refreshIntervalId;

let time = currentLevel;
let score = 0;
//gameStatus : 0 - standby, 1 - is playing, 2 - game over 
let gameStatus = 0;

//DOM Elements

const wordInput = document.querySelector('#word-input');
const element = document.querySelector('#word-input');

const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const messageAdd = document.querySelector('#messageAdd');
const seconds = document.querySelector('#seconds');

//Array of words
const words = [
    'hello',
    'world',
    'main',
    'while',
    'do',
    'for',
    'length',
    'if-else',
    '"string"',
    'int',
    'bool',
    'Console',
    'WriteLine',
    'debug',
    'log',
    'transform',
    'null',
    'int.Parse()',
    'foreach',
    'class',
    'private',
    'public',
    'static',
    'class',
    'Random rnd = new Random();',
    'switch',
    'case',
    'default',
    'GetData',
    'SetNumber',
    'Multiple',
    'Object',
    'override',
    'Action',
    'gameObject',
    'a = 1+4;',
    'Time.deltaTime',
    'Vector',
    'transform.rotation',
    'Input.GetAxis',
    'Quaternion'
  ];

  const used = [];

  //Initialize Game
  function init(){
   //Show number of seconds in UI

   seconds.innerHTML = currentLevel;

    currentWord.innerHTML = 'startGame';

    //Start matching on word input
    wordInput.addEventListener('input', checkInput);

    document.getElementById("btn").disabled = true;
    
    //Check game status
     setInterval(checkStatus, 50);

  }


  //Start Match
  function startMatch(){
    
    //function to load a random word from the array
    showWord(words);
    wordInput.value = '';
    time = levels.one; 

    //Call countdown every second 
    refreshIntervalId = setInterval(countdown, 1000);

    gameStatus = 2;
    
}

  //checkInput
  function checkInput(){
    if(wordInput.value === 'startGame'){
        gameStatus = 1;
        score = 0;
        wordInput.value = '';
        startMatch();
    }
    else if(matchWords()){
       
        //Only do this if the status is Playing
        if(gameStatus === 2){
            //set one above to whatever the time
            //time = currentLevel + 1;
            showWord(words);
            wordInput.value = '';
            score++;
        }

    }

    if(score === -1){
        scoreDisplay.innerHTML = 0;
    }else{
        scoreDisplay.innerHTML = score;
    }
   
}

function userClicked(){

var uname = document.getElementById("username").value;

messageAdd.innerHTML = uname + 'clicked the button';

google.script.run.userClicked(uname, currentLevel, score);

document.getElementById("btn").disabled = true;

window.alert("スコアを送りました！");

}
  //Match currentWord to wordInput
  function matchWords(){   
    
    if(wordInput.value === currentWord.innerHTML){
        message.innerHTML = 'ナイス！';
        return true;
    }
    else{
            message.innerHTML = '';
            return false;
    }

    for(var i = 0; i < wordInput.value.length ; i++){
      console.log(wordInput.value[i]);
      console.log(currentWord.innerText.charAt(i));
      
      if (wordInput.value[i] !== currentWord.innerText.charAt(i)){
        element.innerHTML = element.innerHTML.replace(wordInput.value[i], '<span style="color: red;">'+wordInput.value[i]+'</span>');
      }
    }

    
  }

  //Pick & show random word
  function showWord(words){

    //Generate random array Index
    const randIndex = Math.floor(Math.random() * words.length);

    //Output a random word
    currentWord.innerHTML = words[randIndex];

    //delete the word from the array
    words.splice(randIndex, 1);

  }

  //Countdown timer
  function countdown(){

    //Make sure time is not run out
    if(time > 0){
        //Decrement
        time--;
    }
    else if(time === 0){
        //Game is over
        gameStatus = 3;
        clearInterval(refreshIntervalId);
    }

    //Show time 
    timeDisplay.innerHTML = time;
  }

  //Check game status
  function checkStatus(){

    //gameStatus is 0 - standby
    //gameStatus is 1 - starting 
    //gameStatus is 2 - is playing
    //gameStatus is 3 - Game Over
    //gameStatus is 4 - restart needed

    if(gameStatus === 1){
        message.innerHTML = 'ゲームをスタートします';
        messageAdd.innerHTML = '';
        setTimeout(() => { score = -1; }, 2000);   
    }

    else if(gameStatus === 2){

      messageAdd.innerHTML = '';
    }

   else if(gameStatus === 3){
        message.innerHTML = 'ゲームオーバー!!!';
        clearInterval(refreshIntervalId);
        document.getElementById("btn").disabled = false;

        setTimeout(() => { gameStatus = 4;}, 2000);
    }

    else if (gameStatus === 4){
      message.innerHTML = 'ゲームオーバー!!!';
      messageAdd.innerHTML = 'もう一回遊ぶにはリスタートをしてください';
    
      currentWord.innerHTML = 'startGame';
    }

  }

  function sendScore(){

    testGetSpreadSheet();
    testGetSpreadSheetValues();

  }  
  
  async function testGetSpreadSheet() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheet({
        spreadsheetId,
        auth
      })
      console.log('output for getSpreadSheet', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }
  
  async function testGetSpreadSheetValues() {
    try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      })
      console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

  getAuthToken();
  

