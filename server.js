const express = require('express') 
const redis = require('redis')
const bodyParser = require('body-parser');
const app = express();

const redisClient = redis.createClient()
const publisher = redis.createClient()
const subscriber = redis.createClient()

function add(a , b)
{
    return a+b;
}

function mul(a , b)
{
    return a*b
}
redisClient.on('connect' , () => {

    console.log('connected to redis')


})


redisClient.on("ready"  , () => {

    redisClient.config('SET' , 'notify-keyspace-events' , 'Ex')

})
subscriber.subscribe("__keyevent@0__:expired")

 app.use(bodyParser.urlencoded({extended : true}))
 app.use(bodyParser.json())


app.get('/' , (req , res) =>{

     var a = 6 ;
     var b = 10;
     res.send("this is working for now")
     var id = req.body.id
     var id1 = 'string-parody';
      redisClient.set(id1 , 'hello-world' , (err , reply) => {

          if(err)
          {
              console.log(err)
          }
          else {
              console.log(reply)
          }
      })

        redisClient.expire('string-parody' , 20)


var result = 0 ;
subscriber.on("message" , (channel , message) => {
      if(message == id)
      {
        result = add(a , b)
        console.log(result);
      }
      else if(message == id1)
      {
          result = mul(a , b)
          console.log(result)
      }

})


    //  var timer = setInterval( function() {
 
    //     redisClient.hgetall(id , (err , reply) => {

    //         if(reply)
    //         {
    //           console.log('im alive' + reply.toString())
    //         }
    //         else {

    //             clearTimeout(timer);
    //             console.log('this key expire')
    //             redisClient.quit();
    //         }
    //   })

    //  } , 1000)  

})

app.post('/' , (req  , res ) => {

    const id  = req.body.id ;
    const name = req.body.name ;
    const reff = req.body.reff  


    redisClient.hmset(id , {
        'name' : name , 
         'reff'  : reff
    } , (err , reply) => {

        if(!err)
        {
            console.log(reply)
    redisClient.expire(id , 100)

      


            res.send(reply)
        }
        
    })


}) 

 

app.listen(3000  , () => {
    console.log("the server is running ...")
})