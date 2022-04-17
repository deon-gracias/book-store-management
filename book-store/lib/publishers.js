import axios from "axios";

export async function getPublishers() {
  const publishers = await axios.get(`${process.env.apiServer}/publishers`);

  return publishers;
}

export async function addPublisher(publisher) {
  const res = await axios
    .post(`${process.env.apiServer}/publishers/add`)
    .catch((e) => console.log(e));

  return res;
}
