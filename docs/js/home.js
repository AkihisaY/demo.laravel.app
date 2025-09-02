$(function(){
    home_func();
    ajax_func();
});

function generateColors(n) {
    const colors = [];
    for (let i = 0; i < n; i++) {
        const hue = i * (360 / n); // 色相を均等にずらす
        colors.push(`hsl(${hue}, 70%, 70%)`);
    }
    return colors;
}

function home_func(){
    var url = location.href + '/circle';
    ajax_action(url);
    function ajax_action(url){
        $.ajax({
            haeder:{ 'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')},
            url : url,
            type : 'GET',
            data : {},
            cache : false,
            dataType : 'json'
        })
        .done(function(data){
            // circleStock(data.stocks,data.stock_total);
            circleStock();
            circleBond(data.bonds,data.bond_total,data.rate['rate']);
            circleSaving(data.savings,data.saving_total,data.rate);
            circleOther(data.others,data.other_total,data.rate);
            circleTotal((data.stock_total*data.rate['rate']),(data.bond_total*data.rate['rate']),data.saving_total,data.other_total,(data.stock_total*data.rate['rate'] + data.bond_total*data.rate['rate'] + data.saving_total + data.other_total));
        })
        .fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert('Please reach out System Administrator');            
        })
    }
}

//Discribe Circle Chart for Stocks
function circleStock() {
    const stocks = [
      { company_short: 'トヨタ', total: 300 },
      { company_short: 'ソニー', total: 200 },
      { company_short: '任天堂', total: 100 }
    ];
    const stock_total = stocks.reduce((sum, stock) => sum + stock.total, 0);

    const labelList = [];
    const dataList = [];
    for (let i = 0; i < stocks.length; i++) {
        labelList.push(`${stocks[i]['company_short']} : ${Math.round(stocks[i]['total'] / stock_total * 100)}%`);
        dataList.push(stocks[i]['total']);
    }

    const backgroundColors = generateColors(stocks.length);

    const data = {
        labels: labelList,
        datasets: [{
            data: dataList,
            backgroundColor: backgroundColors,
            hoverOffset: 20,
            hoverBorderJoinStyle: 'miter',
            spacing: 1,
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        },
    };

    new Chart(
        document.getElementById('myCircleStock'),
        config
    );
}


//Discribe Circle Chart for Stocks
function circleBond(bonds,bond_total,rate){
    // console.log(bonds);
    var labelList = new Array();
    var dateList = new Array();
    for (let i = 0; i < bonds.length; i++) {
        labelList.push(bonds[i]['company_short']+' : '+Math.round(bonds[i]['total']/bond_total*100)+'%');
        dateList.push(bonds[i]['total']*rate);
    }
    const backgroundColors = generateColors(bonds.length)
    const data = {
        labels: labelList,
        datasets: [{
            position: 'right',
            data: dateList,
            backgroundColor: backgroundColors,
            hoverOffset: 20,
            hoverBorderJoinStyle: 'miter',
            spacing: 1,
        }]
      };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                  position: 'right',
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('myCircleBond'),
        config
    );
}

//Discribe Circle Chart for Stocks
function circleSaving(savings,saving_total,rate){
    var labelList = new Array();
    var dateList = new Array();
    var saving = 0;
    for (let i = 0; i < savings.length; i++) {
        if(savings[i]['country_id'] == 1){
            saving = savings[i]['amount'];
        }else{
            saving = savings[i]['amount']*rate['rate'];
        }
        labelList.push(savings[i]['bank_short']+' : '+Math.round(saving/saving_total*100)+'%');
        dateList.push(saving);
    }
    // console.log(labelList);
    const backgroundColors = generateColors(dateList.length)
    const data = {
        labels: labelList,
        datasets: [{
            position: 'right',
            data: dateList,
            backgroundColor: backgroundColors,
            hoverOffset: 20,
            hoverBorderJoinStyle: 'miter',
            spacing: 1,
        }]
      };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                  position: 'right',
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('myCircleSaving'),
        config
    );
}

