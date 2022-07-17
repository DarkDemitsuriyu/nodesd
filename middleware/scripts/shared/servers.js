const moment=require('moment');
moment.locale('ru-RU')

exports.getData=async function(login,req){
	let send=[
        {
          label: "tyumen-esx-01.rgs.ru",
          ip: "10.72.1.10",
          location: "Дирекция",
          functionality: [{label:"Интерфейс VMware"}],
          modelTipe: "HP",
          OS: "VMware ESXi 5.5",
          numberOfLicense: 0,
          CPU: [
            {label:"Intel® Xeon® CPU E5645 @ 2.40GHz"},
            {label:"Intel® Xeon® CPU E5645 @ 2.40GHz"}
          ],
          RAM: 26624,
          HDD: [
            {label:"HDD 500GB"},
            {label:"HDD 500GB"},
            {label:"HDD 500GB"},
            {label:"HDD 500GB"},
            {label:"HDD 500GB"}
          ],
          RAID: true,
          RAIDType: 5,
          note: "Заметка",
          children: [
            {
              label: "tmn-dc-01.rgs.ru",
              ip: "10.72.1.100",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"Контроллер домена RGSMAIN"},{label:"DNS"}],
              modelTipe: "Виртуальный сервер",
              OS: "Microsoft Windows Server 2008 R2 Standard",
              numberOfLicense: 0.5,
              CPU: [],
              RAM: 4096,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 320 GB) "}],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-dhcp-01.rgs.ru",
              ip: "10.72.1.110",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"DHCP"}],
              modelTipe: "Виртуальный сервер",
              OS: "Microsoft Windows Server 2008 R2 Standard",
              numberOfLicense: 0.5,
              CPU: [],
              RAM: 4096,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 40 GB)"}],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-fs-01.rgs.ru",
              ip: "10.72.1.120",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"Файловый Сервер"}],
              modelTipe: "Виртуальный сервер",
              OS: "Microsoft Windows Server 2008 R2 Standard",
              numberOfLicense: 0.5,
              CPU: [{label:"Intel® Xeon® CPU E5645 @ 2.40GHz"}],
              RAM: 4096,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 2000 GB)"}],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-mail-01.rgs.ru",
              ip: "10.72.1.3",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"Communigate Pro"}],
              modelTipe: "Виртуальный сервер",
              OS: "CentOS 7",
              numberOfLicense: 0,
              CPU: [{label:"Intel® Xeon® CPU E5645 @ 2.40GHz"}],
              RAM: 2048,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 200 GB)"}],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-sd-01.rgs.ru",
              ip: "10.72.1.253",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"Служба заявок"}],
              modelTipe: "Виртуальный сервер",
              OS: "Debian 8",
              numberOfLicense: 0,
              CPU: [{label:"Intel® Xeon® CPU E5645 @ 2.40GHz"}],
              RAM: 1024,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 300 GB)"}],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-elastix-01.rgs.ru",
              ip: "10.72.1.20",
              location: "tyumen-esx-01.rgs.ru",
              functionality: [{label:"Виртуальный факс сервер"},{label:"Виртуальная АТС"}],
              modelTipe: "Виртуальный сервер",
              OS: "Elastix 4",
              numberOfLicense: 0,
              CPU: [{label:"Intel® Xeon® CPU E5645 @ 2.40GHz"}],
              RAM: 2048,
              HDD: [{label:"VMware Virtual disk SCSI Disk Device ( 20 GB)"}],
              RAID: false,
              RAIDType: 0,
              note: ""
            }
          ]
        },
        {
          label: "tyumen-esx-02.rgs.ru",
          ip: "10.72.1.10",
          location: "Дирекция",
          functionality: ["Интерфейс VMware"],
          modelTipe: "IBM",
          OS: "VMware ESXi 6.0",
          numberOfLicense: 0,
          CPU: [
            "Intel® Xeon® CPU E5405 @ 2.00GHz",
            "Intel® Xeon® CPU E5405 @ 2.00GHz"
          ],
          RAM: 12288,
          HDD: [
            "HDD 1TB",
            "HDD 1TB",
            "HDD 1TB",
            "HDD 1TB"
          ],
          RAID: true,
          RAIDType: 10,
          note: "",
          children: [
            {
              label: "tmn-apps-01.rgs.ru",
              ip: "10.72.1.101",
              location: "tyumen-esx-02.rgs.ru",
              functionality: [
                "Kaspersky Security Center",
                "Эффект Оффис",
                "2ГИС",
                "Консультант+",
                "Openfire",
                "MS SQL Server Express"
              ],
              modelTipe: "Виртуальный сервер",
              OS: "Microsoft Windows Server 2008 R2 Standard",
              numberOfLicense: 0.5,
              CPU: [],
              RAM: 8192,
              HDD: [
                "VMware Virtual disk SCSI Disk Device ( 320 GB)"
              ],
              RAID: false,
              RAIDType: 0,
              note: ""
            },
            {
              label: "tmn-apps-02.rgs.ru",
              ip: "10.72.1.104",
              location: "tyumen-esx-02.rgs.ru",
              functionality: [],
              modelTipe: "",
              OS: "",
              numberOfLicense: 0,
              CPU: [],
              RAM: 0,
              HDD: [],
              RAID: false,
              RAIDType: 0,
              note: ""
            }
          ]
        },
        {
          label: "tyumen-esx-03.rgs.ru",
          ip: "10.72.29.45",
          location: "Сургут",
          functionality: ["Интерфейс VMware"],
          modelTipe: "HP ProLiant ML330 G6",
          OS: "VMware ESXi 6.0",
          numberOfLicense: 0,
          CPU: ["Intel® Xeon® CPU E5645 @ 2.40GHz"],
          RAM: 0,
          HDD: [],
          RAID: false,
          RAIDType: 0,
          note: "",
          children: [
            {
              label: "tmn-fs-05.rgs.ru",
              ip: "10.72.29.3",
              location: "tyumen-esx-02.rgs.ru",
              functionality: [
                "Файловый Сервер",
                "KSC"
              ],
              modelTipe: "Виртуальный сервер",
              OS: "Microsoft Windows Server 2008 R2 Standard",
              numberOfLicense: 0.5,
              CPU: [],
              RAM: 4096,
              HDD: ["VMware Virtual disk SCSI Disk Device ( 264 GB) "],
              RAID: false,
              RAIDType: 0,
              note: ""
            }
          ]
        },
        {
          label: "tyumen2.erc.rgs.ru",
          ip: "10.72.1.8",
          location: "Дирекция",
          functionality: ["Сервер Navision"],
          modelTipe: "",
          OS: "Microsoft Windows Server 2003 R2 Enterprise",
          numberOfLicense: 0,
          CPU: [],
          RAM: 0,
          HDD: [],
          RAID: false,
          RAIDType: 0,
          note: ""
        },
        {
          label: "NAS",
          ip: "10.72.1.9",
          location: "Дирекция",
          functionality: ["Хранилище данных Navision"],
          modelTipe: "",
          OS: "",
          numberOfLicense: 0,
          CPU: [],
          RAM: 0,
          HDD: [],
          RAID: false,
          RAIDType: 0,
          note: ""
        },
        {
          label: "tmn-fs-03.rgs.ru",
          ip: "10.72.22.3",
          location: "Нижневартовск",
          functionality: ["Файловый Сервер","Kaspersky Security Center"],
          modelTipe: "HP ProLiant ML330 G6",
          OS: "Microsoft Windows Server 2008 R2 Standard",
          numberOfLicense: 1,
          CPU: ["Intel® Xeon® CPU E5645 @ 2.40GHz"],
          RAM: 2048,
          HDD: ["HDD 500GB","HDD 500GB"],
          RAID: true,
          RAIDType: 1,
          note: ""
        },
        {
          label: "tmn-fs-04.rgs.ru",
          ip: "10.72.65.3",
          location: "Нижневартовск",
          functionality: ["Файловый Сервер","Kaspersky Security Center"],
          modelTipe: "HP ProLiant ML330 G6",
          OS: "Microsoft Windows Server 2008 R2 Standard",
          numberOfLicense: 1,
          CPU: ["Intel® Core™2 CPU E7500 @ 2.93GHz"],
          RAM: 2048,
          HDD: ["HDD 240GB","HDD 240GB"],
          RAID: true,
          RAIDType: 1,
          note: "записан и учтен как обычный ПК"
        }
      ]
	return send
};

