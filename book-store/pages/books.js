import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Container,
  LoadingOverlay,
  Modal,
  NativeSelect,
  NumberInput,
  Paper,
  SimpleGrid,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import axios from "axios";
import { Pencil, Plus, Trash } from "tabler-icons-react";
import Layout from "../components/layout";
import { getBooks, addBook, deleteBooks } from "../lib/books";
import { getAuthors } from "../lib/authors";
import { getPublishers } from "../lib/publishers";

const bookProps = { ISBN: "", Name: "", Price: 0, Author: "", Publisher: "" };

export default function Books() {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [addBookModal, setAddBookModal] = useState(false);

  const fetchBooks = async () => {
    const res = await getBooks();
    if (res.status === 200) {
      setBooks(res.data);
      setSelectedBooks(res.data.map((e) => false));
    }
  };

  const fetchAuthors = async () => {
    const res = await getAuthors();
    if (res.status === 200) {
      res.data = res.data.map(function (obj) {
        obj["value"] = obj["id"]; // Assign new key
        delete obj["id"]; // Delete old key
        obj["label"] = obj["name"]; // Assign new key
        delete obj["name"]; // Delete old key
        return obj;
      });
      setAuthors(res.data);
    }
  };

  const fetchPublishers = async () => {
    const res = await getPublishers();
    console.log(res);
    if (res.status === 200) {
      res.data = res.data.map(function (obj) {
        obj["value"] = obj["id"]; // Assign new key
        delete obj["id"]; // Delete old key
        obj["label"] = obj["name"]; // Assign new key
        delete obj["name"]; // Delete old key
        return obj;
      });
      setPublishers(res.data);
    }
  };

  const deleteSelectedBooks = () => {
    let ids = [];
    selectedBooks.map((selected, index) => {
      if (selected) ids.push(books[index].isbn);
    });
    const responses = deleteBooks(ids);
    fetchBooks();
    console.log(responses);
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchPublishers();
    console.log("Books: ", books);
    console.log("Authors: ", authors);
    console.log("Publishers: ", publishers);
  }, [addBookModal]);

  const theaders = (
    <tr>
      {["", ...Object.keys(bookProps)].map((e, index) => (
        <th key={`${e}-${index}`}>{e}</th>
      ))}
    </tr>
  );

  return (
    <Layout>
      <Head>
        <title>Books</title>
      </Head>
      <AddBookModal
        authors={authors}
        publishers={publishers}
        opened={addBookModal}
        onClose={() => setAddBookModal(false)}
      />
      <Container>
        <SimpleGrid>
          <Title>Books</Title>
          <SimpleGrid cols={3}>
            <Button
              leftIcon={<Plus />}
              color="green"
              onClick={() => setAddBookModal(true)}
            >
              Add Book
            </Button>
            <Button leftIcon={<Pencil />}>Edit Book</Button>
            <Button
              leftIcon={<Trash />}
              color="red"
              onClick={() => deleteSelectedBooks()}
            >
              Delete Book
            </Button>
          </SimpleGrid>
          <Paper>
            <Table highlightOnHover>
              <thead>{theaders}</thead>
              {books ? (
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.isbn}>
                      <td>
                        <Checkbox
                          onChange={(event) => {
                            const temp = selectedBooks;
                            temp[index] = event.currentTarget.checked;
                            setSelectedBooks(temp);
                            console.log(selectedBooks);
                          }}
                        />
                      </td>
                      <td>{book.isbn}</td>
                      <td>{book.name}</td>
                      <td>{book.price}</td>
                      <td>{book.author}</td>
                      <td>{book.publisher}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <LoadingOverlay />
              )}
            </Table>
          </Paper>
        </SimpleGrid>
      </Container>
    </Layout>
  );
}

const AddBookModal = ({ authors, publishers, opened, onClose }) => {
  const form = useForm({
    initialValues: {
      isbn: "",
      name: "",
      price: 0,
      a_id: authors.length > 0 ? authors[0].value : 1,
      p_id: publishers.length > 0 ? publishers[0].value : 1,
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await addBook(form.values);
    if (res.status != 200) form.setErrors("Couldn't Post");
    else {
      onClose();
      console.log(res.data);
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Add Book">
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextInput label="ISBN" {...form.getInputProps("isbn")} required />
        <TextInput label="Name" {...form.getInputProps("name")} required />
        <NumberInput label="Price" {...form.getInputProps("price")} required />
        <NativeSelect
          data={authors}
          label="Author"
          {...form.getInputProps("a_id")}
          required
        />
        <NativeSelect
          data={publishers}
          label="Publisher"
          {...form.getInputProps("p_id")}
          required
        />
        <Button mt={20} type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
