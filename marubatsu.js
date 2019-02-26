//画像からマウスが離れたときの関数
function imageMouseOut(){
	//今のプレイヤーが人間でなければ、何もしない
	if(nowPlayer != HUMAN) return;

	//クリック対象画像のidから座標を取得
	var i = parseInt(this.id.charAt(0));
	var j = parseInt(this.id.charAt(1));

	//セルの状態によって処理わけ
	if(field.state[i][j]!=BLANK){
		//セルが埋まっている場合は、矢印画像を削除する
		var k;
		for(k=0;k<4;k++){
			document.getElementById(""+ i + j + k ).style.display="none";
		}
	}else{
		//セルが空白の場合は、配置されたシャドー画像を削除する
		changeImageWithID(IMAGE_BLANK,i,j);
	}
}

//画像がクリックされたときの関数
function imageClick(){
	//今のプレイヤーが人間でなければ、何もしない
	if(nowPlayer != HUMAN) return;

	//クリック対象画像のidから座標を取得
	var i = parseInt(this.id.charAt(0));
	var j = parseInt(this.id.charAt(1));

	//今可能な操作を取得
	var o = field.availOperate(i,j);

	if(o == O_MOVE){
		//動かす方向を取得(矢印表示時に設定済み)
		var p = arrowDirection;

		//方向に不正な値が入っていた場合は何もしないで終了
		if(p==-1) return;

		//表示中の矢印画像を消す
		var k;
		for(k=0;k<4;k++){
			document.getElementById(""+ i + j + k ).style.display="none";
		}

		//移動処理を実施
		doAnimation({
			x:i,
			y:j,
			p:p
		});
	}else if(o == O_PUT){
		//配置処理を実施
		doAnimation({
			x:i,
			y:j
		});
	}
}

//画像内でマウスが動いた場合、矢印を表示する処理
function imageMouseMove(e){

	//今のプレイヤーが人間でなければ、何もしない
	if(nowPlayer != HUMAN) return;

	var i,j;
	//今可能な操作を取得
	var o = field.availOperate(this.id);
	if (o == O_MOVE){

		//動かすことが可能であれば矢印表示処理
		//画像の左上の座標を基点とした座標(a,b)を求める
		var a,b;
		if(document.all) {	//IE系のとき
			a = event.clientY+ document.body.scrollTop;
			b = event.clientX+ document.body.scrollLeft;
		}else{				//Fx系のとき
			a = e.pageY;
			b = e.pageX;
		}
		a -= parseInt(this.style.top);
		b -= parseInt(this.style.left);

		//上下左右どのエリアにマウスがあるか判別
		var p;
		if(a+b < imageSize){
			if(a<b) p = 0;
			else p = 3;
		}else{
			if(a<b) p = 1
			else p =2;
		}
		
		//マウスがあったエリアの矢印を表示、それ以外の矢印を非表示
		var id,arrow;
		for(i=0;i<4;i++){
			id = "" + this.id + i;
			arrow = document.getElementById(id);
			if(i==p){
				arrow.style.display = "";
			}else{
				arrow.style.display = "none";
			}
		}
		//クリックされたとき用に方向を保存しておく
		arrowDirection = p;

	}else if(o == O_PUT){

		//配置が可能なときはシャドー画像を表示する
		//クリック対象画像のidから座標を取得
		i = parseInt(this.id.charAt(0));
		j = parseInt(this.id.charAt(1));
		if(field.turn == FIRST){
			//先手の場合、○のシャドー画像を表示
			changeImageWithID(IMAGE_MARU_SHADOW,i,j);
		}else{
			//後手の場合、×のシャドー画像を表示
			changeImageWithID(IMAGE_BATSU_SHADOW,i,j);
		}
	}
}

