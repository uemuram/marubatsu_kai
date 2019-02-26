//CPU�p�̎v�l�A���S���Y�� ���x��1
//1�^�[����̏�Ԃ̂ݗ��p���Ď�����߂�
function ai01(f){

	var maxPoint = -999999;
	var maxPointOpe = new Array();
	var tmpOpe = null;
	var tmpPoint;

	//�S�Z���ɑ΂��ă|�C���g���v�Z
	var i,j,p,o;
	for(i=0;i<f.len;i++){
		for(j=0;j<f.len;j++){
			//�\�ȑ�����擾
			o = f.availOperate(i,j);
			if(o==O_PUT){
			//�z�u���\�ȏꍇ
				tmpOpe = {x:i,y:j};
				tmpPoint = ai01_calcPoint(f,tmpOpe);
				maxPoint = ai01_updateMaxPointOpe(tmpPoint,tmpOpe,maxPoint,maxPointOpe);
			}else if(o==O_MOVE){
			//�ړ����\�ȏꍇ
				for(p=0;p<4;p++){
					tmpOpe = {x:i,y:j,p:p};
					tmpPoint = ai01_calcPoint(f,tmpOpe);
					maxPoint = ai01_updateMaxPointOpe(tmpPoint,tmpOpe,maxPoint,maxPointOpe);
				}
			}
		}
	}

	//�|�C���g���ő�ɂȂ�I�y���[�V��������1�I�����ĕԂ�
	var idx = Math.floor(Math.random()*maxPointOpe.length);
	return(maxPointOpe[idx]);
}

//�ő�|�C���g�ɂȂ����X�V����
//�߂�l�͍X�V��̍ő�|�C���g
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

//�t�B�[���hf�ɑ΂��āA����ope����p�������ꍇ�̃|�C���g�����߂�
function ai01_calcPoint(f,ope){
	var point = 0;
	//�N���[���쐬
	var tmp_f = f.clone();
	tmp_f.operate(ope);

	//�������񂪑����ق��������_
	point += (tmp_f.score[tmp_f.noturn] - tmp_f.score[tmp_f.turn])*100;

	//�񐔂������Ƃ��͔z�u����Ă��遛�~�̐��������ق��������_
	point += (tmp_f.count[tmp_f.noturn] - tmp_f.count[tmp_f.turn])*10;

	return point;
}