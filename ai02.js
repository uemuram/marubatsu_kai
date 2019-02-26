//CPU用の思考アルゴリズム レベル2
//2ターン先の状態のみ利用して手を決める
function ai02(f){

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

		//ネガマックス法によりスコアを計算
		tmpPoint = ai02_NegaMax(tmp_f,1);
		
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

//ネガマックス法
//f:局面、depth:深さ
//手番を持っている側にとっての、局面fの点数を求める
//※手番を持っている = 今の局面に○×を置く権利がある
function ai02_NegaMax(f,depth){
	//深さ0であれば静的評価関数を返す
	if(depth==0){
		return ai02_staticScore(f,f.turn,f.noturn);
	}
	
	//可能な全操作を取得
	var opeList = availOperateList(f);
	
	var maxPoint = -999999;
	var tmpPoint;
	var i,tmp_f;
	for(i=0;i<opeList.length;i++){
		tmp_f = f.clone();
		tmp_f.operate(opeList[i]);
		//tmp_fは自分が○×を置いた直後の状態(=相手の手番)なので、
		//その状態で「相手の点数が低い」=「-相手の点数が高い」ものを自分にとって良い手として採用
		tmpPoint = -ai02_NegaMax(tmp_f,depth-1);
		if(tmpPoint>maxPoint){
			maxPoint = tmpPoint;
		}
	}
	return maxPoint;
}

//静的評価関数
//me:評価対象のプレイヤー
//enemy:相手プレイヤー
function ai02_staticScore(f,me,enemy){
	var point=0;

	point += (f.score[me])*100;			//自分のスコアが多いほうが高得点
	point -= (f.score[enemy])*100;		//相手のスコアが多いと損失
	point += (f.count[me])*10;			//自分の○×が多いほうが高得点
	point -= (f.count[enemy])*10;		//相手の○×が多いと損失

	return point;
}