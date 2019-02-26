//�摜����}�E�X�����ꂽ�Ƃ��̊֐�
function imageMouseOut(){
	//���̃v���C���[���l�ԂłȂ���΁A�������Ȃ�
	if(nowPlayer != HUMAN) return;

	//�N���b�N�Ώۉ摜��id������W���擾
	var i = parseInt(this.id.charAt(0));
	var j = parseInt(this.id.charAt(1));

	//�Z���̏�Ԃɂ���ď����킯
	if(field.state[i][j]!=BLANK){
		//�Z�������܂��Ă���ꍇ�́A���摜���폜����
		var k;
		for(k=0;k<4;k++){
			document.getElementById(""+ i + j + k ).style.display="none";
		}
	}else{
		//�Z�����󔒂̏ꍇ�́A�z�u���ꂽ�V���h�[�摜���폜����
		changeImageWithID(IMAGE_BLANK,i,j);
	}
}

//�摜���N���b�N���ꂽ�Ƃ��̊֐�
function imageClick(){
	//���̃v���C���[���l�ԂłȂ���΁A�������Ȃ�
	if(nowPlayer != HUMAN) return;

	//�N���b�N�Ώۉ摜��id������W���擾
	var i = parseInt(this.id.charAt(0));
	var j = parseInt(this.id.charAt(1));

	//���\�ȑ�����擾
	var o = field.availOperate(i,j);

	if(o == O_MOVE){
		//�������������擾(���\�����ɐݒ�ς�)
		var p = arrowDirection;

		//�����ɕs���Ȓl�������Ă����ꍇ�͉������Ȃ��ŏI��
		if(p==-1) return;

		//�\�����̖��摜������
		var k;
		for(k=0;k<4;k++){
			document.getElementById(""+ i + j + k ).style.display="none";
		}

		//�ړ����������{
		doAnimation({
			x:i,
			y:j,
			p:p
		});
	}else if(o == O_PUT){
		//�z�u���������{
		doAnimation({
			x:i,
			y:j
		});
	}
}

//�摜���Ń}�E�X���������ꍇ�A����\�����鏈��
function imageMouseMove(e){

	//���̃v���C���[���l�ԂłȂ���΁A�������Ȃ�
	if(nowPlayer != HUMAN) return;

	var i,j;
	//���\�ȑ�����擾
	var o = field.availOperate(this.id);
	if (o == O_MOVE){

		//���������Ƃ��\�ł���Ζ��\������
		//�摜�̍���̍��W����_�Ƃ������W(a,b)�����߂�
		var a,b;
		if(document.all) {	//IE�n�̂Ƃ�
			a = event.clientY+ document.body.scrollTop;
			b = event.clientX+ document.body.scrollLeft;
		}else{				//Fx�n�̂Ƃ�
			a = e.pageY;
			b = e.pageX;
		}
		a -= parseInt(this.style.top);
		b -= parseInt(this.style.left);

		//�㉺���E�ǂ̃G���A�Ƀ}�E�X�����邩����
		var p;
		if(a+b < imageSize){
			if(a<b) p = 0;
			else p = 3;
		}else{
			if(a<b) p = 1
			else p =2;
		}
		
		//�}�E�X���������G���A�̖���\���A����ȊO�̖����\��
		var id,arrow;
		for(i=0;i<4;i++){
			id = "" + this.id + i;
			arrow = document.getElementById(id);
			if(i==p){
				arrow.style.display = "";
			}else{
				arrow.style.display = "none";
			}
		}
		//�N���b�N���ꂽ�Ƃ��p�ɕ�����ۑ����Ă���
		arrowDirection = p;

	}else if(o == O_PUT){

		//�z�u���\�ȂƂ��̓V���h�[�摜��\������
		//�N���b�N�Ώۉ摜��id������W���擾
		i = parseInt(this.id.charAt(0));
		j = parseInt(this.id.charAt(1));
		if(field.turn == FIRST){
			//���̏ꍇ�A���̃V���h�[�摜��\��
			changeImageWithID(IMAGE_MARU_SHADOW,i,j);
		}else{
			//���̏ꍇ�A�~�̃V���h�[�摜��\��
			changeImageWithID(IMAGE_BATSU_SHADOW,i,j);
		}
	}
}

