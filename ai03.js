//CPU用の思考アルゴリズム レベル3
//3ターン先の状態を利用して手を決める
//レベル2より評価関数を改善

function ai03(f){

	//読み深さを決定
	var depth = 2;

	//可能な全操作を取得
	var opeList = availOperateList(f);

	//可能な全操作を行った後の「相手のスコア」を計算し、
	//相手のスコアが最小になる手を選択
	var minPoint = 999999;
	var minPointOpe = new Array();
	var tmpPoint;
	var tmp_f;
	var i;

	for(i=0;i<opeList.length;i++){
		//クローンを作成し、操作を適用
		tmp_f = f.clone();
		tmp_f.operate(opeList[i]);

		//ネガアルファ法によりスコアを計算
		tmpPoint = ai03_NegaAlpha(tmp_f,depth,-999999,999999);

		//スコアを更新
		if(tmpPoint < minPoint){
			minPoint = tmpPoint;
			minPointOpe.splice(0,minPointOpe.length);
			minPointOpe.push(opeList[i]);
		}else if(tmpPoint == minPoint){
			minPointOpe.push(opeList[i]);
		}
	}

	//ポイントが最小になるオペレーションから1つ選択して返す
	var idx = Math.floor(Math.random()*minPointOpe.length);
	return(minPointOpe[idx]);
}

//ネガアルファ法
//f:局面、depth:深さ
//手番を持っている側にとっての、局面fの点数を求める
//※手番を持っている = 今の局面に○×を置く権利がある
function ai03_NegaAlpha(f,depth,a,b){
	//深さ0か終局であれば静的評価関数を返す
	if(depth==0 || judgeWinLose(f,winScore)!=NOTEND){
		return ai03_staticScore(f,f.turn,f.noturn,depth);
	}

	//可能な全操作を取得
	var opeList = availOperateList(f);
	
	var i,tmp_f;
	for(i=0;i<opeList.length;i++){
		tmp_f = f.clone();
		tmp_f.operate(opeList[i]);
		a = max(a,-ai03_NegaAlpha(tmp_f,depth-1,-b,-a));
		if(a>=b){
			return a;
		}
	}
	return a;
}

//静的評価関数
//me:評価対象のプレイヤー
//enemy:相手プレイヤー
function ai03_staticScore(f,me,enemy,depth){
	var point=0;

	//勝敗判定
	var wl = judgeWinLose(f,winScore);
	if(wl==NOTEND){
	//決着がついていなければ普通にスコアを計算
		point += (f.score[me])*100;			//自分のスコアが多いほうが高得点
		point -= (f.score[enemy])*100;		//相手のスコアが多いと損失
		point += (ai03_countLiveLine(f,me,enemy))*10;	//自分にとって生きている列が多ければ高得点
		point -= (ai03_countLiveLine(f,enemy,me))*10;	//時手にとって生きている列が多ければ損失
	}else{
	//勝てば高得点(直近の勝ちの価値を高めるため、深さをプラス)
		if(wl==me) point += (10000 + depth*10);
		else point -= (10000 + depth*10);;
	}
	return point;
}

//フィールドを受け取り、生きている列にいくつ○×が置かれているかを返す
//※(○にとって)列が生きている = その列に×が一つもない & まだそろっていない
// = その列が将来そろう可能性が高い
function ai03_countLiveLine(f,me,enemy){
	//戻り値
	var r = 0;
	var i,j,tmp;
	//縦横斜めの列情報を格納した配列
	var lines = f.getLines();
	//全列に対して走査
	for(i=0;i<lines.length;i++){
		tmp = 0;
		for(j=0;j<lines[i].length;j++){
			if(lines[i][j]==me){
				tmp++;
			}else if(lines[i][j]==enemy){
				tmp=0;
				break;
			}
		}
		//揃っている列はカウント対象外
		if(tmp!=f.len){
			r+=tmp;
		}
	}
	return r;
}
