//CPU�p�̎v�l�A���S���Y���p�Ɏg���鋤�ʋ@�\�S
//�傫������Ԃ�
function max(x,y){
	if(x>y) return x;
	else return y;
}

//����������Ԃ�
function min(x,y){
	if(x<y) return x;
	else return y;
}

//�t�B�[���h���󂯎��A����ɑ΂���u�\�ȑ���ꗗ�v��Ԃ�
function availOperateList(f){
	var i,j,p;
	var operateList = new Array();
	for(i=0;i<f.len;i++){
		for(j=0;j<f.len;j++){
			//�\�ȑ�����擾
			o = f.availOperate(i,j);
			if(o==O_PUT){
			//�z�u���\�ȏꍇ
				operateList.push({x:i,y:j});
			}else if(o==O_MOVE){
			//�ړ����\�ȏꍇ
				for(p=0;p<4;p++){
					//�u�����̎��E�v�͉\�ȑ��삩�珜�O
					if(!isOut(""+i+j,p)){
						operateList.push({x:i,y:j,p:p});
					}
				}
			}
		}
	}
	return operateList;
}