//画像のidと移動の向きを配列で受け取り、受け取った画像をスライドさせる
function slideImage(){

	//動かす方向を取得(矢印表示時に設定済み)
	var p = arrowDirection;

	var i,id,o,func=func2=null,l,t;

	//移動の方向を設定
	switch(p)
	{
		case 0:
			l = "+=" + 0 + "px";
			t = "-=" + cellSize + "px";
			break;
		case 1:
			l = "+=" + cellSize + "px";
			t = "+=" + 0 + "px";
			break;
		case 2:
			l = "+=" + 0 + "px";
			t = "+=" + cellSize + "px";
			break;
		case 3:
			l = "-=" + cellSize + "px";
			t = "+=" + 0 + "px";
			break;
	}

	for(i=0;i<moveIds.length;i++){
		//最後のアニメーションのときのみ、コールバック関数を設定
		if(i==moveIds.length-1){
			//フェードアウト処理の有無により、どこにコールバック関数を渡すかを切り替える
			if( isOut(moveIds[i],p) ){
				//フェードアウトありの場合
				func2 = slidePostProcess;
			}else{
				//フェードアウトなしの場合
				func = slidePostProcess;
			}
		}
		id = "#" + moveIds[i];
		

		//要素を1つずつスライドさせる
		$(id).delay(i*60).animate( {left: l,top: t},"fast",null,func);
		//画面からはみ出た要素があった場合スライド後にフェードアウトさせる
		if( isOut(moveIds[i],p) ){
			$(id).fadeOut("fast",func2);
		}
	}
}

//スライド処理が完了した後に呼ばれる関数
//画像IDの付け替え、次ステップへの遷移を行う
function slidePostProcess(){

	//動かす方向を取得(矢印表示時に設定済み)
	var p = arrowDirection;

	//ID付け替え処理
	var x,y,removeImage;
	//1.移動によって重なった画像があれば削除
	x = parseInt(moveIds[moveIds.length-1].charAt(0)) + dx[p];
	y = parseInt(moveIds[moveIds.length-1].charAt(1)) + dy[p];
	removeImage = document.getElementById("" + x + y);
	if(removeImage!=null){
		removeImage.parentNode.removeChild(removeImage);
	}

	//2.移動元に空白画像を追加
	x = parseInt(moveIds[0].charAt(0));
	y = parseInt(moveIds[0].charAt(1));
	setImageWithID(IMAGE_BLANK,x,y);

	//3.移動した画像のIDをふりなおす
	//(末尾からふりなおす必要がある)
	var i;
	for(i=moveIds.length-1;i>=0;i--){
		x = parseInt(moveIds[i].charAt(0)) + dx[p];
		y = parseInt(moveIds[i].charAt(1)) + dy[p];
		document.getElementById(moveIds[i]).id = "" + x + y;
	}
	
	//4.フィールドからはみだした画像があれば削除
	x = parseInt(moveIds[moveIds.length-1].charAt(0)) + dx[p];
	y = parseInt(moveIds[moveIds.length-1].charAt(1)) + dy[p];
	if(x<0 || y<0 || x>=num || y>=num){
		removeImage = document.getElementById("" + x + y);
		removeImage.parentNode.removeChild(removeImage);
	}

	//処理が終了したので次へ
	dispMatchBar();
}

//画像IDに対して移動操作を行った場合、その結果がフィールドからはみだすか判定
//id:画像ID、p:方向(0123上右下左)
function isOut(id,p){
	var x = parseInt(id.charAt(0)) + dx[p];
	var y = parseInt(id.charAt(1)) + dy[p];
	if(x<0 || y<0 || x>=num || y>=num){
		return true;
	}else{
		return false;
	}
}

//縦横がそろった箇所に、そろったことを示す線を表示する。
function dispMatchBar(){
	var i,id;
	var matchLines = field.matchLines;
	var func = null;

	//スコアを更新
	//現在のスコアを取得
	var nowScore1 = parseInt($("#score1").text());
	var nowScore2 = parseInt($("#score2").text());
	
	if(field.score[FIRST]>nowScore1){
//		$("#score1").text(field.score[FIRST]).animate({fontSize:"25pt"},"fast").animate({fontSize:"15pt"},"fast");
		$("#score1").text("　" + field.score[FIRST]);
	}
	if(field.score[SECOND]>nowScore2){
//		$("#score2").text(field.score[SECOND]).animate({fontSize:"25pt"},"fast").animate({fontSize:"15pt"},"fast");
		$("#score2").text("　" + field.score[SECOND]);
	}

	if(matchLines.length>0){
		for(i=0;i<matchLines.length;i++){
			//最後の呼び出しの際に、次の処理(コールバック関数)を設定
			if(i==matchLines.length-1){
				func = doNextStep;
			}
			id = "#" + matchLines[i];
			$(id).fadeIn("fast").fadeOut(500,func);
		}
	}else{
		doNextStep();
	}
}