//�摜��id�ƈړ��̌�����z��Ŏ󂯎��A�󂯎�����摜���X���C�h������
function slideImage(){

	//�������������擾(���\�����ɐݒ�ς�)
	var p = arrowDirection;

	var i,id,o,func=func2=null,l,t;

	//�ړ��̕�����ݒ�
	switch(p)
	{
		case 0:
			l = "+=" + 0 + "px";
			t = "-=" + cellSize + "px";
			break;
		case 1:
			l = "+=" + cellSize + "px";
			t = "+=" + 0 + "px";
			break;
		case 2:
			l = "+=" + 0 + "px";
			t = "+=" + cellSize + "px";
			break;
		case 3:
			l = "-=" + cellSize + "px";
			t = "+=" + 0 + "px";
			break;
	}

	for(i=0;i<moveIds.length;i++){
		//�Ō�̃A�j���[�V�����̂Ƃ��̂݁A�R�[���o�b�N�֐���ݒ�
		if(i==moveIds.length-1){
			//�t�F�[�h�A�E�g�����̗L���ɂ��A�ǂ��ɃR�[���o�b�N�֐���n������؂�ւ���
			if( isOut(moveIds[i],p) ){
				//�t�F�[�h�A�E�g����̏ꍇ
				func2 = slidePostProcess;
			}else{
				//�t�F�[�h�A�E�g�Ȃ��̏ꍇ
				func = slidePostProcess;
			}
		}
		id = "#" + moveIds[i];
		

		//�v�f��1���X���C�h������
		$(id).delay(i*60).animate( {left: l,top: t},"fast",null,func);
		//��ʂ���͂ݏo���v�f���������ꍇ�X���C�h��Ƀt�F�[�h�A�E�g������
		if( isOut(moveIds[i],p) ){
			$(id).fadeOut("fast",func2);
		}
	}
}

//�X���C�h����������������ɌĂ΂��֐�
//�摜ID�̕t���ւ��A���X�e�b�v�ւ̑J�ڂ��s��
function slidePostProcess(){

	//�������������擾(���\�����ɐݒ�ς�)
	var p = arrowDirection;

	//ID�t���ւ�����
	var x,y,removeImage;
	//1.�ړ��ɂ���ďd�Ȃ����摜������΍폜
	x = parseInt(moveIds[moveIds.length-1].charAt(0)) + dx[p];
	y = parseInt(moveIds[moveIds.length-1].charAt(1)) + dy[p];
	removeImage = document.getElementById("" + x + y);
	if(removeImage!=null){
		removeImage.parentNode.removeChild(removeImage);
	}

	//2.�ړ����ɋ󔒉摜��ǉ�
	x = parseInt(moveIds[0].charAt(0));
	y = parseInt(moveIds[0].charAt(1));
	setImageWithID(IMAGE_BLANK,x,y);

	//3.�ړ������摜��ID���ӂ�Ȃ���
	//(��������ӂ�Ȃ����K�v������)
	var i;
	for(i=moveIds.length-1;i>=0;i--){
		x = parseInt(moveIds[i].charAt(0)) + dx[p];
		y = parseInt(moveIds[i].charAt(1)) + dy[p];
		document.getElementById(moveIds[i]).id = "" + x + y;
	}
	
	//4.�t�B�[���h����݂͂������摜������΍폜
	x = parseInt(moveIds[moveIds.length-1].charAt(0)) + dx[p];
	y = parseInt(moveIds[moveIds.length-1].charAt(1)) + dy[p];
	if(x<0 || y<0 || x>=num || y>=num){
		removeImage = document.getElementById("" + x + y);
		removeImage.parentNode.removeChild(removeImage);
	}

	//�������I�������̂Ŏ���
	dispMatchBar();
}

//�摜ID�ɑ΂��Ĉړ�������s�����ꍇ�A���̌��ʂ��t�B�[���h����݂͂���������
//id:�摜ID�Ap:����(0123��E����)
function isOut(id,p){
	var x = parseInt(id.charAt(0)) + dx[p];
	var y = parseInt(id.charAt(1)) + dy[p];
	if(x<0 || y<0 || x>=num || y>=num){
		return true;
	}else{
		return false;
	}
}

