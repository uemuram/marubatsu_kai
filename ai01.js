//CPU用の思考アルゴリズム レベル1
//1ターン先の状態のみ利用して手を決める
function ai01(f){

	var maxPoint = -999999;
	var maxPointOpe = new Array();
	var tmpOpe = null;
	var tmpPoint;

	//全セルに対してポイントを計算
	var i,j,p,o;
	for(i=0;i<f.len;i++){
		for(j=0;j<f.len;j++){
			//可能な操作を取得
			o = f.availOperate(i,j);
			if(o==O_PUT){
			//配置が可能な場合
				tmpOpe = {x:i,y:j};
				tmpPoint = ai01_calcPoint(f,tmpOpe);
				maxPoint = ai01_updateMaxPointOpe(tmpPoint,tmpOpe,maxPoint,maxPointOpe);
			}else if(o==O_MOVE){
			//移動が可能な場合
				for(p=0;p<4;p++){
					tmpOpe = {x:i,y:j,p:p};
					tmpPoint = ai01_calcPoint(f,tmpOpe);
					maxPoint = ai01_updateMaxPointOpe(tmpPoint,tmpOpe,maxPoint,maxPointOpe);
				}
			}
		}
	}

	//ポイントが最大になるオペレーションから1つ選択して返す
	var idx = Math.floor(Math.random()*maxPointOpe.length);
	return(maxPointOpe[idx]);
}

//最大ポイントになる手を更新する
//戻り値は更新後の最大ポイント
function ai01_updateMaxPointOpe(tmpPoint,tmpOpe,maxPoint,maxPointOpe){
	if(tmpPoint > maxPoint){
		maxPoint = tmpPoint;
		maxPointOpe.splice(0,maxPointOpe.length);
		maxPointOpe.push(tmpOpe);
	}else if(tmpPoint == maxPoint){
		maxPointOpe.push(tmpOpe);
	}
	return maxPoint;
}

//フィールドfに対して、操作opeを作用させた場合のポイントを求める
function ai01_calcPoint(f,ope){
	var point = 0;
	//クローン作成
	var tmp_f = f.clone();
	tmp_f.operate(ope);

	//揃った列が多いほうが高得点
	point += (tmp_f.score[tmp_f.noturn] - tmp_f.score[tmp_f.turn])*100;

	//列数が同じときは配置されている○×の数が多いほうが高得点
	point += (tmp_f.count[tmp_f.noturn] - tmp_f.count[tmp_f.turn])*10;

	return point;
}