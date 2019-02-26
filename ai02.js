//CPU�p�̎v�l�A���S���Y�� ���x��2
//2�^�[����̏�Ԃ̂ݗ��p���Ď�����߂�
function ai02(f){

	//�\�ȑS������擾
	var opeList = availOperateList(f);

	//�\�ȑS������s������́u����̃X�R�A�v���v�Z���A
	//����̃X�R�A���ŏ��ɂȂ���I��
	var minPoint = 999999;
	var minPointOpe = new Array();
	var tmpPoint;
	var tmp_f;
	var i;

	for(i=0;i<opeList.length;i++){
		//�N���[�����쐬���A�����K�p
		tmp_f = f.clone();
		tmp_f.operate(opeList[i]);

		//�l�K�}�b�N�X�@�ɂ��X�R�A���v�Z
		tmpPoint = ai02_NegaMax(tmp_f,1);
		
		//�X�R�A���X�V
		if(tmpPoint < minPoint){
			minPoint = tmpPoint;
			minPointOpe.splice(0,minPointOpe.length);
			minPointOpe.push(opeList[i]);
		}else if(tmpPoint == minPoint){
			minPointOpe.push(opeList[i]);
		}
	}

	//�|�C���g���ŏ��ɂȂ�I�y���[�V��������1�I�����ĕԂ�
	var idx = Math.floor(Math.random()*minPointOpe.length);
	return(minPointOpe[idx]);
}

//�l�K�}�b�N�X�@
//f:�ǖʁAdepth:�[��
//��Ԃ������Ă��鑤�ɂƂ��ẮA�ǖ�f�̓_�������߂�
//����Ԃ������Ă��� = ���̋ǖʂɁ��~��u������������
function ai02_NegaMax(f,depth){
	//�[��0�ł���ΐÓI�]���֐���Ԃ�
	if(depth==0){
		return ai02_staticScore(f,f.turn,f.noturn);
	}
	
	//�\�ȑS������擾
	var opeList = availOperateList(f);
	
	var maxPoint = -999999;
	var tmpPoint;
	var i,tmp_f;
	for(i=0;i<opeList.length;i++){
		tmp_f = f.clone();
		tmp_f.operate(opeList[i]);
		//tmp_f�͎��������~��u��������̏��(=����̎��)�Ȃ̂ŁA
		//���̏�ԂŁu����̓_�����Ⴂ�v=�u-����̓_���������v���̂������ɂƂ��ėǂ���Ƃ��č̗p
		tmpPoint = -ai02_NegaMax(tmp_f,depth-1);
		if(tmpPoint>maxPoint){
			maxPoint = tmpPoint;
		}
	}
	return maxPoint;
}

//�ÓI�]���֐�
//me:�]���Ώۂ̃v���C���[
//enemy:����v���C���[
function ai02_staticScore(f,me,enemy){
	var point=0;

	point += (f.score[me])*100;			//�����̃X�R�A�������ق��������_
	point -= (f.score[enemy])*100;		//����̃X�R�A�������Ƒ���
	point += (f.count[me])*10;			//�����́��~�������ق��������_
	point -= (f.count[enemy])*10;		//����́��~�������Ƒ���

	return point;
}