//�c������������ӏ��ɁA����������Ƃ���������\������B
function dispMatchBar(){
	var i,id;
	var matchLines = field.matchLines;
	var func = null;

	//�X�R�A���X�V
	//���݂̃X�R�A���擾
	var nowScore1 = parseInt($("#score1").text());
	var nowScore2 = parseInt($("#score2").text());
	
	if(field.score[FIRST]>nowScore1){
//		$("#score1").text(field.score[FIRST]).animate({fontSize:"25pt"},"fast").animate({fontSize:"15pt"},"fast");
		$("#score1").text("�@" + field.score[FIRST]);
	}
	if(field.score[SECOND]>nowScore2){
//		$("#score2").text(field.score[SECOND]).animate({fontSize:"25pt"},"fast").animate({fontSize:"15pt"},"fast");
		$("#score2").text("�@" + field.score[SECOND]);
	}

	if(matchLines.length>0){
		for(i=0;i<matchLines.length;i++){
			//�Ō�̌Ăяo���̍ۂɁA���̏���(�R�[���o�b�N�֐�)��ݒ�
			if(i==matchLines.length-1){
				func = doNextStep;
			}
			id = "#" + matchLines[i];
			$(id).fadeIn("fast").fadeOut(500,func);
		}
	}else{
		doNextStep();
	}
}

//CPU�̃^�[���������Ƃ��ɌĂ΂��֐�
//CPU�Ɏ���l�������A���̏����Ɉڂ�
function doCPUTurn(){
	var ope = cpuAI[nowPlayer](field);
	doAnimation(ope);
}

//������󂯎��A�Ή�����A�j���[�V���������{����B
//�s�\�ȑ���͈����Ƃ��ēn����Ȃ��O��
function doAnimation(ope){

	//�����J�n�O�Ƀ��b�N��������(����s�ɂȂ�)
	nowPlayer = LOCK;

	if(ope.p==null || ope.p==4){
		//������e���u�z�u�v�������ꍇ

		//�󂯎����������t�B�[���h�ɔ��f
		field.operate(ope);
		
		var id = "" + ope.x + ope.y;
		document.getElementById(id).style.display="none";
		if(field.turn == SECOND){
			//���f�O�̎�Ԃ����̏ꍇ�A�摜�����ɕύX
			document.getElementById(id).src=IMAGE_MARU;
		}else{
			document.getElementById(id).src=IMAGE_BATSU;
		}
		document.getElementById(id).width = imageSize;
		document.getElementById(id).height = imageSize;
		
		id = "#" + ope.x + ope.y;
		$(id).fadeIn(300,dispMatchBar);

	}else{
		//������e���u�ړ��v�������ꍇ
	
		//�ړ��Ώۉ摜������
		var x=ope.x,y=ope.y;
		delete moveIds;			//�ړ��Ώۂ̉摜��id���i�[�����z�����x�N���A
		moveIds = new Array();
	
		while(x>=0 && y>=0 && x<num && y<num){
			//���݈ʒu�Ɂ��~���z�u����Ă��Ȃ���Ώ����I��
			if(field.state[x][y]==BLANK){
				break;
			}else{
				moveIds.push("" + x + y);
				x += dx[ope.p];
				y += dy[ope.p];
			}
		}
		//�󂯎����������t�B�[���h�ɔ��f
		field.operate(ope);
		//�X���C�h�����ɕK�v�Ȃ��߁A�X���C�h�̕������L�^���Ă���
		arrowDirection = ope.p
		//�X���C�h���������{
		//�X���C�h�����̒��ŁA���̏���(����\�����鏈���Ȃ�)�ɑJ�ڂ���
		slideImage();
	}
}

