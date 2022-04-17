import Head from "next/head";
import { Container, Table, Title } from "@mantine/core";
import { getBooks } from "../lib/books";
import axios from "axios";
import { useState, useEffect } from "react";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
    </Layout>
  );
}
