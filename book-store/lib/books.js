import axios from "axios";

export async function getBooks() {
  const books = await axios
    .get(`${process.env.apiServer}/books`)
    .catch((e) => console.log(e));

  return books;
}

export async function addBook(books) {
  const data = {
    ...books,
    a_id: parseInt(books.a_id),
    p_id: parseInt(books.p_id),
  };
  const res = await axios
    .post(`${process.env.apiServer}/books/add`, data)
    .catch((e) => console.log(e));

  return res;
}

export function deleteBooks(ids) {
  let responses = [];
  ids.map(async (id) => {
    const res = await axios
      .post(`${process.env.apiServer}/books/del`, { isbn: id })
      .catch((e) => console.log(e));
    responses.push(res);
    console.log(res);
  });
  return responses;
}
