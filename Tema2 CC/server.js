const http = require('http');
const database = require("nedb");
const db = new database('database.db');
db.loadDatabase();

/** handle GET request */
function getHandler(req, reqUrl) {
  
  params = reqUrl.searchParams;
  console.log(params);
  var paramString  = "{";
  for (const [key, value] of params) {
    paramString = paramString + '"' + key + '"' + ":" + '"' + value + '"' + ",";
  }
  if(paramString != "{"){
    paramString = paramString.toString().substr(0,paramString.toString().length-1);
    paramString += "}";
    params = JSON.parse(paramString);
    return params;
  }else{
    return null
  }
  
}

function getStudent(req, res, reqUrl){
  params = getHandler(req, reqUrl);
  if(Object.keys(params) == [ 'nume', 'prenume' ].toString()){
    if(params['nume'] != '' && params['prenume'] != '' && params['prenume'] != 'Virgil'){
      db.findOne(params, function (err, docs){
        if(docs != null){
          console.log(docs);
          res.writeHead(200);
          res.write(JSON.stringify({nota:docs['nota']}));
          res.end();
        }
        else{
          res.writeHead(404);
          res.write('Studentul nu a fost gasit.');
          res.end();
        }
        
      });
      
    }
    else
    {
      res.writeHead(400);
      res.write('Parametrii nu au valoare.');
      res.end();
    }
  }
  else
  {
    res.writeHead(400);
    res.write('Parametrii incorecti.');
    res.end();
  }
}

function getCatalog(req, res, reqUrl){
  params = getHandler(req, reqUrl);
  if(params == null){
    db.find({}, function (err, docs){
      if(docs != null){
        res.writeHead(200);
        res.write(JSON.stringify(docs));
        res.end();
      }
      else{
        res.writeHead(404);
        res.write('Studentul nu a fost gasit.');
        res.end();
      }
      
    });
    
  }
  else
  {
    res.writeHead(400);
    res.write('Parametrii incorecti.');
    res.end();
  }
}

/** handle POST request */
function addStudent(req, res) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    if(Object.keys(body) == [ 'nume', 'prenume', 'nota' ].toString()){
      if(body['nume'] != '' && body['prenume'] != '' && body['prenume'] != 'Virgil'){
      db.insert(body);
      res.writeHead(201);
      res.write('Created');
      res.end();
      }
      else{
        res.writeHead(400);
        res.write('Parametrii nu au valoare.');
        res.end();
      }
    }
    else{
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
    }
    
  });
}

/** handle POST request */
function addStudents(req, res) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    for(student of body){
      if (!(Object.keys(student) == [ 'nume', 'prenume', 'nota' ].toString())){
        res.writeHead(400);
        res.write('Parametrii incorecti.');
        res.end();
        return
      }
      else{
        if (!(student['nume'] != '' && student['prenume'] != '' && student['prenume'] != 'Virgil')){
          res.writeHead(400);
          res.write('Parametrii nu au valoare.');
          res.end();
          return
        }
      }
    }

    db.insert(body);
    res.writeHead(201);
    res.write('Created');
    res.end();
      
    
  });
}

function updateGrade(req, res){
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    if(Object.keys(body) == [ 'nume', 'prenume', 'nota' ].toString()){
      if(body['nume'] != '' && body['prenume'] != '' && body['prenume'] != 'Virgil'){
      db.update({nume:body['nume'], prenume:body['prenume']}, {$set: {nota:body['nota']}}, {multi: true});
      res.writeHead(200);
      res.write('Ok');
      res.end();
      }
      else{
        res.writeHead(400);
        res.write('Parametrii nu au valoare.');
        res.end();
      }
    }
    else{
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
    }
  });
}

function updateGrades(req, res) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    for(student of body){
      if (!(Object.keys(student) == [ 'nume', 'prenume', 'nota' ].toString())){
        res.writeHead(400);
        res.write('Parametrii incorecti.');
        res.end();
        return
      }
      else{
        if (!(student['nume'] != '' && student['prenume'] != '' && student['prenume'] != 'Virgil')){
          res.writeHead(400);
          res.write('Parametrii nu au valoare.');
          res.end();
          return
        }
      }
    }
    for(student of body){
      db.update({nume:student['nume'], prenume:student['prenume']}, {$set: {nota:student['nota']}}, {multi: true});
    }
    res.writeHead(200);
    res.write('Ok');
    res.end();
      
    
  });
}

function removeStudent(req, res) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    if(Object.keys(body) == [ 'nume', 'prenume'].toString()){
      if(body['nume'] != '' && body['prenume'] != '' && body['prenume'] != 'Virgil'){
      db.remove(body);
      res.writeHead(200);
      res.write('Ok');
      res.end();
      }
      else{
        res.writeHead(400);
        res.write('Parametrii nu au valoare.');
        res.end();
      }
    }
    else{
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
    }
    
  });
}


function removeStudents(req, res) {
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    try{
      body = JSON.parse(chunk);
    }
    catch(err){
      res.writeHead(400);
      res.write('Parametrii incorecti.');
      res.end();
      return
    }
    for(student of body){
      if (!(Object.keys(student) == [ 'nume', 'prenume' ].toString())){
        res.writeHead(400);
        res.write('Parametrii incorecti.');
        res.end();
        return
      }
      else{
        if (!(student['nume'] != '' && student['prenume'] != '' && student['prenume'] != 'Virgil')){
          res.writeHead(400);
          res.write('Parametrii nu au valoare.');
          res.end();
          return
        }
      }
    }
    for(student of body){
      db.remove(student);
    }
    res.writeHead(200);
    res.write('Ok');
    res.end();
      
    
  });
}


/** if there is no related function which handles the request, then show error message */
function noResponse(req, res) {
  res.writeHead(405);
  res.write('Method not allowed');
  res.end();
}

http.createServer((req, res) => {
  // create an object for all redirection options
  const router = {
    'GET/nota-student': getStudent,
    'GET/catalog': getCatalog,
    'POST/add-student': addStudent,
    'POST/add-students': addStudents,
    'PUT/update-grade': updateGrade,
    'PUT/update-grades': updateGrades,
    'DELETE/remove-student': removeStudent,
    'DELETE/remove-students': removeStudents,
    'default': noResponse
  };
  // parse the url by using WHATWG URL API
  let reqUrl = new URL(req.url, 'http://127.0.0.1/');
  // find the related function by searching "method + pathname" and run it
  let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
  redirectedFunc(req, res, reqUrl);
}).listen(8080, () => {
  console.log('Server is running at http://127.0.0.1:8080/');
});