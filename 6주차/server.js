const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

var db;
MongoClient.connect('mongodb+srv://jmy9937:tmddus0307@cluster0.owkj40c.mongodb.net/?retryWrites=true&w=majority', function(에러, client){

    if(에러){return console.log(에러)}

    db = client.db('todoapp');

   // db.collection('post').insertOne({이름 : 'John', 나이 : 20, _id : 100}, function(에러, 결과){
  //      console.log('저장완료');
    //});

    app.listen(8080, function(){
        console.log('listening on 8080')
    });    
})

//app.listen(8080, function(){
  //  console.log('listening on 8080')
//});

// 누군가가 /pet으로 방문하면 pet 관련된 안내문을 띄워주자
app.get('/pet', function(req, res){
    res.send('펫용품 쇼핑 페이지입니다.');
});

app.get('/beauty', function(req, res){
    res.send('뷰티용품 쇼핑 페이지입니다.');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html');
})

// 어떤 사람이 /add 경로로 POST 요청을 하면 ~~를 해주세요
app.post('/add', function(req, res){
    res.send('전송완료');
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost);
        var 총게시물갯수 = 결과.totalPost;

        db.collection('post').insertOne({ _id : 총게시물갯수 + 1 , 제목 : req.body.title, 날짜 : req.body.date }, function(에러, 결과){
            console.log('저장완료');

            // counter라는 콜렉션에 있는 totalPost 항목도 1 증가시켜야함
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost : 1} }, function(에러, 결과){
                // 기능 실행
                if(에러){return console.log(에러)}
            })
        });

    });   

});


// /list로 get 요청으로 접속하면 실제 DB에 저장된 데이터들로 꾸며진 html을 보여줌
app.get('/list', function(req, res){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        res.render('list.ejs', { posts : 결과 });
    }); // 저장된 모든 데이터를 가져옴
    
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(에러, 결과){
        console.log('삭제완료');
        res.status(200).send({ message : '성공했습니다' });
    })
})

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id) }, function(에러, 결과){
        console.log(결과);
        res.render('detail.ejs', { data : 결과 });
    })
})