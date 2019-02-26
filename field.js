//フィールド情報を格納するクラス
//[引数]
//	len : フィールド幅(縦横共通)
var Field = function(len) {

	//++コンストラクタ++
	var i,j;

	//プロパティ宣言
	this.len = len;						//幅(縦横共通)
	this.turn = FIRST;					//今どちらの手番か(BLANK、FIRST、SECONDのどれかが入る)
	this.noturn = SECOND;				//今どちらの手番ではないか(BLANK、FIRST、SECONDのどれかが入る)
	this.state = new Array(len);		//升目の状態(BLANK、FIRST、SECONDのどれかが入る)
	for(i=0; i<len; i++){
		this.state[i] = new Array(len);
	}
	this.score = new Array(2);			//先手、後手それぞれの点数
	this.matchLines = new Array(0);		//今そろった列に対する線の画像ID
	this.count = new Array(2);			//先手、後手それぞれ○×がいくつあるか

	//プロパティ値セット
	//フィールドの状態をリセット(全て空にする)
	for(i=0; i<len; i++){
		for(j=0; j<len; j++){
			this.state[i][j]=BLANK;
		}
	} 
	//スコアをゼロに設定
	this.score[FIRST] = 0;
	this.score[SECOND] = 0;
	this.count[FIRST] = 0;
	this.count[SECOND] = 0;
	
	//--コンストラクタ--
};