//�v���C���[1�l�̍�Ƃ��I�������ۂ̏���
function doNextStep(ope){

	//���s���菈��
	var winLose = judgeWinLose(field,winScore);	//���s

	//���������Ȃ���Ύ��̃^�[���ցA���������Ă���ΏI��������
	if(winLose == NOTEND && !stopFlag){
		//�������̏ꍇ���A���~�t���O�������Ă��Ȃ��ꍇ

		//�������������u���ݒ�v�ɂ��Ă���(���\�����ɉ��߂Đݒ肷�邽��)
		arrowDirection = -1;

		//���̃v���C���[��ݒ�
		if(field.turn ==FIRST){
			nowPlayer = player1;
		}else{
			nowPlayer = player2;
		}

		if(field.turn == FIRST){
			$("#winlose1").text("turn");
			$("#winlose2").text("�@");
		}else{
			$("#winlose1").text("�@");
			$("#winlose2").text("turn");
		}

		//���̃v���C���[���l�Ԃł͂Ȃ������ꍇ
		if(nowPlayer != HUMAN){
			doCPUTurn();
		}
	}else{
		//�����������ꍇ�A�������͒��~�t���O�������Ă����ꍇ
		endGame(winLose);
	}
}

//�Q�[�����~����
function stopGame(){
	//���~�{�^���������ꂽ�ꍇ�ɃQ�[���𒆒f���鏈��
	//�l�Ԃ̃^�[���������ꍇ�͑����ɏI��
	//CPU�̃^�[���������ꍇ�͏I���t���O�𗧂ĂĂ����A
	//CPU�������I���������_�ŏI���ɂ���
	if(nowPlayer==HUMAN){
		endGame(DRAW);
	}else{
		stopFlag = true;
	}
}

//�Q�[���I������(�����͏��s)
function endGame(winLose){

	$("#winlose1").css({"font-size":"5"});
	$("#winlose2").css({"font-size":"5"});

	//���s��`��
	if(winLose == FIRST){
		$("#winlose1").text("Win");
		$("#winlose2").text("Lose");
	}else if(winLose == SECOND){
		$("#winlose1").text("Lose");
		$("#winlose2").text("Win");
	}else{
		$("#winlose1").text("Draw");
		$("#winlose2").text("Draw");
	}

	$("#winlose1").animate({fontSize:"10pt"},"fast");
	$("#winlose2").animate({fontSize:"10pt"},"fast");

	//�ݒ�p�l�����X�V
	document.getElementById("player1").disabled = false;
	document.getElementById("player2").disabled = false;
	document.getElementById("winScore").disabled = false;
	document.getElementById("num").disabled = false;
	document.getElementById("startbutton").value = "�X�^�[�g";
	document.getElementById("startbutton").onclick = startGame;
	
	//����s�\�ɂȂ�悤�ɁA�^�[����Ԃ����Z�b�g
	field.turn = BLANK;
	field.noturn = BLANK;
}

//�Q�[���J�n����
function startGame(){

	//��U�摜��S�č폜����
	delete_child_element("hiddenimage");

	//-----------�摜�֌W�̕ϐ��ݒ�-------------
	imagePosX = new Array(num);			//�摜��z�u������W(X���W)
	imagePosY = new Array(num);			//�摜��z�u������W(Y���W)
	for(i=0; i<num; i++){
		imagePosX[i] = new Array(num);
		imagePosY[i] = new Array(num);
	}
	for(i=0;i<num;i++){
		for(j=0;j<num;j++){
			imagePosX[i][j] = tablePosX + cellSize * i + (cellSize-imageSize)/2;
			imagePosY[i][j] = tablePosY + cellSize * j + (cellSize-imageSize)/2;
		}
	}
	//-------------------------------------------
	
	//----------�摜�z�u����---------------------
	//�����摜(��)��z�u
	for(i=0;i<num;i++) for(j=0;j<num;j++){
		setImageWithID(IMAGE_BLANK,i,j);
	}
	//���摜��z�u
	setArrowImage();
	//�o�[�摜��\��
	setBarImage(num);
	//-------------------------------------------

	//----------------��ʏ�̐ݒ��ǂݍ���----------------
	var selectedIdx;

	//�Z���N�g�{�b�N�X�őI������Ă���v���C���[���Z�b�g
	selectedIdx = document.inputForm.player1.selectedIndex;
	player1 = document.inputForm.player1.options[selectedIdx].value;
	selectedIdx = document.inputForm.player2.selectedIndex;
	player2 = document.inputForm.player1.options[selectedIdx].value;

	//���{��悩���Z�b�g
	selectedIdx = document.inputForm.winScore.selectedIndex;
	winScore = Number(document.inputForm.winScore.options[selectedIdx].value);
	//-------------------------------------------

	//�Z���N�g�{�b�N�X�𑀍�s�ɂ���
	document.getElementById("player1").disabled = true;
	document.getElementById("player2").disabled = true;
	document.getElementById("num").disabled = true;
	document.getElementById("winScore").disabled = true;

	//�{�^��������ύX
	document.getElementById("startbutton").value = "���~";
	document.getElementById("startbutton").onclick = stopGame;

	//�t�B�[���h����
	field = new Field(num);

	//�X�R�A�����Z�b�g
	$("#score1").text("�@0");
	$("#score2").text("�@0");

	//�Q�[�����~�t���O�𗎂Ƃ�
	stopFlag = false;

	//�������ɐi��
	doNextStep();
}

