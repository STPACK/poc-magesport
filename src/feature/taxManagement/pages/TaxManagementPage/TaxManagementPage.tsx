/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TaxManagementPageProps } from "./interface";

// app/manage/page.tsx
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export function TaxManagementPage({ className }: TaxManagementPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const itemsCollection = collection(db, "items");

  // Fetch items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(itemsCollection);
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      setItems(itemsData);
    };
    fetchItems();
  }, []);

  // Create a new item with an image
  const createItem = async () => {
    if (name.trim() === "" || description.trim() === "") return;

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImageToStorage(imageFile);
    }

    await addDoc(itemsCollection, { name, description, imageUrl });
    setName("");
    setDescription("");
    setImageFile(null);
  };

  // Update an existing item with a new image
  const updateItem = async () => {
    if (!selectedId || name.trim() === "" || description.trim() === "") return;

    const itemRef = doc(db, "items", selectedId);
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImageToStorage(imageFile);
    }

    await updateDoc(itemRef, { name, description, imageUrl });
    setSelectedId(null);
    setName("");
    setDescription("");
    setImageFile(null);
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
  };

  // Select an item for editing
  const selectItem = (item: Item) => {
    setSelectedId(item.id);
    setName(item.name);
    setDescription(item.description);
    setImageFile(null); // Reset the file input
  };

  // Handle file upload to Firebase Storage
  const uploadImageToStorage = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div>
      <h1>Manage Items</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectedId ? updateItem() : createItem();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />
        <button type="submit">
          {selectedId ? "Update Item" : "Create Item"}
        </button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} width="100" />
            )}
            <button onClick={() => selectItem(item)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