//Filedクラスへのプロトタイプ追加
//プロトタイプに追加したオブジェクトは各メンバから共通で呼び出せる。
Field.prototype = {

	//自らのクローンを返す
	clone : function(){
		var cloneField = new Field(this.len);
		cloneField.turn = this.turn;
		cloneField.noturn = this.noturn;
		cloneField.score = this.score.slice(0);
		cloneField.matchLines = this.matchLines.slice(0);
		cloneField.count = this.count.slice(0);
		var i,j;
		for(i=0;i<this.len;i++) for(j=0;j<this.len;j++)
			cloneField.state[i][j] = this.state[i][j];
		return cloneField;
	},

	//セルの箇所を受け取って「今そのセルに対して行える操作」を返す
	availOperate : function(){
		var i,j;
		if(arguments.length==1){
			//引数が1つの場合、セルが"12"の形式で指定されたとみなす
			i = arguments[0].charAt(0);
			j = arguments[0].charAt(1);
		}else if(arguments.length==2){
			//引数が2つの場合、セルが(1,2)の形式で指定されたとみなす
			i = arguments[0];
			j = arguments[1];
		}
		if(this.turn==BLANK){
			//試合開始前であれば操作不可
			return O_CANNOT;
		}else if(this.state[i][j] == BLANK){
			//空白であれば配置が可能
			return O_PUT;
		}else if(this.turn==this.state[i][j]){
			//自分の記号が置かれていればいれば動かせる
			return O_MOVE;
		}else{
			return O_CANNOT;
		}
	},

	//フィールドに対して指定された操作を行う
	//操作はオブジェクト形式で与える
	//例) (2,1)に対して下へ移動させる場合
	//    {"x":2,    //x座標
	//     "y":1,    //y座標
	//     "p":2}    //移動の向き(0:上、1:右、下:2、左:3、配置:4) ※pを省略した場合も配置
	//成功すればtrue,失敗すればfalseを返す
	operate : function(ope){
	
		//成功失敗判定フラグ
		var success = false;
		//1列そろったかどうかの判定に使われるセルの一覧
		var checkCells = new Array();

		//操作によって処理わけを行う
		if(ope.p==null || ope.p==4){
			//操作が「配置」だった場合
			if(this.state[ope.x][ope.y]==BLANK){
				//フィールドに何もなければ配置可能
				this.state[ope.x][ope.y] = this.turn;

				//判定セル一覧をセット
				checkCells.push({x:ope.x,y:ope.y});

				//○×の数を更新
				this.count[this.turn]++;

				//ターンを進ませる
				if(this.turn == FIRST) {
					this.turn = SECOND;
					this.noturn = FIRST;
				}else{
					this.turn = FIRST;
					this.noturn = SECOND;
				}
				success = true;
			}
		}else{
			//操作が「移動」だった場合
			if(this.state[ope.x][ope.y]!=BLANK){

				//移動開始地点のセル座標をi,jにセット
				var i=ope.x,j=ope.y;
				var pushPrev = this.state[i][j];	//押し出しが行われる場合、押し出される内容
				var pushNext;

				//まず、移動開始地点のセルを空にする
				pushNext = this.state[i][j];
				this.state[i][j] = BLANK;
				i += dx[ope.p];
				j += dy[ope.p];

				//移動開始地点の次をスタートとして、セル移動処理
				while(pushPrev!=BLANK && i>=0 && j>=0 && i<this.len && j<this.len){
					pushNext = this.state[i][j];	//セルの内容を退避
					this.state[i][j] = pushPrev;	//セルの内容を、1つ前から押し出されたセル内容で置き換え
					pushPrev = pushNext;			//次に向けて押し出されるセル内容

					//移動後のセルを判定セル一覧に追加
					checkCells.push({x:i,y:j});

					i += dx[ope.p];
					j += dy[ope.p];
				}
				
				//この操作によって枠をはみ出した場合、○×の数を更新
				if(	pushPrev != BLANK &&
					(i<0 || j<0 || i>=this.len || j>=this.len)){
					this.count[pushNext]--;
				}

				//ターンを進ませる
				if(this.turn == FIRST) {
					this.turn = SECOND;
					this.noturn = FIRST;
				}else{
					this.turn = FIRST;
					this.noturn = SECOND;
				}
				success = true;
			}
		}

		//どの列がそろったかの判定処理を行う。
		var i,j;
		var line,cellState;

		//画像idが格納される配列を一旦削除
		delete this.matchLines;
		this.matchLines = new Array();

		//判定対象になるのは、直前の操作で移動(もしくは配置)されたセルのみなので、
		//そのセルに対してループ処理
		//判定対象セルは1つもしくは並んだ複数個前提なので、そろった列が重複カウントされることがない前提
		//(重複チェックをしない)
		for(i=0;i<checkCells.length;i++){

			//判定対象セルの中身を保存
			cellState = this.state[checkCells[i].x][checkCells[i].y];

			//対象セルを含む横一列がそろっているか判定
			line = true;
			for(j=0;j<this.len;j++){
				//対象セルと中身が食い違っていればそろっていないと判定
				if(this.state[checkCells[i].x][j] != cellState){
					line = false;
					break;
				}
			}
			if(line){
				this.matchLines.push("y" + checkCells[i].x);
				//スコアを更新
				this.score[cellState]++;
			}

			//対象セルを含む縦一列がそろっているか判定
			line = true;
			for(j=0;j<this.len;j++){
				//対象セルと中身が食い違っていればそろっていないと判定
				if(this.state[j][checkCells[i].y] != cellState){
					line = false;
					break;
				}
			}
			if(line){
				this.matchLines.push("t" + checkCells[i].y);
				//スコアを更新
				this.score[cellState]++;
			}

			//対象セルを含む斜め一列がそろっているか判定
			//斜め判定を行うのは対象セルが対角線上にあった場合のみ
			if( checkCells[i].x == checkCells[i].y ){
				line = true;
				for(j=0;j<this.len;j++){
					//対象セルと中身が食い違っていればそろっていないと判定
					if(this.state[j][j] != cellState){
						line = false;
						break;
					}
				}
				if(line){
					this.matchLines.push("n0");
					//スコアを更新
					this.score[cellState]++;
				}
			}
			if( checkCells[i].x == this.len - checkCells[i].y -1 ){
				line = true;
				for(j=0;j<this.len;j++){
					//対象セルと中身が食い違っていればそろっていないと判定
					if(this.state[j][this.len-j-1] != cellState){
						line = false;
						break;
					}
				}
				if(line){
					this.matchLines.push("n1");
					//スコアを更新
					this.score[cellState]++;
				}
			}
		}

		//成功失敗の判定を返す
		return(success);
	},
	
	// 列情報を格納した配列を返す(横、縦、斜め)
	getLines : function(){
		var lines = new Array();
		var line;
		var i,j;
		
		//横
		for(i=0;i<this.len;i++){
			line = new Array();
			for(j=0;j<this.len;j++){
				line.push(this.state[i][j]);
			}
			lines.push(line);
		}
		//縦
		for(j=0;j<this.len;j++){
			line = new Array();
			for(i=0;i<this.len;i++){
				line.push(this.state[i][j]);
			}
			lines.push(line);
		}
		//斜め(左上→右下)
		line = new Array();
		for(i=0;i<this.len;i++){
			line.push(this.state[i][i]);
		}
		lines.push(line);
		//斜め(右上→左下)
		line = new Array();
		for(i=0;i<this.len;i++){
			line.push(this.state[i][this.len-i-1]);
		}
		lines.push(line);

		return lines;
	}
}