//��ʏ����\������(�Q�[���J�n�O)
$(function(){

	var i,j;

	//�萔���`
	//�v���C���[�������萔
	LOCK  = "LOCK";		//���b�N���
	HUMAN = "HUMAN";	//�l��
	CPU0  = "CPU0";		//�R���s���[�^0
	CPU1  = "CPU1";		//�R���s���[�^1
	CPU2  = "CPU2";		//�R���s���[�^2
	CPU3  = "CPU3";		//�R���s���[�^3

	//��ł�\���萔
	FIRST = 0;				//���(��)
	SECOND = 1;				//���(�~)
	BLANK = -1;				//�Q�[���J�n�O(�������̓Z���ɉ����u����Ă��Ȃ�)

	//���s��\���萔
	DRAW  = -2;				//��������
	NOTEND = -3;			//������

	//�g�p����摜
	IMAGE_BLANK           = "image/blank.png";
	IMAGE_MARU            = "image/maru.png";
	IMAGE_BATSU           = "image/batsu.png";
	IMAGE_MARU_SHADOW     = "image/maru_shadow.png";
	IMAGE_BATSU_SHADOW    = "image/batsu_shadow.png";
	IMAGE_ARROW_UP        = "image/arrow_up.png";
	IMAGE_ARROW_RIGHT     = "image/arrow_right.png";
	IMAGE_ARROW_DOWN      = "image/arrow_down.png";
	IMAGE_ARROW_LEFT      = "image/arrow_left.png";
	IMAGE_BAR_TATE        = "image/bar_tate.png";
	IMAGE_BAR_YOKO        = "image/bar_yoko.png";
	IMAGE_BAR_NANAME3_0   = "image/bar_naname3_0.png";
	IMAGE_BAR_NANAME3_1   = "image/bar_naname3_1.png";
	IMAGE_BAR_NANAME4_0   = "image/bar_naname4_0.png";
	IMAGE_BAR_NANAME4_1   = "image/bar_naname4_1.png";
	
	//����������萔
	O_CANNOT              = 0;	//����s��
	O_PUT                 = 1;	//�z�u���\
	O_MOVE                = 2;	//���������Ƃ��\

	//��{�p�����[�^(���ϐ�)��ݒ�
	tablePosX = 10;						//�e�[�u���̈ʒu���(��[����̋���)
	tablePosY = 310;					//�e�[�u���̈ʒu���(���[����̋���)
	cellSize = 100;						//�Z��1�̕�(�c=��)
	num = null;							//���ڂ̐�(num�~num)
	player1 = 0;						//���̃v���C���[�B0:�Q�[�����J�n
	player2 = 0;						//���̃v���C���[�B0:�Q�[�����J�n
	nowPlayer = 0;						//���̃v���C���[�͒N���Bplayer1�Aplayer2�̒l������
	imageSize = 90;						//�g�p����摜�̃T�C�Y(�����`)
	imagePosX = null;					//�摜��z�u������W(X���W)
	imagePosY = null;					//�摜��z�u������W(Y���W)
	arrowSizeX = 40;					//�����o���p���摜�̏c��
	arrowSizeY = 83;					//�����o���p���摜�̉���
	arrowDist  = 40;					//���ƃZ���̒��S�̋���
	arrowImages = new Array();			//�㉺���E�̖��摜���i�[����z��(�ʏ펞)
	arrowDirection = -1;				//�������Ă�����̕���(�����l-1�͖��ݒ������)
	moveIds = new Array;				//�����o�����Ɉړ�����id(�����֐��Ŏg���܂킵�����̂Ŕz��)
	dx = [-1,0,1,0,0];					//���p(�㉺���E+�ړ��Ȃ�)�ɉ���������
	dy = [0,1,0,-1,0];					//���p(�㉺���E+�ړ��Ȃ�)�ɉ���������
	barWidth = 14;						//1�񂻂�����Ƃ��ɏo��o�[�̉���(�Z����)
	barOutLen = 20;						//�o�[���t�B�[���h���͂ݏo�������̒���
	cpuAI = new Array();				//CPU�̎v�l�p�^�[��
	winScore = 0;						//���{��悩(-1�ł���Ζ�����)
	stopFlag = false;					//�Q�[����r���Œ��f���邽�߂̃t���O

	//----��{�ݒ�----
	//CPU�p�̎v�l�A���S���Y����ݒ�
	cpuAI[CPU0] = ai00;
	cpuAI[CPU1] = ai01;
	cpuAI[CPU2] = ai02;
	cpuAI[CPU3] = ai03;

	//�t�B�[���h����ݒ�A�e�[�u����\��
	//��ʃZ���N�g�{�b�N�X�̑I����Ԃ���t�B�[���h�T�C�Y�����肷�鏈�����܂܂��
	setFieldSize();

	//�Z���N�g�{�b�N�X��I���\�ɂ���
	document.getElementById("player1").disabled = false;
	document.getElementById("player2").disabled = false;
	document.getElementById("winScore").disabled = false;
	document.getElementById("num").disabled = false;

	//���摜��ݒ�
	arrowImages = [
		IMAGE_ARROW_UP,
		IMAGE_ARROW_RIGHT,
		IMAGE_ARROW_DOWN,
		IMAGE_ARROW_LEFT
	];
});

