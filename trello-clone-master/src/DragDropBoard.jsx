import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./index.css";

const initialData = {
  lists: {
    "to-do": {
      id: "to-do",
      title: "To Do",
      items: [
        { id: "1", content: "Pankaj" },
        { id: "2", content: "Kumar" },
        { id: "3", content: "Dhal" },
        { id: "4", content: "css: fix bugs" },
        { id: "5", content: "testing: add tests for reducer fns & utils" },
      ],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      items: [{ id: "6", content: "PK Dhal" }],
    },
    done: {
      id: "done",
      title: "Done",
      items: [
        { id: "7", content: "Full-Stack" },
        {
          id: "8",
          content:
            "Bangalore",
        },
        { id: "9", content: "list: add, remove, move" },
        { id: "10", content: "task: add, edit, remove, move" },
      ],
    },
  },
};

const DragDropBoard = () => {
  const [boardData, setBoardData] = useState(initialData);
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardContent, setNewCardContent] = useState("");
  const [editingCard, setEditingCard] = useState({
    listId: "",
    cardId: "",
    content: "",
  });
  const [showAddCardInput, setShowAddCardInput] = useState(""); // Track which list should show add card input

  // Handle drag and drop
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = boardData.lists[source.droppableId];
    const destinationList = boardData.lists[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const [movedItem] = sourceList.items.splice(source.index, 1);
      sourceList.items.splice(destination.index, 0, movedItem);
    } else {
      const [movedItem] = sourceList.items.splice(source.index, 1);
      destinationList.items.splice(destination.index, 0, movedItem);
    }

    setBoardData({
      ...boardData,
      lists: {
        ...boardData.lists,
        [sourceList.id]: sourceList,
        [destinationList.id]: destinationList,
      },
    });
  };

  // Add a new list
  const addNewList = () => {
    const newListId = `list-${Date.now()}`;
    setBoardData({
      ...boardData,
      lists: {
        ...boardData.lists,
        [newListId]: { id: newListId, title: newListTitle, items: [] },
      },
    });
    setNewListTitle("");
  };

  // Add a new card to a list
  const addNewCard = (listId) => {
    const newCardId = `${Date.now()}`;
    const list = boardData.lists[listId];
    list.items.push({ id: newCardId, content: newCardContent });
    setBoardData({
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: list,
      },
    });
    setNewCardContent("");
    setShowAddCardInput(""); // Hide the input after adding the card
  };

  // Delete a list
  const deleteList = (listId) => {
    const updatedLists = { ...boardData.lists };
    delete updatedLists[listId];
    setBoardData({ ...boardData, lists: updatedLists });
  };

  // Edit a card
  const editCard = (listId, cardId, content) => {
    setEditingCard({ listId, cardId, content });
  };

  // Save edited card
  const saveEditedCard = () => {
    const { listId, cardId, content } = editingCard;
    const list = boardData.lists[listId];
    const card = list.items.find((item) => item.id === cardId);
    card.content = content;
    setBoardData({
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: list,
      },
    });
    setEditingCard({ listId: "", cardId: "", content: "" });
  };

  // Delete a card
  const deleteCard = (listId, cardId) => {
    const list = boardData.lists[listId];
    list.items = list.items.filter((item) => item.id !== cardId);
    setBoardData({
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: list,
      },
    });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>Task Manager</h1>
      </nav>

      <div className="board">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {Object.values(boardData.lists).map((list) => (
            <Droppable key={list.id} droppableId={list.id}>
              {(provided) => (
                <div
                  className="list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="list-header">
                    <h2>{list.title}</h2>
                    <FaTrashAlt
                      className="delete-list"
                      onClick={() => deleteList(list.id)}
                    />
                  </div>
                  {list.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.content}
                          <div className="card-actions">
                            <FaEdit
                              className="edit-icon"
                              onClick={() =>
                                editCard(list.id, item.id, item.content)
                              }
                            />
                            <FaTrashAlt
                              className="delete-icon"
                              onClick={() => deleteCard(list.id, item.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Only show the input when the add card button for this list is clicked */}
                  {showAddCardInput === list.id ? (
                    <div className="add-card">
                      <input
                        type="text"
                        value={newCardContent}
                        onChange={(e) => setNewCardContent(e.target.value)}
                        placeholder="Add a card"
                      />
                      <button
                        className="add-card-button"
                        onClick={() => addNewCard(list.id)}
                      >
                        Add Card
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-card-button"
                      onClick={() => setShowAddCardInput(list.id)}
                    >
                      Add Card
                    </button>
                  )}
                </div>
              )}
            </Droppable>
          ))}
          <div className="new-list">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Add a new list"
            />
            <button onClick={addNewList}>Add List</button>
          </div>
        </DragDropContext>

        {editingCard.cardId && (
          <div className="edit-card-modal">
            <h3>Edit Card</h3>
            <input
              type="text"
              value={editingCard.content}
              onChange={(e) =>
                setEditingCard({ ...editingCard, content: e.target.value })
              }
            />
            <button onClick={saveEditedCard}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropBoard;
