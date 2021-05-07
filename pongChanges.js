// select canvas element
const canvas = document.getElementById("pongChanges");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

//音声
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/bounce.wav";
wall.src = "sounds/chime.wav";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

var image = new Image();
image.src = "images/sprite.png";

image.onload = function(){
	ctx.drawImage(image, 0, 0);
};


//ボールの情報宣言
const ball = {
    x : canvas.width/2,　//x座標、カンバスの幅の半分
    y : canvas.height/2,　//ｙ座標、カンバスの高さの半分
	radius : 10,　//半径
    velocityX : 5,　//ｘ方向速度
    velocityY : 5, //y方向速度
    speed : 7, //速さ
    color : "YELLOW" //色
}

//ユーザーのバーの情報宣言
const user = {
    x : 0, // カンバスの左側、ｘ座標が０
    y : (canvas.height - 100)/2, //ｙ座礁の設定
    width : 10, //幅
    height : 100, //高さ
    score : 0, //スコア
    color : "BLUE" //色
}

//PCのバーの情報宣言
const com = {
    x : canvas.width - 10, //カンバスの右側―10（バーの幅）
    y : (canvas.height - 100)/2, // ｙ座標の設定（100はバーの高さ）
    width : 10,　
    height : 100,
    score : 0,
    color : "RED"
}

//真ん中のネットの情報宣言
const net = {
    x : (canvas.width - 2)/2, //x座標、画面の真ん中
    y : 0,　//ｙ座標
    height : 10, //高さ
    width : 2, //幅
    color : "WHITE" //色
}

// 四角を描画する命令
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// 丸を描画する命令
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

//マウスからインプット認知
canvas.addEventListener("mousemove", getMousePos);

//マウスカーソルの位置を調べる
function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

//PCかプレイヤーのどちらかスコアゲットしたら、ボールをリセット
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

//ネットを描画する命令
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//文字を書く命令
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

//ボールとバーのあたり判定を計算する
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

//マイフレームに変化をもたらすために計算はここで行われている
function update(){
    

	
	
    //ボールの位置がｘ=0よりも小さければ、PCにスコアが入る、またその逆　（ball.x　+ ball.radius > canvas.width ならユーザーに１点が入る）
    if( ball.x - ball.radius < 0 ){
        //PCのスコアを増やす
		com.score++;
		//PCがスコアを取るときの音声を再生
        comScore.play();
		//ボールの位置リセット
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    // ボールの速度
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // PCはシンプルなAIで動かす…、負かすことも配慮に入れる
    com.y += ((ball.y - (com.y + com.height/2)))*0.2*Math.random();
    
    //上下の壁に当たったら、ｙ方向速度を逆にする
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){       
		ball.velocityY = -ball.velocityY;
		//壁に当たる音声再生
        wall.play();
    }
    
    //現在のプレイヤーがPCかユーザなのかを調べ、playerにする
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    //バーにボールが当たったら
    if(collision(ball,player)){
        // 音声再生
        hit.play();
		//ボールがバーに当たったか確認する
        let collidePoint = (ball.y - (player.y + player.height/2));
        //当たった点を調べる、バーの上半分に当たったか、下半分に当たったか
        collidePoint = collidePoint / (player.height/2);
        
		//バーの上の方に当たったら、ボールを-45度で動くようにする
        //バーの真ん中らへんに当たったら、ボールを　０度で動くようにする
		//バーの下の方に当たったら、ボールを45度で動くようにする
        // Math.PI/4 = 45度
        let angleRad = (Math.PI/4) * collidePoint;
        
        //ｘとｙ方向の速度の方向を変える
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        //バーに当たる度、ボールの速度を上げる
        ball.speed += 0.1;
    }
}

// 描画が行われている場所
function render(){
    
    // カンバスクリア
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // ユーザーのスコアを左に書く
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // PCのスコアを右に書く
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // ネットを描く
    drawNet();
    
    // ユーザーのバーを描く
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    //　PCのバーを描く
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // ボールを描く
    //drawArc(ball.x, ball.y, ball.radius, ball.color);
	
	//ctx.drawImage(image, canvas.width/2- (image.width/2), canvas.height/2 - (image.height/2));

	ctx.drawImage(image, ball.x, ball.y);

}

//ゲームループ
function game(){
    update();
    render();
}
// フレーム毎秒　FPS
let framePerSecond = 50;

//gameを1秒ごとに50回実行、１秒＝1000ミリ秒
let loop = setInterval(game,1000/framePerSecond);

