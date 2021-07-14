import { saveBook, updateBook, deleteBook } from "./baas";

function AddBookToFirebase(form) {
  const title = form[0].value;
  const author = form[1].value;
  const read = form[2].checked ? "Yes" : "No";
  if (title === "") {
    return alert('Ups! You have nothing "To-Shelf"');
  }
  if (author === "") {
    return alert('Ups! You have no author "To-Shelf"');
  } else {
    saveBook(title, author, read);
    form[0].value = "";
    form[1].value = "";
    const placeholder = document.querySelector("#newBook");
    placeholder.placeholder = "";
  }
}

function createAndInsertCard(book) {
  //Root
  const cardsWrapper = document.getElementById("cardWrapper");
  cardsWrapper.style.display = "flex";
  // Card Wrapper
  const container = document.createElement("div");
  container.style.display = "flex";
  container.classList = "bookCard";
  container.id = `${book.id}`;
  cardsWrapper.appendChild(container);
  // Card form
  const card = document.createElement("form");
  card.classList = "card";
  container.appendChild(card);
  // Left Card
  const leftCard = document.createElement("div");
  leftCard.classList = "leftCard";
  card.appendChild(leftCard);
  // Title
  //Label
  const titleLabel = document.createElement("label");
  titleLabel.classList = "popLabelTitle";
  titleLabel.innerText = "Title:";
  titleLabel.htmlFor = "popLabelTitle";
  leftCard.appendChild(titleLabel);
  //Input
  const titleInput = document.createElement("input");
  titleInput.classList = "popInputTitle";
  titleInput.name = "popInputTitle";
  titleInput.value = `${book.title.split("_").join(" ")}`;
  leftCard.appendChild(titleInput);
  // Author
  //Label
  const authorLabel = document.createElement("label");
  authorLabel.classList = "popLabelAuthor";
  authorLabel.innerText = "Author:";
  authorLabel.htmlFor = "popInputAuthor";
  leftCard.appendChild(authorLabel);
  //Input
  const authorInput = document.createElement("input");
  authorInput.classList = "popInputAuthor";
  authorInput.name = "popInputAuthor";
  authorInput.value = `${book.author}`;
  leftCard.appendChild(authorInput);
  // isRead
  const read = document.createElement("label");
  read.classList = "specs";
  book.read === "Yes"
    ? (read.innerText = `You read it!`)
    : (read.innerText = `Not read!`);
  leftCard.appendChild(read);
  // Button's Wrapper
  const containButtons = document.createElement("div");
  containButtons.classList = "containButtons";
  container.appendChild(containButtons);
  // Edit Button
  const edit = document.createElement("input");
  edit.value = "Edit";
  edit.classList = "buttonEdit";
  edit.type = "submit";
  edit.addEventListener("click", () => editCard(book.id), {
    once: true,
  });
  containButtons.appendChild(edit);
  // Delete Button
  const remove = document.createElement("input");
  remove.value = "X";
  remove.classList = "buttonRemove";
  remove.type = "submit";
  remove.addEventListener("click", () => deleteBook(book.title));
  containButtons.appendChild(remove);
  for (let i = 0; i < card.length; i++) {
    card[i].setAttribute("readOnly", true);
  }
}
function updateCard(id) {
  const cardToEdit = document.querySelector(`#${id} .card`);
  const yesLabel = document.querySelector(`#${id} .card .popLabelYes`);
  const noLabel = document.querySelector(`#${id} .card .popLabelNo`);
  const button = document.querySelector(`#${id} .card .submitShelf`);
  const isReadLabel = document.querySelector(`#${id} .card .specs`);
  const editButton = document.querySelector(`#${id} .buttonEdit`);
  const radioYes = cardToEdit[2];
  const radioNo = cardToEdit[3];
  // Set readOnly
  for (let i = 0; i < cardToEdit.length; i++) {
    cardToEdit[i].setAttribute(`readonly`, "true");
  }
  // Display radio checked result
  isReadLabel.innerText = cardToEdit[2].checked ? "You read it!" : "Not read";
  // Remove radio inputs and labels
  yesLabel.remove();
  noLabel.remove();
  radioYes.remove();
  radioNo.remove();
  button.remove()
  // Reset edit event listener
  editButton.addEventListener("click", () => editCard(id), { once: true });
}

function editCard(id) {
  const cardToEdit = document.querySelector(`#${id} .card`);
  const leftCard = document.querySelector(`#${id} .card .leftCard`);
  const isReadLabel = document.querySelector(`#${id} .card .specs`);
  // Radio Buttons
  const isRead = isReadLabel.innerText === `You read it!`? true:false
  // Buttons Label
  isReadLabel.innerText = "Have you read it?";
  // Yes
  //label
  const yesLabel = document.createElement("label");
  yesLabel.classList = "popLabelYes";
  yesLabel.innerText = "Yes";
  yesLabel.htmlFor = "popInputYes";
  leftCard.appendChild(yesLabel);
  //input
  const yesInput = document.createElement("input");
  yesInput.classList = "popInputYes";
  yesInput.name = "popInput";
  yesInput.type = "radio";
  yesInput.checked = isRead
  leftCard.appendChild(yesInput);
  // No
  //label
  const noLabel = document.createElement("label");
  noLabel.classList = "popLabelNo";
  noLabel.innerText = "No";
  noLabel.htmlFor = "popInputNo";
  leftCard.appendChild(noLabel);
  //input
  const noInput = document.createElement("input");
  noInput.classList = "popInputNo";
  noInput.name = "popInput";
  noInput.type = "radio";
  noInput.checked = !isRead
  leftCard.appendChild(noInput);
  // Save Button
  const save = document.createElement("input");
  save.classList = "submitShelf";
  save.type = "button";
  save.value = "Shelf-it!";
  // Updade book in firestore
  save.addEventListener("click", () => {
    updateBook(
      id,
      cardToEdit[0].value,
      cardToEdit[1].value,
      cardToEdit[2].checked ? "You read it!" : "Not read"
    );
    // UI updates even if data is not modified, so it is not a responsability of loadBooks()
    updateCard(id)
  });
  cardToEdit.appendChild(save);
  for (let i = 0; i < cardToEdit.length; i++) {
    cardToEdit[i].removeAttribute(`readonly`);
  }
}

function deleteCard(id) {
  document.getElementById(id).remove();
  const cardWraper = document.getElementById("cardWrapper");
  Array.from(document.querySelectorAll(".bookCard")).length
    ? null
    : (cardWrapper.style.display = "none");
}

export {
  AddBookToFirebase,
  deleteCard,
  saveBook,
  createAndInsertCard,
  updateCard,
};