//1�񂻂�����ۂ̃o�[�摜��z�u
function setBarImage(n){
	var barLen = cellSize*num + barOutLen*2;	//�o�[�̒�����ݒ�
	var barPosX,barPosY;
	var image;
	
	//���o�[��ݒ�
	barPosY = tablePosY - barOutLen;
	for(i=0;i<num;i++){
		barPosX = tablePosX + cellSize * i + (cellSize-barWidth)/2;
		image = new Image();
		image.src = IMAGE_BAR_YOKO;
		image.style.position = "absolute";
		image.style.top = barPosX;
		image.style.left = barPosY;
		image.id = "y" + i;
		image.width = barLen;
		image.height = barWidth;
		image.style.display = "none";
		document.getElementById("hiddenimage").appendChild(image);
	}

	//�c�o�[��ݒ�
	barPosX = tablePosX - barOutLen;
	for(i=0;i<num;i++){
		barPosY = tablePosY + cellSize * i + (cellSize-barWidth)/2;
		image = new Image();
		image.src = IMAGE_BAR_TATE;
		image.style.position = "absolute";
		image.style.top = barPosX;
		image.style.left = barPosY;
		image.id = "t" + i;
		image.width = barWidth;
		image.height = barLen;
		image.style.display = "none";
		document.getElementById("hiddenimage").appendChild(image);
	}
	
	//�΂߃o�[(���と�E��)
	image = new Image();
	if(num==3){
		image.src = IMAGE_BAR_NANAME3_0;
	}else{
		image.src = IMAGE_BAR_NANAME4_0;
	}
	image.style.position = "absolute";
	image.style.top = tablePosX - barOutLen/Math.sqrt(2);
	image.style.left = tablePosY - barOutLen/Math.sqrt(2);
	image.id = "n0";
	image.width = barLen;
	image.height = barLen;
	image.style.display = "none";
	document.getElementById("hiddenimage").appendChild(image);
	
	//�΂߃o�[(�E�と����)
	image = new Image();
	if(num==3){
		image.src = IMAGE_BAR_NANAME3_1;
	}else{
		image.src = IMAGE_BAR_NANAME4_1;
	}
	image.style.position = "absolute";
	image.style.top = tablePosX - barOutLen/Math.sqrt(2);
	image.style.left = tablePosY - barOutLen/Math.sqrt(2);
	image.id = "n1";
	image.width = barLen;
	image.height = barLen;
	image.style.display = "none";
	document.getElementById("hiddenimage").appendChild(image);
}