function circleOther(others,other_total,rate){
    var labelList = new Array();
    var dateList = new Array();
    var saving = 0;
    for (let i = 0; i < others.length; i++) {
        if(others[i]['country_id'] == 1){
            saving = others[i]['total'];
        }else{
            saving = Math.round(others[i]['total']*rate['rate']);
        }
        // console.log(others[i]['company_short']+' : '+others[i]['total']+' : '+saving);
        labelList.push(others[i]['company_short']+' : '+Math.round(saving/other_total*100)+'%');
        dateList.push(saving);
    }
    const backgroundColors = generateColors(dateList.length)
    const data = {
        labels: labelList,
        datasets: [{
            position: 'right',
            data: dateList,
            backgroundColor: backgroundColors,
            hoverOffset: 20,
            hoverBorderJoinStyle: 'miter',
            spacing: 1,
        }]
      };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                  position: 'right',
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('myCircleOther'),
        config
    );
}

//Discribe Circle Chart for Stocks
function circleTotal(stock,bond,saving,other,total){
// function circleTotal(stock,bond,saving,total){
        // console.log(other);
    const backgroundColors = generateColors(4);
    const data = {
        labels: ['Stock : ' + (Math.round(stock/total*100)) + '%'
                ,'Saving : ' + (Math.round(saving/total*100)) + '%'
                ,'Bond : ' + (Math.round(bond/total*100)) + '%'
                ,'Others : ' + (Math.round(other/total*100)) + '%'
            ],
        datasets: [{
            position: 'right',
            // data: [Math.round(stock/total*100),Math.round(saving/total*100),Math.round(bond/total*100)],
            data: [Math.round(stock/total*100),Math.round(saving/total*100),Math.round(bond/total*100),Math.round(other/total*100)],
            backgroundColor: backgroundColors,
            // // borderColor: [
            // //     'rgb(46, 134, 193)',
            // //     'rgb(203, 67, 53)',
            // //     'rgb(4, 227, 31)',
            // //     'rgb(227, 227, 4)',
            // // ],
            // borderWidth: 1,
            // hoverOffset: 5,
            // hoverBorderJoinStyle: 'miter',
            spacing: 1,
        }]
      };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                  position: 'right',
                }
            }
        },
    };

    const myChart = new Chart(
        document.getElementById('myCircleTotal'),
        config
    );
}

//Discribe Circle Chart
function bar(){
    const labels = [1, 2, 3, 4, 5, 6, 7];
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset1',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            },
            plugins: {
                legend: {
                  position: 'top',
                }
            }
        },
    };

    const myBar = new Chart(
        document.getElementById('myBar'),
        config
    );
}

//Monthly Asset Chart
function ajax_func(){
    var url = location.href + '/amount';
    ajax_action(url);
    function ajax_action(url){
        $.ajax({
            haeder:{ 'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')},
            url : url,
            type : 'GET',
            data : {},
            cache : false,
            dataType : 'json'
        })
        .done(function(data){
            // console.log(data.total);
            chart(data.total);
        })
        .fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert('Please reach out System Administrator');            
        })
    }
}

function chart(assets){
    col_1 = 'date';
    col_2 = 'total_amount';
    // col_3 = 'stock_total';
    var label_list = new Array();
    var data_list = new Array();
    for(var i = assets.length ; i > 0 ; i--){
        label_list.push(assets[i-1][col_1]);
        data_list.push(assets[i-1][col_2]);
    }
    // console.log(assets);
    // const labels = [
    //     assets[4][col_1],
    //     assets[3][col_1],
    //     assets[2][col_1],
    //     assets[1][col_1],
    //     assets[0][col_1],
    // ];
    const labels = label_list;
    
    const data = {
        labels: labels,
        datasets: [{
            label: 'Total',
            backgroundColor: 'rgb(2, 12, 192)',
            borderColor: 'rgb(2, 12, 192)',
            data: data_list,
        },
        // {
        //     label: 'Stock Total',
        //     backgroundColor: 'rgb(2, 12, 192)',
        //     borderColor: 'rgb(255, 99, 132)',
        //     data: [
        //             assets[4][col_3]
        //             ,assets[3][col_3]
        //             ,assets[2][col_3]
        //             ,assets[1][col_3]
        //             ,assets[0][col_3]
        //         ],
        // }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}