exports.setData=async function(req,res,next){
	data=data.data
	console.log(data)
	let equipments=data.equipments;
	let id=data.id;
	//let year=moment(data.date).year();
	//let month=moment(data.date).month();
	let returnData={
		id:moment(data.date).year(),
		isItem:false,
		date:moment(data.date).year(),
		children:[
			{
				id:moment(data.date).format('YYYYMM'),
				isItem:false,
				date:moment(data.date).format('MMMM'),
				_parentId:moment(data.date).year(),
				children:[
					{
						_parentId:moment(data.date).format('YYYYMM'),
						isItem:true
					}
				]
			}
		]			
	};
	console.log(returnData._parentId)
	data.division=req.session.user.division;
	delete data.equipments;
	delete data.id;
	console.log(data)
	switch(req.body.type){
		case 'new':
			let [insertData]=await vdesk.mysql.query('INSERT INTO shared_invoices SET ?',data)
			data.id=insertData.insertId
			data.equipments=[]
			
			equipments.forEach(async function(item,idx){
				let [insertData]=await vdesk.mysql.query('INSERT INTO shared_invoices_equipments SET ?',item)
				item.id=insertData.insertId
				item.invoice=data.id;
				data.equipments.push(item)
			});
			
			Object.assign(returnData.children[0].children[0], data)
			callback(returnData)
			break;
		case 'edit': getSql('UPDATE directory_jobtitle SET name=? WHERE id = ? ',[data.name,data.id],function(results){callback(url,data,type);}); break;
		case 'delete': getSql('DELETE FROM directory_jobtitle WHERE id = ?',data.id,function(results){callback(url,data,type);}); break;
	}
	res.end()
}