(function () {
	TiketsGrid.prototype=new MainGrid();
	var mainGrid=new TiketsGrid();
	var user=JSON.parse(localStorage.getItem('user'));
	mainGrid.options.columns[0].splice(5, 0, 
		{title: 'Отправитель', field: 'sender', width:150 },
		{title: 'Подразделение', field: 'dep', width:150 },
		{title: 'Чья заявка', field: 'my', styler: function(v,r,i){
				if (v!=='Моя'){
					return 'background:yellow;';
				}
			}},
		{title: 'Тема', field: 'topicname',width:200});
	mainGrid.createGrid();
})();