//CPUのターンだったときに呼ばれる関数
//CPUに手を考えさせ、次の処理に移る
function doCPUTurn(){
	var ope = cpuAI[nowPlayer](field);
	doAnimation(ope);
}

//操作を受け取り、対応するアニメーションを実施する。
//不可能な操作は引数として渡されない前提
function doAnimation(ope){

	//処理開始前にロックをかける(操作不可になる)
	nowPlayer = LOCK;

	if(ope.p==null || ope.p==4){
		//操作内容が「配置」だった場合

		//受け取った操作をフィールドに反映
		field.operate(ope);
		
		var id = "" + ope.x + ope.y;
		document.getElementById(id).style.display="none";
		if(field.turn == SECOND){
			//反映前の手番が先手の場合、画像を○に変更
			document.getElementById(id).src=IMAGE_MARU;
		}else{
			document.getElementById(id).src=IMAGE_BATSU;
		}
		document.getElementById(id).width = imageSize;
		document.getElementById(id).height = imageSize;
		
		id = "#" + ope.x + ope.y;
		$(id).fadeIn(300,dispMatchBar);

	}else{
		//操作内容が「移動」だった場合
	
		//移動対象画像を決定
		var x=ope.x,y=ope.y;
		delete moveIds;			//移動対象の画像のidが格納される配列を一度クリア
		moveIds = new Array();
	
		while(x>=0 && y>=0 && x<num && y<num){
			//現在位置に○×が配置されていなければ処理終了
			if(field.state[x][y]==BLANK){
				break;
			}else{
				moveIds.push("" + x + y);
				x += dx[ope.p];
				y += dy[ope.p];
			}
		}
		//受け取った操作をフィールドに反映
		field.operate(ope);
		//スライド処理に必要なため、スライドの方向を記録しておく
		arrowDirection = ope.p
		//スライド処理を実施
		//スライド処理の中で、次の処理(線を表示する処理など)に遷移する
		slideImage();
	}
}

//プレイヤー1人の作業が終了した際の処理
function doNextStep(ope){

	//勝敗判定処理
	var winLose = judgeWinLose(field,winScore);	//勝敗

	//決着がつかなければ次のターンへ、決着がついていれば終了処理へ
	if(winLose == NOTEND && !stopFlag){
		//未決着の場合かつ、中止フラグが立っていない場合

		//動かす方向を「未設定」にしておく(矢印表示時に改めて設定するため)
		arrowDirection = -1;

		//次のプレイヤーを設定
		if(field.turn ==FIRST){
			nowPlayer = player1;
		}else{
			nowPlayer = player2;
		}

		if(field.turn == FIRST){
			$("#winlose1").text("turn");
			$("#winlose2").text("　");
		}else{
			$("#winlose1").text("　");
			$("#winlose2").text("turn");
		}

		//次のプレイヤーが人間ではなかった場合
		if(nowPlayer != HUMAN){
			doCPUTurn();
		}
	}else{
		//決着がついた場合、もしくは中止フラグが立っていた場合
		endGame(winLose);
	}
}

//ゲーム中止処理
function stopGame(){
	//中止ボタンが押された場合にゲームを中断する処理
	//人間のターンだった場合は即座に終了
	//CPUのターンだった場合は終了フラグを立てておき、
	//CPUが処理終了した時点で終了にする
	if(nowPlayer==HUMAN){
		endGame(DRAW);
	}else{
		stopFlag = true;
	}
}

