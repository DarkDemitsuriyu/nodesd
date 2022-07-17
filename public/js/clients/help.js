let scrl={
	top:null,
	left:null
}
let sticky;
function checkScroll() {
	if (window.pageXOffset != scrl.left) {
		scrl.top = window.pageYOffset;
		scrl.left = window.pageXOffset;
	} else if (window.pageYOffset != scrl.top) {
		scrl.top = window.pageYOffset;
		scrl.left = window.pageXOffset;
	}
	if(scrl.top>54){
		sticky.css({
			'z-index':1000,
			top:'54px',
			position: 'fixed',
			left:'51px',
			right:'50px'
		})
	} else {
		sticky.css({
			'z-index':1000,
			top:'0px',
			position: 'relative',
			left:'0px',
			right:'0px'
		})
	}
}
$(document).ready(function(){
	$('#grid-data').on( 'init.dt', function () {
		var ua = detect.parse(navigator.userAgent);
		sticky = $('.sticky-top');
		if(ua.browser.family+ua.browser.version === 'IE11'){
			sticky.addClass('polyfil')
			checkScroll();
			window.addEventListener('scroll', checkScroll);
		}		
	}).DataTable({
		data:users,
		dom:
"<'navbar align-items-center bg-success sticky-top'Bflp>" +
"<'row'<'col-sm-12'tr>>",
		responsive: true,
		"lengthMenu": [ [ -1, 15, 30, 50, 100], ["Все", 15, 30, 50, 100] ],
		buttons: [
			'copy', 'excel'
		],
		select: 'single',
		autoWidth: false,
		columns: [
			{ data: 'fullname', title: 'ФИО', "width": "200px" },
			{ data: 'outphone', title: 'Гор. номер телефона', "width": "50px"},
			{ data: 'extphone', title: 'Вн. номер телефона', "width": "50px" },
			{ data: 'mail', title: 'E-Mail' },
			{ data: 'department', title: 'Подразделение' },
			{ data: 'jobtitle', title: 'Должность' }
		],
		language: {
            lengthMenu: "Отобразить _MENU_ записей на странице",
            zeroRecords: "Ничего не найдено - извините",
            info: "Показана страница _PAGE_ из _PAGES_",
            infoEmpty: "No records available",
            infoFiltered: "(filtered from _MAX_ total records)",
			search:"Поиск:",
			paginate:{
				next: "Вперед",
				previous:"Назад",
				first:"В начало",
				last:"В конец"
			}
        }
	});
	
});
