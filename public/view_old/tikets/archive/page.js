(function () {
  TiketsGrid.prototype=new MainGrid();
  var mainGrid=new TiketsGrid();
  mainGrid.options.columns[0].splice(5, 0,
    {title: 'Исполнитель', field: 'worker', width:150 },
    {title: 'Отправитель', field: 'sender', width:150 },
    {title: 'Подразделение', field: 'department',width:100});
	mainGrid.createGrid();
})();
