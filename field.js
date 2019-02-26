//�t�B�[���h�����i�[����N���X
//[����]
//	len : �t�B�[���h��(�c������)
var Field = function(len) {

	//++�R���X�g���N�^++
	var i,j;

	//�v���p�e�B�錾
	this.len = len;						//��(�c������)
	this.turn = FIRST;					//���ǂ���̎�Ԃ�(BLANK�AFIRST�ASECOND�̂ǂꂩ������)
	this.noturn = SECOND;				//���ǂ���̎�Ԃł͂Ȃ���(BLANK�AFIRST�ASECOND�̂ǂꂩ������)
	this.state = new Array(len);		//���ڂ̏��(BLANK�AFIRST�ASECOND�̂ǂꂩ������)
	for(i=0; i<len; i++){
		this.state[i] = new Array(len);
	}
	this.score = new Array(2);			//���A��肻�ꂼ��̓_��
	this.matchLines = new Array(0);		//�����������ɑ΂�����̉摜ID
	this.count = new Array(2);			//���A��肻�ꂼ�ꁛ�~���������邩

	//�v���p�e�B�l�Z�b�g
	//�t�B�[���h�̏�Ԃ����Z�b�g(�S�ċ�ɂ���)
	for(i=0; i<len; i++){
		for(j=0; j<len; j++){
			this.state[i][j]=BLANK;
		}
	} 
	//�X�R�A���[���ɐݒ�
	this.score[FIRST] = 0;
	this.score[SECOND] = 0;
	this.count[FIRST] = 0;
	this.count[SECOND] = 0;
	
	//--�R���X�g���N�^--
};