//ゲーム終了処理(引数は勝敗)
function endGame(winLose){

	$("#winlose1").css({"font-size":"5"});
	$("#winlose2").css({"font-size":"5"});

	//勝敗を描写
	if(winLose == FIRST){
		$("#winlose1").text("Win");
		$("#winlose2").text("Lose");
	}else if(winLose == SECOND){
		$("#winlose1").text("Lose");
		$("#winlose2").text("Win");
	}else{
		$("#winlose1").text("Draw");
		$("#winlose2").text("Draw");
	}

	$("#winlose1").animate({fontSize:"10pt"},"fast");
	$("#winlose2").animate({fontSize:"10pt"},"fast");

	//設定パネルを更新
	document.getElementById("player1").disabled = false;
	document.getElementById("player2").disabled = false;
	document.getElementById("winScore").disabled = false;
	document.getElementById("num").disabled = false;
	document.getElementById("startbutton").value = "スタート";
	document.getElementById("startbutton").onclick = startGame;
	
	//操作不可能になるように、ターン状態をリセット
	field.turn = BLANK;
	field.noturn = BLANK;
}

//ゲーム開始処理
function startGame(){

	//一旦画像を全て削除する
	delete_child_element("hiddenimage");

	//-----------画像関係の変数設定-------------
	imagePosX = new Array(num);			//画像を配置する座標(X座標)
	imagePosY = new Array(num);			//画像を配置する座標(Y座標)
	for(i=0; i<num; i++){
		imagePosX[i] = new Array(num);
		imagePosY[i] = new Array(num);
	}
	for(i=0;i<num;i++){
		for(j=0;j<num;j++){
			imagePosX[i][j] = tablePosX + cellSize * i + (cellSize-imageSize)/2;
			imagePosY[i][j] = tablePosY + cellSize * j + (cellSize-imageSize)/2;
		}
	}
	//-------------------------------------------
	
	//----------画像配置処理---------------------
	//初期画像(空)を配置
	for(i=0;i<num;i++) for(j=0;j<num;j++){
		setImageWithID(IMAGE_BLANK,i,j);
	}
	//矢印画像を配置
	setArrowImage();
	//バー画像を表示
	setBarImage(num);
	//-------------------------------------------

	//----------------画面上の設定を読み込む----------------
	var selectedIdx;

	//セレクトボックスで選択されているプレイヤーをセット
	selectedIdx = document.inputForm.player1.selectedIndex;
	player1 = document.inputForm.player1.options[selectedIdx].value;
	selectedIdx = document.inputForm.player2.selectedIndex;
	player2 = document.inputForm.player1.options[selectedIdx].value;

	//何本先取かをセット
	selectedIdx = document.inputForm.winScore.selectedIndex;
	winScore = Number(document.inputForm.winScore.options[selectedIdx].value);
	//-------------------------------------------

	//セレクトボックスを操作不可にする
	document.getElementById("player1").disabled = true;
	document.getElementById("player2").disabled = true;
	document.getElementById("num").disabled = true;
	document.getElementById("winScore").disabled = true;

	//ボタン属性を変更
	document.getElementById("startbutton").value = "中止";
	document.getElementById("startbutton").onclick = stopGame;

	//フィールド準備
	field = new Field(num);

	//スコアをリセット
	$("#score1").text("　0");
	$("#score2").text("　0");

	//ゲーム中止フラグを落とす
	stopFlag = false;

	//次処理に進む
	doNextStep();
}