function setArrowImage(){
	//�����o���p���̊�{���W���v�Z
	var arrowPosX = [
		(cellSize -arrowSizeX)/2 - arrowDist,
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 + arrowDist,
		(cellSize -arrowSizeY)/2
	];
	var arrowPosY = [
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 + arrowDist,
		(cellSize -arrowSizeY)/2,
		(cellSize -arrowSizeX)/2 - arrowDist
	];

	var i,j,k;
	var image;
	//���W(i,j)�ɁAk�̌���(0:��A1:�E�A2:���A3:��)�̖����Z�b�g
	for(i=0;i<num;i++){
		for(j=0;j<num;j++){
			for(k=0;k<4;k++){
				//���摜�̃t�@�C�����A���W���Z�b�g
				image = new Image();
				image.src = arrowImages[k];
				image.style.position = "absolute";
				image.style.top =  tablePosX + cellSize * i + arrowPosX[k];
				image.style.left = tablePosY + cellSize * j + arrowPosY[k];

				//Id���Z�b�g
				//���W(2,1)�A���������Ȃ�"213"
				image.id = "" + i + j + k;

				//�摜����U��\���ɂ���
				image.style.display = "none";

				document.getElementById("hiddenimage").appendChild(image);
			}
		}
	}
}

//�t�@�C�����ƃZ���̍��W���w�肵�āA�摜��ύX����
function changeImageWithID(filename,x,y){
	var id = "" + x + y;
	var image = document.getElementById(id);
	image.src = filename;
	image.width = imageSize;			//IE�ŉ摜�T�C�Y�����f����Ȃ��ꍇ�����邽�ߑ΍�
	image.height = imageSize			//IE�ŉ摜�T�C�Y�����f����Ȃ��ꍇ�����邽�ߑ΍�
}

//�t�@�C�����ƃZ���̍��W���w�肵�āA�摜��z�u����
//�Z���̍��W�����̂܂܉摜��id�����ɂȂ�
//���W(1,2) �� id="12"
function setImageWithID(filename,x,y){
	var id = "" + x + y;
	var image = new Image();

	//�摜�̊�{����ݒ�
	image.src = filename;				//�t�@�C�����̐ݒ�
	image.style.position = "absolute";	//��Δz�u���[�h
	image.style.top = imagePosX[x][y];
	image.style.left = imagePosY[x][y];
	image.style.zIndex = "1";			//���摜����O�ɔz�u���邽��z���W��ݒ�
	image.id = "" + x + y;
	image.width = imageSize;			//IE�ŉ摜�T�C�Y�����f����Ȃ��ꍇ�����邽�ߑ΍�
	image.height = imageSize			//IE�ŉ摜�T�C�Y�����f����Ȃ��ꍇ�����邽�ߑ΍�;

	//�摜�ɃC�x���g��ݒ�
	//�C�x���g�ɂ̓Z���̍��W�������Ƃ��ēn��
	image.onmouseout = imageMouseOut;			//�}�E�X�����ꂽ�Ƃ�
	image.onclick = imageClick;					//�N���b�N��
	image.onmousemove = imageMouseMove;			//�}�E�X���������Ƃ�

	//�摜��z�u
	document.getElementById("hiddenimage").appendChild(image);
}

