//CPU用の思考アルゴリズム用に使われる共通機能郡
//大きい方を返す
function max(x,y){
	if(x>y) return x;
	else return y;
}

//小さい方を返す
function min(x,y){
	if(x<y) return x;
	else return y;
}

//フィールドを受け取り、それに対する「可能な操作一覧」を返す
function availOperateList(f){
	var i,j,p;
	var operateList = new Array();
	for(i=0;i<f.len;i++){
		for(j=0;j<f.len;j++){
			//可能な操作を取得
			o = f.availOperate(i,j);
			if(o==O_PUT){
			//配置が可能な場合
				operateList.push({x:i,y:j});
			}else if(o==O_MOVE){
			//移動が可能な場合
				for(p=0;p<4;p++){
					//「ただの自殺」は可能な操作から除外
					if(!isOut(""+i+j,p)){
						operateList.push({x:i,y:j,p:p});
					}
				}
			}
		}
	}
	return operateList;
}