//Filed�N���X�ւ̃v���g�^�C�v�ǉ�
//�v���g�^�C�v�ɒǉ������I�u�W�F�N�g�͊e�����o���狤�ʂŌĂяo����B
Field.prototype = {

	//����̃N���[����Ԃ�
	clone : function(){
		var cloneField = new Field(this.len);
		cloneField.turn = this.turn;
		cloneField.noturn = this.noturn;
		cloneField.score = this.score.slice(0);
		cloneField.matchLines = this.matchLines.slice(0);
		cloneField.count = this.count.slice(0);
		var i,j;
		for(i=0;i<this.len;i++) for(j=0;j<this.len;j++)
			cloneField.state[i][j] = this.state[i][j];
		return cloneField;
	},

	//�Z���̉ӏ����󂯎���āu�����̃Z���ɑ΂��čs���鑀��v��Ԃ�
	availOperate : function(){
		var i,j;
		if(arguments.length==1){
			//������1�̏ꍇ�A�Z����"12"�̌`���Ŏw�肳�ꂽ�Ƃ݂Ȃ�
			i = arguments[0].charAt(0);
			j = arguments[0].charAt(1);
		}else if(arguments.length==2){
			//������2�̏ꍇ�A�Z����(1,2)�̌`���Ŏw�肳�ꂽ�Ƃ݂Ȃ�
			i = arguments[0];
			j = arguments[1];
		}
		if(this.turn==BLANK){
			//�����J�n�O�ł���Α���s��
			return O_CANNOT;
		}else if(this.state[i][j] == BLANK){
			//�󔒂ł���Δz�u���\
			return O_PUT;
		}else if(this.turn==this.state[i][j]){
			//�����̋L�����u����Ă���΂���Γ�������
			return O_MOVE;
		}else{
			return O_CANNOT;
		}
	},

	//�t�B�[���h�ɑ΂��Ďw�肳�ꂽ������s��
	//����̓I�u�W�F�N�g�`���ŗ^����
	//��) (2,1)�ɑ΂��ĉ��ֈړ�������ꍇ
	//    {"x":2,    //x���W
	//     "y":1,    //y���W
	//     "p":2}    //�ړ��̌���(0:��A1:�E�A��:2�A��:3�A�z�u:4) ��p���ȗ������ꍇ���z�u
	//���������true,���s�����false��Ԃ�
	operate : function(ope){
	
		//�������s����t���O
		var success = false;
		//1�񂻂�������ǂ����̔���Ɏg����Z���̈ꗗ
		var checkCells = new Array();

		//����ɂ���ď����킯���s��
		if(ope.p==null || ope.p==4){
			//���삪�u�z�u�v�������ꍇ
			if(this.state[ope.x][ope.y]==BLANK){
				//�t�B�[���h�ɉ����Ȃ���Δz�u�\
				this.state[ope.x][ope.y] = this.turn;

				//����Z���ꗗ���Z�b�g
				checkCells.push({x:ope.x,y:ope.y});

				//���~�̐����X�V
				this.count[this.turn]++;

				//�^�[����i�܂���
				if(this.turn == FIRST) {
					this.turn = SECOND;
					this.noturn = FIRST;
				}else{
					this.turn = FIRST;
					this.noturn = SECOND;
				}
				success = true;
			}
		}else{
			//���삪�u�ړ��v�������ꍇ
			if(this.state[ope.x][ope.y]!=BLANK){

				//�ړ��J�n�n�_�̃Z�����W��i,j�ɃZ�b�g
				var i=ope.x,j=ope.y;
				var pushPrev = this.state[i][j];	//�����o�����s����ꍇ�A�����o�������e
				var pushNext;

				//�܂��A�ړ��J�n�n�_�̃Z������ɂ���
				pushNext = this.state[i][j];
				this.state[i][j] = BLANK;
				i += dx[ope.p];
				j += dy[ope.p];

				//�ړ��J�n�n�_�̎����X�^�[�g�Ƃ��āA�Z���ړ�����
				while(pushPrev!=BLANK && i>=0 && j>=0 && i<this.len && j<this.len){
					pushNext = this.state[i][j];	//�Z���̓��e��ޔ�
					this.state[i][j] = pushPrev;	//�Z���̓��e���A1�O���牟���o���ꂽ�Z�����e�Œu������
					pushPrev = pushNext;			//���Ɍ����ĉ����o�����Z�����e

					//�ړ���̃Z���𔻒�Z���ꗗ�ɒǉ�
					checkCells.push({x:i,y:j});

					i += dx[ope.p];
					j += dy[ope.p];
				}
				
				//���̑���ɂ���Ęg���͂ݏo�����ꍇ�A���~�̐����X�V
				if(	pushPrev != BLANK &&
					(i<0 || j<0 || i>=this.len || j>=this.len)){
					this.count[pushNext]--;
				}

				//�^�[����i�܂���
				if(this.turn == FIRST) {
					this.turn = SECOND;
					this.noturn = FIRST;
				}else{
					this.turn = FIRST;
					this.noturn = SECOND;
				}
				success = true;
			}
		}

		//�ǂ̗񂪂���������̔��菈�����s���B
		var i,j;
		var line,cellState;

		//�摜id���i�[�����z�����U�폜
		delete this.matchLines;
		this.matchLines = new Array();

		//����ΏۂɂȂ�̂́A���O�̑���ňړ�(�������͔z�u)���ꂽ�Z���݂̂Ȃ̂ŁA
		//���̃Z���ɑ΂��ă��[�v����
		//����ΏۃZ����1�������͕��񂾕����O��Ȃ̂ŁA��������񂪏d���J�E���g����邱�Ƃ��Ȃ��O��
		//(�d���`�F�b�N�����Ȃ�)
		for(i=0;i<checkCells.length;i++){

			//����ΏۃZ���̒��g��ۑ�
			cellState = this.state[checkCells[i].x][checkCells[i].y];

			//�ΏۃZ�����܂މ���񂪂�����Ă��邩����
			line = true;
			for(j=0;j<this.len;j++){
				//�ΏۃZ���ƒ��g���H������Ă���΂�����Ă��Ȃ��Ɣ���
				if(this.state[checkCells[i].x][j] != cellState){
					line = false;
					break;
				}
			}
			if(line){
				this.matchLines.push("y" + checkCells[i].x);
				//�X�R�A���X�V
				this.score[cellState]++;
			}

			//�ΏۃZ�����܂ޏc��񂪂�����Ă��邩����
			line = true;
			for(j=0;j<this.len;j++){
				//�ΏۃZ���ƒ��g���H������Ă���΂�����Ă��Ȃ��Ɣ���
				if(this.state[j][checkCells[i].y] != cellState){
					line = false;
					break;
				}
			}
			if(line){
				this.matchLines.push("t" + checkCells[i].y);
				//�X�R�A���X�V
				this.score[cellState]++;
			}

			//�ΏۃZ�����܂ގ΂߈�񂪂�����Ă��邩����
			//�΂ߔ�����s���̂͑ΏۃZ�����Ίp����ɂ������ꍇ�̂�
			if( checkCells[i].x == checkCells[i].y ){
				line = true;
				for(j=0;j<this.len;j++){
					//�ΏۃZ���ƒ��g���H������Ă���΂�����Ă��Ȃ��Ɣ���
					if(this.state[j][j] != cellState){
						line = false;
						break;
					}
				}
				if(line){
					this.matchLines.push("n0");
					//�X�R�A���X�V
					this.score[cellState]++;
				}
			}
			if( checkCells[i].x == this.len - checkCells[i].y -1 ){
				line = true;
				for(j=0;j<this.len;j++){
					//�ΏۃZ���ƒ��g���H������Ă���΂�����Ă��Ȃ��Ɣ���
					if(this.state[j][this.len-j-1] != cellState){
						line = false;
						break;
					}
				}
				if(line){
					this.matchLines.push("n1");
					//�X�R�A���X�V
					this.score[cellState]++;
				}
			}
		}

		//�������s�̔����Ԃ�
		return(success);
	},
	
	// ������i�[�����z���Ԃ�(���A�c�A�΂�)
	getLines : function(){
		var lines = new Array();
		var line;
		var i,j;
		
		//��
		for(i=0;i<this.len;i++){
			line = new Array();
			for(j=0;j<this.len;j++){
				line.push(this.state[i][j]);
			}
			lines.push(line);
		}
		//�c
		for(j=0;j<this.len;j++){
			line = new Array();
			for(i=0;i<this.len;i++){
				line.push(this.state[i][j]);
			}
			lines.push(line);
		}
		//�΂�(���と�E��)
		line = new Array();
		for(i=0;i<this.len;i++){
			line.push(this.state[i][i]);
		}
		lines.push(line);
		//�΂�(�E�と����)
		line = new Array();
		for(i=0;i<this.len;i++){
			line.push(this.state[i][this.len-i-1]);
		}
		lines.push(line);

		return lines;
	}
}

