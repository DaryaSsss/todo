import {
  useFirestoreCollectionMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { collection, query , onSnapshot} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Todos from '../components/Todos';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes } from "firebase/storage";
import { generatePushID } from '../helpers';


const Home = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState([])
  const [allTodos, setAllTodos] = useState([])

  const refTodos = collection(firestore, 'todos');
  const mutationCreateTodo = useFirestoreCollectionMutation(refTodos);

  /** function to get reactive list of all todos 
   * @returns { any[] } - return array of all todos by setting them in allTodos (useState - setAllTodos)
  */
  useEffect(() => {
    const q = query(collection(firestore, "todos"));
    onSnapshot(q, (querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        const todo = {
          id: doc.id,
          name: doc.data().name,
          desc: doc.data().desc,
          date: doc.data().date,
          isDone: doc.data().isDone,
          fileId: doc.data().fileId,
        }
          todos.push(todo);
      });
      setAllTodos(todos)
    });    
  }, [])
  
  /** function to create a new todo */
  const handleTodo = async e => {
    const ID = generatePushID();
    e.preventDefault();
    await onFileUpload({ID});
    await mutationCreateTodo.mutate({
      name,
      desc,
      date,
      isDone: false,
      fileId: ID,
    });
  };

  /** function to upload files in storage 
   * @param { string } ID - fileId from todo document, used to name storage folder for todo files
  */
  const onFileUpload = async ({ID}) => {
    if (uploadedFile === null) return;

    for (const file of Array.from(uploadedFile)) {
      const fileRef = ref(storage, `/${ID}/${file.name}`)
      await uploadBytes(fileRef, file)
    }
  }

  return (
    <div>
      <h1 className="App-header">Your TO-DO list</h1>
      <div className="Home">
        <form onSubmit={handleTodo}>
          <div className="CreateTodo">
            <h2>Create a new to-do</h2>
            <label>Name*</label>
            <input
              type="text"
              maxLength={32}
              placeholder="Finish test"
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              required
            />
            <label>Descripiton*</label>
            <textarea
              rows={5}
              value={desc}
              placeholder="Finish test for work"
              onChange={e => setDesc(e.currentTarget.value)}
              required
            />
            <label>Deadline*</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.currentTarget.value)}
              required
            />
            <input type="file" multiple onChange={(e) => setUploadedFile(e.target.files)} />
            <button type="submit" disabled={mutationCreateTodo.isLoading}>
              Save to-do
            </button>
          </div>
        </form>
        <div>
          {allTodos.isLoading ? (
            <div>Loading...</div>
          ) : (
            allTodos.length === 0 ?
            (<div className='NoTodos'>No todos</div>) : (<Todos todos={allTodos} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