//画面初期表示処理(ゲーム開始前)
$(function(){

	var i,j;

	//定数を定義
	//プレイヤーを示す定数
	LOCK  = "LOCK";		//ロック状態
	HUMAN = "HUMAN";	//人間
	CPU0  = "CPU0";		//コンピュータ0
	CPU1  = "CPU1";		//コンピュータ1
	CPU2  = "CPU2";		//コンピュータ2
	CPU3  = "CPU3";		//コンピュータ3

	//手版を表す定数
	FIRST = 0;				//先手(○)
	SECOND = 1;				//後手(×)
	BLANK = -1;				//ゲーム開始前(もしくはセルに何も置かれていない)

	//勝敗を表す定数
	DRAW  = -2;				//引き分け
	NOTEND = -3;			//未決着

	//使用する画像
	IMAGE_BLANK           = "image/blank.png";
	IMAGE_MARU            = "image/maru.png";
	IMAGE_BATSU           = "image/batsu.png";
	IMAGE_MARU_SHADOW     = "image/maru_shadow.png";
	IMAGE_BATSU_SHADOW    = "image/batsu_shadow.png";
	IMAGE_ARROW_UP        = "image/arrow_up.png";
	IMAGE_ARROW_RIGHT     = "image/arrow_right.png";
	IMAGE_ARROW_DOWN      = "image/arrow_down.png";
	IMAGE_ARROW_LEFT      = "image/arrow_left.png";
	IMAGE_BAR_TATE        = "image/bar_tate.png";
	IMAGE_BAR_YOKO        = "image/bar_yoko.png";
	IMAGE_BAR_NANAME3_0   = "image/bar_naname3_0.png";
	IMAGE_BAR_NANAME3_1   = "image/bar_naname3_1.png";
	IMAGE_BAR_NANAME4_0   = "image/bar_naname4_0.png";
	IMAGE_BAR_NANAME4_1   = "image/bar_naname4_1.png";
	
	//操作を示す定数
	O_CANNOT              = 0;	//操作不可
	O_PUT                 = 1;	//配置が可能
	O_MOVE                = 2;	//動かすことが可能

	//基本パラメータ(大域変数)を設定
	tablePosX = 10;						//テーブルの位置情報(上端からの距離)
	tablePosY = 310;					//テーブルの位置情報(左端からの距離)
	cellSize = 100;						//セル1つの幅(縦=横)
	num = null;							//升目の数(num×num)
	player1 = 0;						//先手のプレイヤー。0:ゲーム未開始
	player2 = 0;						//後手のプレイヤー。0:ゲーム未開始
	nowPlayer = 0;						//今のプレイヤーは誰か。player1、player2の値が入る
	imageSize = 90;						//使用する画像のサイズ(正方形)
	imagePosX = null;					//画像を配置する座標(X座標)
	imagePosY = null;					//画像を配置する座標(Y座標)
	arrowSizeX = 40;					//押し出し用矢印画像の縦幅
	arrowSizeY = 83;					//押し出し用矢印画像の横幅
	arrowDist  = 40;					//矢印とセルの中心の距離
	arrowImages = new Array();			//上下左右の矢印画像を格納する配列(通常時)
	arrowDirection = -1;				//今向いている矢印の方向(初期値-1は未設定を示す)
	moveIds = new Array;				//押し出し時に移動するid(複数関数で使いまわしたいので配列化)
	dx = [-1,0,1,0,0];					//方角(上下左右+移動なし)に応じた増分
	dy = [0,1,0,-1,0];					//方角(上下左右+移動なし)に応じた増分
	barWidth = 14;						//1列そろったときに出るバーの横幅(短い方)
	barOutLen = 20;						//バーがフィールドをはみ出す部分の長さ
	cpuAI = new Array();				//CPUの思考パターン
	winScore = 0;						//何本先取か(-1であれば無制限)
	stopFlag = false;					//ゲームを途中で中断するためのフラグ

	//----基本設定----
	//CPU用の思考アルゴリズムを設定
	cpuAI[CPU0] = ai00;
	cpuAI[CPU1] = ai01;
	cpuAI[CPU2] = ai02;
	cpuAI[CPU3] = ai03;

	//フィールド情報を設定、テーブルを表示
	//画面セレクトボックスの選択状態からフィールドサイズを決定する処理も含まれる
	setFieldSize();

	//セレクトボックスを選択可能にする
	document.getElementById("player1").disabled = false;
	document.getElementById("player2").disabled = false;
	document.getElementById("winScore").disabled = false;
	document.getElementById("num").disabled = false;

	//矢印画像を設定
	arrowImages = [
		IMAGE_ARROW_UP,
		IMAGE_ARROW_RIGHT,
		IMAGE_ARROW_DOWN,
		IMAGE_ARROW_LEFT
	];
});

