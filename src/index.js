const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    },
  },
});
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/bookstores", async (req, res) => {
  try {
    const { name, address, link, subscribers } = req.body;
    const bookstore = await prisma.book_stores.create({
      data: {
        name,
        address,
        link,
        subscribers,
      },
    });
    res.json(bookstore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating book store" });
  }
});

app.get("/bookstores", async (req, res) => {
  try {
    const bookstores = await prisma.book_stores.findMany();
    res.json(bookstores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching book stores" });
  }
});

app.get("/bookstores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bookstore = await prisma.book_stores.findUnique({
      where: { id: parseInt(id) },
    });
    if (!bookstore) {
      return res.status(404).json({ error: "Book store not found" });
    }
    res.json(bookstore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching book store" });
  }
});

app.put("/bookstores/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, link, subscribers } = req.body;
  try {
    const updatedBookstore = await prisma.book_stores.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        link,
        subscribers,
      },
    });
    res.json(updatedBookstore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating book store" });
  }
});

app.delete("/bookstores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book_stores.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Book store deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting book store" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
