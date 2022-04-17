import axios from "axios";

export async function getAuthors() {
  const authors = await axios.get(`${process.env.apiServer}/authors`);

  return authors;
}

export async function addAuthor(author) {
  const res = await axios
    .post(`${process.env.apiServer}/authors/add`)
    .catch((e) => console.log(e));

  return res;
}
