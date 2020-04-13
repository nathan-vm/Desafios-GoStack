const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(request,response,next){
  const {method,url} = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next()

  console.timeEnd(logLabel)
}

app.use(logRequest)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const body = request.body
  const repository = {id:uuid(),...body,likes:0}
  
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title,url,techs} = request.body
  const repositoryIdx = repositories.findIndex(repository=>repository.id ===id)
  
  if(repositoryIdx<0){
    return response.status(400).json({error:'Repository not found'})
  }
  const repository = {
    ...repositories[repositoryIdx],
    id,
    title,
    url,
    techs
  }

  repositories[repositoryIdx] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const repositoryIdx = repositories.findIndex(repository=> repository.id === id)

  if(repositoryIdx<0){
    return response.status(400).json({error:"Repository not found"})
  }

  repositories.splice(repositoryIdx,1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  const repository = repositories.find(repository=>repository.id === id)

  if(!repository){
    return response.status(400).json({error: "Repository not found"})
  }

  repository.likes+=1

  return response.json(repository)

});

module.exports = app;
