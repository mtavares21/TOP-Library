console.log("Hello")

let library = []

function Book(title, author, read){
  this.index = library.length == 0? 0:Math.max.apply(Math, library.map(item=>item.index))+1;
  this.title = title;
  this.author = author;
  this.read = read;
}

function AddBookToLibrary(form){
  const title = form[0].value;
  const author = form[1].value;
  const read = function(){
    if(form[2].checked === true){return "Yes"}
    else {return "No"}
    }
  if(title===""){return alert("Ups! You have nothing \"To-Shelf\"")}
  if(checkForBook(title)===false ){
    const newBook = new Book(title,author,read())
    library.push(newBook)
    createCard(newBook)
    form[0].value = ""
    form[1].value= ""
    const placeholder = document.querySelector("#newBook")
      placeholder.placeholder="" }
  else {alert("You already added this book!")}
}

function checkForBook(bookTitle){
  const search = library.find(
    item=> item.title.toString().toLowerCase()===bookTitle.toLowerCase())
  return search == undefined ? false:true
}

const displayLibrary = library.map(item => createCard(item))

function createCard(book){
  const container = document.querySelector(".contain")
  container.style.display="flex"

  const card = document.createElement("form")
  card.classList = "card"
  card.setAttribute ("data-index",`${library.length-1}`)
  container.appendChild(card)
  const leftCard = document.createElement("div")
  leftCard.classList="leftCard"
  card.appendChild(leftCard)
  
 const titleLabel = document.createElement("label")
    titleLabel.id="popLabelTitle"
    titleLabel.innerText="Title:"
    titleLabel.htmlFor= "popLabelTitle"
    leftCard.appendChild(titleLabel)
  const titleInput = document.createElement("input")
    titleInput.id = "popInputTitle"
    titleInput.name = "popInputTitle"
    titleInput.value = `${book.title}`
    leftCard.appendChild(titleInput)

  const authorLabel= document.createElement("label")
    authorLabel.id="popLabelAuthor"
    authorLabel.innerText="Author:"
    authorLabel.htmlFor="popInputAuthor"
    leftCard.appendChild(authorLabel)  
  const authorInput = document.createElement("input")
    authorInput.id = "popInputAuthor"
    authorInput.name = "popInputAuthor"
    authorInput.value = `${book.author}`
    leftCard.appendChild(authorInput)
 
  
  const read = document.createElement("label")
    read.classList = "specs"
    book.read==="Yes"? read.innerText = `You read it!`:read.innerText = `Not read!`
    leftCard.appendChild(read)
  
  const containButtons = document.createElement("div")
  containButtons.classList="containButtons"
  containButtons.setAttribute("data-index", `${library.length-1}`)
  container.appendChild(containButtons)
  const edit = document.createElement("input")
    edit.value= "Edit";
    edit.classList= "buttonEdit"
    edit.type = "submit"
    edit.setAttribute("data-index", `${library.length-1}`)
    edit.addEventListener("click", editCard)
    containButtons.appendChild(edit)

  const remove = document.createElement("input")
    remove.value= "X";
    remove.classList= "buttonRemove"
    remove.type = "submit"
    remove.setAttribute("data-index", `${library.length-1}`)
    remove.addEventListener("click", deleteCard) 
    containButtons.appendChild(remove)
  for(i=0; i<card.length; i++){
  card[i].setAttribute("readOnly", true)}
}

function saveCard(form, index){
  const title = form[0].value;
  const author = form[1].value;
  const radioLabels = Array.from(document.querySelectorAll(".specs"))
  const radioLabel = radioLabels[index]
  const read = function(){
    if(form[2].checked === true){radioLabel.innerText = "You read it!"; return "Yes"}
    else {radioLabel.innerText = "Not read!?" ;return "No"}
    }
  
  library[index].title = title;
  library[index].author = author;
  library[index].read = read();
  for(i=0; i<form.length; i++){
  form[i].setAttribute("readOnly", true)}
 
  form[3].remove()
  form[2].remove()
  const popLabelsYes = Array.from(document.querySelectorAll("#popLabelYes"))
  const popLabelYes = popLabelsYes.filter(item=> item.dataset.index==index)
  popLabelYes.map(item=>item.remove())

  const popLabelsNo = Array.from(document.querySelectorAll("#popLabelNo"));
  const popLabelNo = popLabelsNo.filter(item=>item.dataset.index== index)
  popLabelNo.map(item=>item.remove())

 const saveButtons = Array.from(document.querySelectorAll("#submitShelf"))
 const saveButton = saveButtons.filter(item=> item.dataset.index == index)
saveButton.map(item=> item.remove())
 
 const editButtons = Array.from(document.querySelectorAll(".buttonEdit"))
 const editButton = editButtons.filter(item=> item.dataset.index==index)
 editButton.map(item=>item.addEventListener("click", editCard))
}

function editCard(){
  this.removeEventListener("click", editCard)
  const cards = Array.from(document.querySelectorAll(".card"))
  const cardToEdit = cards[this.dataset.index]
  const leftCards = Array.from(document.querySelectorAll(".leftCard"))
  const leftCard = leftCards[this.dataset.index]
  const radioLabels = Array.from(document.querySelectorAll(".specs"))
  const radioLabel = radioLabels[this.dataset.index]
  radioLabel.innerText = "Have you read it?"
  const yesLabel = document.createElement("label")
    yesLabel.id="popLabelYes"
    yesLabel.innerText= "Yes"
    yesLabel.htmlFor= "popInputYes"
    yesLabel.dataset.index=cardToEdit.dataset.index
    leftCard.appendChild(yesLabel)
  const yesInput = document.createElement("input")
    yesInput.id= "popInputYes"
    yesInput.name= "popInput"
    yesInput.type= "radio"
    leftCard.appendChild(yesInput)
  const noLabel = document.createElement("label")
    noLabel.id="popLabelNo"
    noLabel.innerText= "No"
    noLabel.htmlFor= "popInputNo"
    noLabel.dataset.index=cardToEdit.dataset.index
    leftCard.appendChild(noLabel)
  const noInput = document.createElement("input")
    noInput.id= "popInputNo"
    noInput.name= "popInput"
    noInput.type= "radio"
    leftCard.appendChild(noInput)
   const save = document.createElement("input")
    save.id = "submitShelf"
    save.type = "button"
    save.dataset.index=cardToEdit.dataset.index
    save.value = "Shelf-it!"
    save.setAttribute("onclick", `saveCard(this.form, ${cardToEdit.dataset.index})`)
    cardToEdit.appendChild(save)
  for(i=0; i<cardToEdit.length; i++){
  cardToEdit[i].removeAttribute(`readonly`)}
}

function deleteCard(){
  const cards = Array.from(document.querySelectorAll(".card"))
  const cardToDelete = cards.filter(item=> item.dataset.index == this.dataset.index)
  cardToDelete.map(item=>item.remove())
  const buttons = Array.from(document.querySelectorAll(".containButtons"))
  const buttonsToDelete = buttons.filter(item=>item.dataset.index == this.dataset.index)
  buttonsToDelete.map(item=>item.remove())
  library = library.filter(item=> item.index != this.dataset.index)
  const contain = document.querySelector(".contain")
  if(library.length === 0){ contain.style.display = "none"}

}