//1列そろった際のバー画像を配置
function setBarImage(n){
	var barLen = cellSize*num + barOutLen*2;	//バーの長さを設定
	var barPosX,barPosY;
	var image;
	
	//横バーを設定
	barPosY = tablePosY - barOutLen;
	for(i=0;i<num;i++){
		barPosX = tablePosX + cellSize * i + (cellSize-barWidth)/2;
		image = new Image();
		image.src = IMAGE_BAR_YOKO;
		image.style.position = "absolute";
		image.style.top = barPosX;
		image.style.left = barPosY;
		image.id = "y" + i;
		image.width = barLen;
		image.height = barWidth;
		image.style.display = "none";
		document.getElementById("hiddenimage").appendChild(image);
	}

	//縦バーを設定
	barPosX = tablePosX - barOutLen;
	for(i=0;i<num;i++){
		barPosY = tablePosY + cellSize * i + (cellSize-barWidth)/2;
		image = new Image();
		image.src = IMAGE_BAR_TATE;
		image.style.position = "absolute";
		image.style.top = barPosX;
		image.style.left = barPosY;
		image.id = "t" + i;
		image.width = barWidth;
		image.height = barLen;
		image.style.display = "none";
		document.getElementById("hiddenimage").appendChild(image);
	}
	
	//斜めバー(左上→右下)
	image = new Image();
	if(num==3){
		image.src = IMAGE_BAR_NANAME3_0;
	}else{
		image.src = IMAGE_BAR_NANAME4_0;
	}
	image.style.position = "absolute";
	image.style.top = tablePosX - barOutLen/Math.sqrt(2);
	image.style.left = tablePosY - barOutLen/Math.sqrt(2);
	image.id = "n0";
	image.width = barLen;
	image.height = barLen;
	image.style.display = "none";
	document.getElementById("hiddenimage").appendChild(image);
	
	//斜めバー(右上→左下)
	image = new Image();
	if(num==3){
		image.src = IMAGE_BAR_NANAME3_1;
	}else{
		image.src = IMAGE_BAR_NANAME4_1;
	}
	image.style.position = "absolute";
	image.style.top = tablePosX - barOutLen/Math.sqrt(2);
	image.style.left = tablePosY - barOutLen/Math.sqrt(2);
	image.id = "n1";
	image.width = barLen;
	image.height = barLen;
	image.style.display = "none";
	document.getElementById("hiddenimage").appendChild(image);
}

function setArrowImage(){
	//押し出し用矢印の基本座標を計算
	var arrowPosX = [
		(cellSize -arrowSizeX)/2 - arrowDist,
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 + arrowDist,
		(cellSize -arrowSizeY)/2
	];
	var arrowPosY = [
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 + arrowDist,
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 - arrowDist
	];

	var i,j,k;
	var image;
	//座標(i,j)に、kの向き(0:上、1:右、2:下、3:左)の矢印をセット
	for(i=0;i<num;i++){
		for(j=0;j<num;j++){
			for(k=0;k<4;k++){
				//矢印画像のファイル名、座標をセット
				image = new Image();
				image.src = arrowImages[k];
				image.style.position = "absolute";
				image.style.top =  tablePosX + cellSize * i + arrowPosX[k];
				image.style.left = tablePosY + cellSize * j + arrowPosY[k];

				//Idをセット
				//座標(2,1)、左向き矢印なら"213"
				image.id = "" + i + j + k;

				//画像を一旦非表示にする
				image.style.display = "none";

				document.getElementById("hiddenimage").appendChild(image);
			}
		}
	}
}

//ファイル名とセルの座標を指定して、画像を変更する
function changeImageWithID(filename,x,y){
	var id = "" + x + y;
	var image = document.getElementById(id);
	image.src = filename;
	image.width = imageSize;			//IEで画像サイズが反映されない場合があるため対策
	image.height = imageSize			//IEで画像サイズが反映されない場合があるため対策
}

//ファイル名とセルの座標を指定して、画像を配置する
//セルの座標がそのまま画像のid属性になる
//座標(1,2) → id="12"
function setImageWithID(filename,x,y){
	var id = "" + x + y;
	var image = new Image();

	//画像の基本情報を設定
	image.src = filename;				//ファイル名の設定
	image.style.position = "absolute";	//絶対配置モード
	image.style.top = imagePosX[x][y];
	image.style.left = imagePosY[x][y];
	image.style.zIndex = "1";			//矢印画像より手前に配置するためz座標を設定
	image.id = "" + x + y;
	image.width = imageSize;			//IEで画像サイズが反映されない場合があるため対策
	image.height = imageSize			//IEで画像サイズが反映されない場合があるため対策;

	//画像にイベントを設定
	//イベントにはセルの座標を引数として渡す
	image.onmouseout = imageMouseOut;			//マウスが離れたとき
	image.onclick = imageClick;					//クリック時
	image.onmousemove = imageMouseMove;			//マウスが動いたとき

	//画像を配置
	document.getElementById("hiddenimage").appendChild(image);
}

