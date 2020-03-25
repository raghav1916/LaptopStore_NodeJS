const fs=require('fs');
const http=require('http');
const url=require('url');
const json=fs.readFileSync(__dirname + '/starter/data/data.json', 'utf8');//dirname-home folder and if we dont write utf 8, then instead of file it will save as buffer. Stroing json file in json variable
//since we want to use json file .We store it in an object called laptop data.
const laptopdata=JSON.parse(json);//JSON.parse basically creates an object and stores data. It's now a javascript object and not a string.

console.log(laptopdata);
const server=http.createServer((req,res)=>{
   const pathName= url.parse(req.url,true).pathname;//we read pathname from URl
    const id=url.parse(req.url,true).query.id;//we read ID from URl
    console.log(pathName);
    //each time when we are accessing server we have a response res.
    //PRODUCT OVERVIEW
    if(pathName==='/products'||pathName==='/'){
res.writeHead(200,{'Content-type':'text/html'});//basically 200 means the status code which is proper hit. It means its gonna be a text html page
        fs.readFile(__dirname +'/templates/template-overview.html','utf8',(err,data)=>{//first only the outer container is displayed.
            let overviewOutput=data;
           
            fs.readFile(__dirname +'/templates/template-card.html','utf8',(err,data)=>{
                const cardsOutput=laptopdata.map(el=>replaceTemplate(data,el)).join('');//map method maps thorugh the array stores the result of each iteration into a new array. Join converts all the HTML code into a string
                overviewOutput=overviewOutput.replace('{%CARDS%}',cardsOutput);
                 res.end(overviewOutput);//The HTML should be displayed on browser.//everything should be written only after the written head
           //Now after, the outercontainer we have to write another call back function inside this to display cards(different tpe of laptops)
            
        });
        });
    }
    
    //LAPTOP DETAIL
    else if(pathName==='/laptop' && id<laptopdata.length){
        res.writeHead(200,{'Content-type':'text/html'});
        fs.readFile(__dirname +'/templates/template-laptop.html','utf8',(err,data)=>{
            const laptop=laptopdata[id];
            const output=replaceTemplate(data,laptop);
            res.end(output);//The HTML should be displayed on browser
            
        });
    }
    
    //IMAGES
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName))// we will test if the regular expression contains .jpg/gif etc from pathname
    {
        fs.readFile(__dirname+'/starter/data/img'+pathName,(err,data)=>{
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(data);
        })
}
    //ELEMENT NOT FOUND
    else{
        res.writeHead(404,{'Content-type':'text/html'});
        res.end('URL was not found on the server!');
    }
});//creating a webserver
server.listen(1337,'127.0.0.1',()=>{
    console.log('Server Started Listening');
})//This method says always keep listening on a certain port and a certain IP address

function replaceTemplate(originalHTML,laptop){
    let output=originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName);//placeholders usedin HTML so that depending on the product it gets changed
            output=output.replace(/{%IMAGE%}/g,laptop.image);
            output=output.replace(/{%PRICE%}/g,laptop.price);
            output=output.replace(/{%SCREEN%}/g,laptop.screen);
            output=output.replace(/{%CPU%}/g,laptop.cpu);
            output=output.replace(/{%STORAGE%}/g,laptop.storage);
            output=output.replace(/{%RAM%}/g,laptop.ram);
            output=output.replace(/{%DESCRIPTION%}/g,laptop.description);
            output=output.replace(/{%ID%}/g,laptop.id);
            
    return output;
            
}


//*Routing*-It is responding in different ways to different URLs.Suppose if we are accessing the address 127.0.0.1:1337/freuis, then freuis becomes the URL. Now, when we console.log(req )we can see that this object contains value URL. So inorder to execute routing we have to write the method using req object.Now, using req.url alone will give us only URL, but inorder for us to retreive other values of URL like hostnmae,protocol,auth,port etc we have to use url module which we defined above.so, we use url.parse method
