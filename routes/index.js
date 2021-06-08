var express = require('express');
var mysql  = require('mysql');
const { route } = require('./users');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodedemo'
});

connection.connect(function(err){
  if(!err){
    console.log("DB connected")
  }else{
    console.log("DB connection Issue")
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {
  res.render('add-form', { title: 'Express' });
});

router.post('/add-process', function(req, res, next) {
console.log(req.body);

const mybodydata = {
  product_name : req.body.txt1,
  product_details : req.body.txt2,
  product_price : req.body.txt3,
}

// Insert route
connection.query("insert into tb_product set ?",mybodydata,function(err,result){
  if(err) throw err;
  res.redirect('/add')
})

});

// display route
router.get('/display', ((req,res, next) => {
  console.log(req.body);
  connection.query('SELECT * FROM `tb_product` ', (err, db_rows) => {
    if(err) throw err;
    console.log(db_rows);
    res.render('display',  {db_rows_array:db_rows});
  });
}));

// delete route
router.get('/delete/:id', ((req,res, next) => {
  var deleteId = req.params.id;
  console.log(deleteId);  
  connection.query('delete from tb_product where product_id = ? ', [deleteId], (err, db_rows) => {
    if(err) throw err;
    console.log(db_rows);
    res.redirect('/display');
  });
}));


// Edit routez
router.get('/edit/:id', ((req,res, next) => {
  var editId = req.params.id;
  console.log(editId);  
  connection.query('select * from tb_product where product_id = ? ', [editId], (err, db_rows) => {
    if(err) throw err;
    console.log(db_rows);
    res.render('edit', {db_rows_array:db_rows});
  });
}));

// post route
router.post('/edit/:id', ((req,res, next) => {
  var editId = req.params.id;
  var pname = req.body.txt1;
  var pdetails = req.body.txt2;
  var pprice = req.body.txt3;

  connection.query('update tb_product set product_name=?, product_details=?, product_price=? where product_id= ? ', [pname, pdetails, pprice, editId], (err, db_rows) => {
    if(err) throw err;
    res.redirect('/display');
  });
}));


module.exports = router;