//ファイル名と座標を指定して、画像を配置する
//idを指定すればidをセット(省略化)
//parentを指定すれば親ノードを指定(デフォルトはhiddenimage)
function setImage(filename,x,y,id,parent){
	var image = new Image();
	image.src = filename;				//ファイル名の設定
	image.style.position = "absolute";	//絶対配置モード
	image.style.top = x;
	image.style.left = y;
	if(id!=null){
		image.id = id;
	}
	if(parent==null){
		document.getElementById("hiddenimage").appendChild(image);
	}else{
		document.getElementById(parent).appendChild(image);
	}
}

//フィールドの大きさを設定する
function setFieldSize(){

	//一旦画像を全て削除する
	delete_child_element("hiddenimage");

	//選択されているテーブルサイズを取得
	var selectedIdx = document.inputForm.num.selectedIndex;
	num = Number(document.inputForm.num.options[selectedIdx].value);
	
	//テーブルを作成
	var i;
	var tableStyleString = '"';
	tableStyleString += ( 'width:'  + cellSize * num +';' );
	tableStyleString += ( 'height:' + cellSize * num +';' );
	tableStyleString += ( 'top:'    + tablePosX      +';' );
	tableStyleString += ( 'left:'   + tablePosY      +';' );
	tableStyleString += ( 'position:absolute;'            );
	tableStyleString += '"';
	var tableString = '<table border="1" cellspacing="0" bgcolor="#F8F8FF"';
	tableString    += ('style=' + tableStyleString);
	tableString    += '>'
	for(i=0;i<num;i++){
		tableString += '<tr>';
		for(j=0;j<num;j++){
			tableString += '<td>&nbsp;</td>';
		}
		tableString += '</tr>';
	}
	tableString    += '</table>';
	document.getElementById("board").innerHTML = tableString;
	
	//スクロールバーが出たり消えたりするのを防ぐためのダミー画像を配置
	delete_element("dummyImage");	//まず消す
	var dummyX = tablePosX + cellSize * (num + 1);
	var dummyY = tablePosY + cellSize * (num + 1);
	setImage("image/dummy.png",dummyX,dummyY,"dummyImage","body");
}

//idを指定して子要素を全て消す
function delete_child_element( id_name ){
	dom_obj=document.getElementById(id_name);
	//1番目の子ノードを取得
	var dom_obj_firstchild=dom_obj.firstChild;
	//子ノードがなければ何もしない
	if(dom_obj_firstchild!=null){
		// 2番目以降の子ノードを削除
		while (dom_obj_firstchild.nextSibling){
			dom_obj.removeChild(dom_obj_firstchild.nextSibling);
		}
		// 1番目の子ノードを削除
		dom_obj.removeChild(dom_obj_firstchild);
	}
}

//idを指定して要素を消す
function delete_element( id_name ){
	var dom_obj=document.getElementById(id_name);
	//指定されたIDが存在しなければ何もしない
	if(dom_obj!=null){
		var dom_obj_parent=dom_obj.parentNode;
		dom_obj_parent.removeChild(dom_obj);
	}
}

//フィールド情報と先取数から勝敗を判定する
//FIRST   :○の勝ち
//SECOND  :×の勝ち
//DRAW    :引き分け
//NOTEND  :未決着
function judgeWinLose(f,w){
	var r;

	//フィールドが埋め尽くされていればそちらの勝ち
	if(f.count[FIRST]==num*num){
		r = FIRST;
	}else if(f.count[SECOND]==num*num){
		r = SECOND;
	}else if( w!=-1 && (f.score[FIRST]>= w || f.score[SECOND]>= w)){
	//先取数を超えた場合は決着
		if( f.score[FIRST] == f.score[SECOND] ){
			r = DRAW;
		}else if(f.score[FIRST]>f.score[SECOND]){
			r = FIRST;
		}else{
			r = SECOND;
		}
	}else{
		r = NOTEND;
	}
	return r;
}