//�t�@�C�����ƍ��W���w�肵�āA�摜��z�u����
//id���w�肷���id���Z�b�g(�ȗ���)
//parent���w�肷��ΐe�m�[�h���w��(�f�t�H���g��hiddenimage)
function setImage(filename,x,y,id,parent){
	var image = new Image();
	image.src = filename;				//�t�@�C�����̐ݒ�
	image.style.position = "absolute";	//��Δz�u���[�h
	image.style.top = x;
	image.style.left = y;
	if(id!=null){
		image.id = id;
	}
	if(parent==null){
		document.getElementById("hiddenimage").appendChild(image);
	}else{
		document.getElementById(parent).appendChild(image);
	}
}

//�t�B�[���h�̑傫����ݒ肷��
function setFieldSize(){

	//��U�摜��S�č폜����
	delete_child_element("hiddenimage");

	//�I������Ă���e�[�u���T�C�Y���擾
	var selectedIdx = document.inputForm.num.selectedIndex;
	num = Number(document.inputForm.num.options[selectedIdx].value);
	
	//�e�[�u�����쐬
	var i;
	var tableStyleString = '"';
	tableStyleString += ( 'width:'  + cellSize * num +';' );
	tableStyleString += ( 'height:' + cellSize * num +';' );
	tableStyleString += ( 'top:'    + tablePosX      +';' );
	tableStyleString += ( 'left:'   + tablePosY      +';' );
	tableStyleString += ( 'position:absolute;'            );
	tableStyleString += '"';
	var tableString = '<table border="1" cellspacing="0" bgcolor="#F8F8FF"';
	tableString    += ('style=' + tableStyleString);
	tableString    += '>'
	for(i=0;i<num;i++){
		tableString += '<tr>';
		for(j=0;j<num;j++){
			tableString += '<td>&nbsp;</td>';
		}
		tableString += '</tr>';
	}
	tableString    += '</table>';
	document.getElementById("board").innerHTML = tableString;
	
	//�X�N���[���o�[���o����������肷��̂�h�����߂̃_�~�[�摜��z�u
	delete_element("dummyImage");	//�܂�����
	var dummyX = tablePosX + cellSize * (num + 1);
	var dummyY = tablePosY + cellSize * (num + 1);
	setImage("image/dummy.png",dummyX,dummyY,"dummyImage","body");
}

//id���w�肵�Ďq�v�f��S�ď���
function delete_child_element( id_name ){
	dom_obj=document.getElementById(id_name);
	//1�Ԗڂ̎q�m�[�h���擾
	var dom_obj_firstchild=dom_obj.firstChild;
	//�q�m�[�h���Ȃ���Ή������Ȃ�
	if(dom_obj_firstchild!=null){
		// 2�Ԗڈȍ~�̎q�m�[�h���폜
		while (dom_obj_firstchild.nextSibling){
			dom_obj.removeChild(dom_obj_firstchild.nextSibling);
		}
		// 1�Ԗڂ̎q�m�[�h���폜
		dom_obj.removeChild(dom_obj_firstchild);
	}
}

//id���w�肵�ėv�f������
function delete_element( id_name ){
	var dom_obj=document.getElementById(id_name);
	//�w�肳�ꂽID�����݂��Ȃ���Ή������Ȃ�
	if(dom_obj!=null){
		var dom_obj_parent=dom_obj.parentNode;
		dom_obj_parent.removeChild(dom_obj);
	}
}

//�t�B�[���h���Ɛ�搔���珟�s�𔻒肷��
//FIRST   :���̏���
//SECOND  :�~�̏���
//DRAW    :��������
//NOTEND  :������
function judgeWinLose(f,w){
	var r;

	//�t�B�[���h�����ߐs������Ă���΂�����̏���
	if(f.count[FIRST]==num*num){
		r = FIRST;
	}else if(f.count[SECOND]==num*num){
		r = SECOND;
	}else if( w!=-1 && (f.score[FIRST]>= w || f.score[SECOND]>= w)){
	//��搔�𒴂����ꍇ�͌���
		if( f.score[FIRST] == f.score[SECOND] ){
			r = DRAW;
		}else if(f.score[FIRST]>f.score[SECOND]){
			r = FIRST;
		}else{
			r = SECOND;
		}
	}else{
		r = NOTEND;
	}
	return r;
}