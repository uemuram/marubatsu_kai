//CPU�p�̎v�l�A���S���Y�� ���x��0
//���s���鑀��̒�����A�����_����1�I�����邾��

function ai00(f){
	var ope,o;
	var i,j;

	//���삪�\�ȃZ�����܂����肷��
	do{
		//����Ώۂ̍��W�������_���ɑI��
		i = Math.floor(Math.random()*num);
		j = Math.floor(Math.random()*num);
		o = f.availOperate(i,j);
	}while(o==O_CANNOT);

	if(o==O_PUT){
	//�z�u���\�ȏꍇ
		ope = {
			x:i,
			y:j
		};
	}else{
	//�ړ����\�ȏꍇ
		var p,id = ""+ i + j;

		//���E�͂��Ȃ�(�ړ��̌��ʊO�ɂ͂ݏo�������͑I�����Ȃ�)
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