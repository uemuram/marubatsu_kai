//CPU用の思考アルゴリズム レベル0
//今行える操作の中から、ランダムで1つ選択するだけ

function ai00(f){
	var ope,o;
	var i,j;

	//操作が可能なセルをまず決定する
	do{
		//操作対象の座標をランダムに選択
		i = Math.floor(Math.random()*num);
		j = Math.floor(Math.random()*num);
		o = f.availOperate(i,j);
	}while(o==O_CANNOT);

	if(o==O_PUT){
	//配置が可能な場合
		ope = {
			x:i,
			y:j
		};
	}else{
	//移動が可能な場合
		var p,id = ""+ i + j;

		//自殺はしない(移動の結果外にはみ出す方向は選択しない)
		do{
			p = Math.floor(Math.random()*4);
		}while(isOut(id,p))
	
		ope = {
			x:i,
			y:j,
			p:p
		};
	}

	return(ope);
}