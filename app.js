var objetos;        //Objeto de teste
var urlRepos;       //Objeto que guardará o link de api dos repositórios
var urlFollowers;   //Objeto que guardará o link de api dos seguidores
var objUser;        //Objeto que guardará o objeto do usuário
var objRepos;       //Objeto que guardará o objeto dos repositórios
var objFollowers;   //Objeto que guardará o objeto dos seguidores


//Função de requisição
function requisicao(urlApi,funcao) {
    let user = new XMLHttpRequest();
    user.onload = funcao;
    user.onerror = erro;
    user.open("GET", urlApi);
    user.send();
}


//Função de sucesso
function sucesso() {
    let obj = JSON.parse(this.responseText);
    objetos = obj;
}
//Função de erro
function erro() {
    alert(`Erro na requisição:\nCódigo do erro: ${this.status} - ${this.statusText}`)
}

//Função repositórios
function repositorios() {
    objRepos = JSON.parse(this.responseText);
    for(i = 0; i < objRepos.length; i++){
        
        document.querySelector("#repositorios .row").innerHTML += `
            <div class="col-12">
                <div class="reposBox">
                    <a href="${objRepos[i].html_url}" target="_blank" class="reposTitle">${objRepos[i].name}</a>
                    <p>Data de publicação: ${objRepos[i].created_at.substring(8,10)+"/"+objRepos[i].created_at.substring(5,7)+"/"+objRepos[i].created_at.substring(0,4)}</p>
                    <p><strong>Descrição: </strong> ${objRepos[i].description}</p>
                </div>
            </div>`;
    }
    

}

//Função dados do usuário
function dadosUsuario() {
    objUser = JSON.parse(this.responseText);
    /*request(objUser.followers_url,sucessoFollowers);*/
    requisicao(objUser.repos_url,repositorios);

    fotoPerfil.innerHTML +=`
        <a href="${objUser.html_url}" target="_blank"><img src="${objUser.avatar_url}" alt="Foto de ${objUser.login}"></a>
    `;

    sobre.insertAdjacentHTML("afterBegin",`
        <a href="${objUser.html_url}" target="_blank" class="nome">${objUser.name}</a>
        <a href="${objUser.html_url}" target="_blank" class="login">@${objUser.login}</a>
        <p class="bio">${objUser.bio}</p>
    `);
}

//Função dados da pesquisa
function sucessoReposSearch() {
    var reposSearch = JSON.parse(this.responseText).items;
    
    for( i = 0; i<reposSearch.length; i++){
        document.querySelector("#searchResultados>.row").innerHTML += `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="${reposSearch[i].owner.avatar_url}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title"><i class="fa fa-caret-right" aria-hidden="true"></i>\t${reposSearch[i].name}</h5>
                    <p>Repositório</p>
                    <p><strong>Autor: </strong><a href="${reposSearch[i].owner.html_url}">${reposSearch[i].owner.login}</a></p> 
                    <a href="${reposSearch[i].html_url}" target="_blank" class="btn">Visitar Repositório</a>
                </div>
            </div>
        </div>`;
    }
    
}

//Função dados da pesquisa
function sucessoSearch() {
    var usersSearch = JSON.parse(this.responseText).items;
    
    for( i = 0; i<usersSearch.length; i++){
        document.querySelector("#searchResultados>.row").innerHTML += `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="${usersSearch[i].avatar_url}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title"><i class="fa fa-caret-right" aria-hidden="true"></i>\t${usersSearch[i].login}</h5>
                    <p>Usuário</p>
                    <a href="${usersSearch[i].html_url}" target="_blank" class="btn">Visitar Perfil</a>
                </div>
            </div>
        </div>`;
    }
}

onload = () =>{
    //requisição dos dados do usuário
    requisicao("https://api.github.com/users/GabrielaValent", dadosUsuario);

    //Pesquisa de usuários
    searchForm.onsubmit = (evento) =>{
        document.querySelector("#searchResultados").innerHTML = '<div class="row"></div>';
        requisicao(`https://api.github.com/search/users?q=${searchText.value}`,sucessoSearch);
        requisicao(`https://api.github.com/search/repositories?q=${searchText.value}`,sucessoReposSearch);
        evento.preventDefault();
    }
}