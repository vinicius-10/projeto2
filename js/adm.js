// Lista que armazena os usuários cadastrados.
let listUser = []

// Chave usada para salvar a lista no localStorage.
const key = "listUser"

// Aguarda o HTML carregar antes de adicionar os eventos aos elementos.
document.addEventListener("DOMContentLoaded", () =>{
    // Evento responsável pelo cadastro de um usuário.
    document.getElementById("form-register").addEventListener("submit", (ev) => {
        // Impede o recarregamento da página.
        ev.preventDefault()
        submit_form(ev.target)
    })

    // Evento responsável pela exclusão de um usuário da lista.
    document.getElementById("ul-user").addEventListener("click", (ev) => {
        remove_list(ev.target.id)
    })

    // Evento responsável por limpar toda a lista.
    document.getElementById("reset-list").addEventListener("click", () => {
        clear()
    })

    // Evento responsável pela busca de usuários.
    document.getElementById("btn-search").addEventListener("click", (ev) => {
        search()
    })

    // Recupera os dados salvos e mostra os usuários na página.
    listUser = JSON.parse(localStorage.getItem(key))
    update_list()
})

/**
 * Recupera a lista de usuários salva no localStorage.
 * Se não houver dados, retorna uma lista vazia.
 */
function get_data_localStorage(){
    const data = JSON.parse(localStorage.getItem(key))
    return data ?? [] 
}

/**
 * Busca usuários pelo nome ou pelo e-mail digitado.
 */
function search(){
    const text_seach = document.getElementById("ipt-search").value.replace(" ","")
    const list_search = listUser.filter(item =>{
        return item.username.replace(" ","").includes(text_seach)  || item.email.includes(text_seach)
    })

    update_list(list_search)
}

/**
 * Remove todos os usuários cadastrados.
 */
function clear(){
    listUser = []
    update_db()
}

/**
 * Cria um usuário com os dados recebidos do formulário.
 *
 * @param {HTMLFormElement} form Formulário de cadastro.
 */
function submit_form(form){
    const formData = new FormData(form)
    const user = Object.fromEntries(formData)
    const date = new Date()
    user.date = date.toLocaleDateString("pt-BR") + ' às ' + date.getHours() +  ':'+ date.getMinutes()
    user.uuid = self.crypto.randomUUID()
    listUser.push(user)
    update_db()
}

/**
 * Salva a lista no localStorage e atualiza a página.
 */
function update_db(){
    localStorage.setItem(key,JSON.stringify(listUser))
    update_list()
}

/**
 * Mostra os usuários recebidos dentro da lista HTML.
 *
 * @param {Array} list Lista de usuários que será exibida (padrão: listUser).
 */
function update_list(list = listUser){
    const ul_list = document.getElementById("ul-user")
    ul_list.innerHTML = ""

    list.forEach(user => {
        const new_li = document.createElement('li')
        new_li.classList.add('list-item')
        new_li.id = user.uuid
        
        new_li.innerHTML = '<label class="item-date"> ' + user.date +' </label><label class="item-username">'+ user.username +'</label><label class="item-email">'+user.email+'</label> <button type="button" id="'+user.uuid+'" class="btn-item">Excluir</button>'

        ul_list.appendChild(new_li)
    })
}

/**
 * Remove o usuário que possui o código informado.
 *
 * @param {string} id Código único do usuário.
 */
function remove_list(id){
    const li_item = document.getElementById("li-"+id)
    listUser = listUser.filter( (item) => {
        return item.uuid !== id 
    })
    update_db()
}

