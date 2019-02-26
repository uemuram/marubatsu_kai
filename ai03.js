//CPU�p�̎v�l�A���S���Y�� ���x��3
//3�^�[����̏�Ԃ𗘗p���Ď�����߂�
//���x��2���]���֐������P

function ai03(f){

	//�ǂݐ[��������
	var depth = 2;

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

		//�l�K�A���t�@�@�ɂ��X�R�A���v�Z
		tmpPoint = ai03_NegaAlpha(tmp_f,depth,-999999,999999);

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

//�l�K�A���t�@�@
//f:�ǖʁAdepth:�[��
//��Ԃ������Ă��鑤�ɂƂ��ẮA�ǖ�f�̓_�������߂�
//����Ԃ������Ă��� = ���̋ǖʂɁ��~��u������������
function ai03_NegaAlpha(f,depth,a,b){
	//�[��0���I�ǂł���ΐÓI�]���֐���Ԃ�
	if(depth==0 || judgeWinLose(f,winScore)!=NOTEND){
		return ai03_staticScore(f,f.turn,f.noturn,depth);
	}

	//�\�ȑS������擾
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

//�ÓI�]���֐�
//me:�]���Ώۂ̃v���C���[
//enemy:����v���C���[
function ai03_staticScore(f,me,enemy,depth){
	var point=0;

	//���s����
	var wl = judgeWinLose(f,winScore);
	if(wl==NOTEND){
	//���������Ă��Ȃ���Ε��ʂɃX�R�A���v�Z
		point += (f.score[me])*100;			//�����̃X�R�A�������ق��������_
		point -= (f.score[enemy])*100;		//����̃X�R�A�������Ƒ���
		point += (ai03_countLiveLine(f,me,enemy))*10;	//�����ɂƂ��Đ����Ă���񂪑�����΍����_
		point -= (ai03_countLiveLine(f,enemy,me))*10;	//����ɂƂ��Đ����Ă���񂪑�����Α���
	}else{
	//���Ă΍����_(���߂̏����̉��l�����߂邽�߁A�[�����v���X)
		if(wl==me) point += (10000 + depth*10);
		else point -= (10000 + depth*10);;
	}
	return point;
}

//�t�B�[���h���󂯎��A�����Ă����ɂ������~���u����Ă��邩��Ԃ�
//��(���ɂƂ���)�񂪐����Ă��� = ���̗�Ɂ~������Ȃ� & �܂�������Ă��Ȃ�
// = ���̗񂪏������낤�\��������
function ai03_countLiveLine(f,me,enemy){
	//�߂�l
	var r = 0;
	var i,j,tmp;
	//�c���΂߂̗�����i�[�����z��
	var lines = f.getLines();
	//�S��ɑ΂��đ���
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
		//�����Ă����̓J�E���g�ΏۊO
		if(tmp!=f.len){
			r+=tmp;
		}
	}
	return r;
}
